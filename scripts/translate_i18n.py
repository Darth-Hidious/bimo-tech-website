import os
import json
import glob
import time
from filelock import FileLock

# Check for libraries
try:
    import ctranslate2
    import transformers
except ImportError:
    print("CRITICAL: Libraries not found. Please run: pip install ctranslate2 transformers sentencepiece filelock")
    exit(1)

# CONFIGURATION
LOCALES_DIR = "src/locales"
SOURCE_LANG_FILE = "en.json"
MODEL_PATH = "nllb-200-distilled-600M-int8"

# Map file prefixes to FLORES-200 codes
# Adjust based on your actual filenames
LANG_MAP = {
    "pl.json": "pol_Latn",
    "de.json": "deu_Latn",
    "fr.json": "fra_Latn",
    "es.json": "spa_Latn",
    "it.json": "ita_Latn",
    "nl.json": "nld_Latn",
    "pt.json": "por_Latn",
    "sv.json": "swe_Latn",
    "fi.json": "fin_Latn",
    "da.json": "dan_Latn",
    "cz.json": "ces_Latn" # Assuming Czech
}

class JITTranslator:
    def __init__(self, model_path=MODEL_PATH):
        self.device = "cuda" if ctranslate2.get_cuda_device_count() > 0 else "cpu"
        print(f"Loading NLLB on {self.device}...")
        
        # Auto-download if not present (handled by huggingface hub usually, but ctranslate2 needs conversion 
        # or direct download. For simplicity, we use the raw ctranslate2 load.
        # Ideally we'd converting on the fly or downloading a converted model.
        # BUT for this script to be standalone as requested:
        # We will assume the user or script directs the model load properly.
        # Actually, let's use the transformers method to get the model if needed, 
        # but ctranslate2 is faster. 
        # To make it "just work", checking if folder exists.
        
        if not os.path.exists(model_path):
            print(f"Model not found at {model_path}. Attempting to download and convert...")
            try:
                # We use subprocess to run the converter CLI which is installed with ctranslate2
                import subprocess
                command = [
                    "ct2-transformers-converter",
                    "--model", "facebook/nllb-200-distilled-600M",
                    "--quantization", "int8",
                    "--output_dir", model_path
                ]
                print(f"Running: {' '.join(command)}")
                subprocess.run(command, check=True)
                print("Model conversion complete.")
            except Exception as e:
                print(f"CRITICAL: Failed to download/convert model. Error: {e}")
                print("Ensure you have internet access and 'ct2-transformers-converter' is in your PATH.")
                exit(1)

        self.translator = ctranslate2.Translator(model_path, device=self.device)
        self.tokenizer = transformers.AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M")

    def translate_batch(self, texts, target_lang_code):
        if not texts:
            return []
            
        print(f"Translating {len(texts)} items to {target_lang_code}...")
        
        # Tokenize
        sources = [self.tokenizer.convert_ids_to_tokens(self.tokenizer.encode(t)) for t in texts]
        
        # Translate
        results = self.translator.translate_batch(sources, target_prefix=[[target_lang_code]] * len(sources))
        
        # Decode
        decoded_results = []
        for result in results:
            target = result.hypotheses[0]
            decoded_results.append(self.tokenizer.decode(self.tokenizer.convert_tokens_to_ids(target)))
            
        return decoded_results

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def main():
    source_path = os.path.join(LOCALES_DIR, SOURCE_LANG_FILE)
    if not os.path.exists(source_path):
        print(f"Source file {source_path} not found!")
        return

    source_data = load_json(source_path)
    # Flatten source data for easier comparison if nested?
    # For now, let's assume flat or we walk it. 
    # But NLLB prompt example used flat keys.
    # The existing en.json is NESTED.
    # Ref: keys are "nav.home", "hero.title".
    # The extract script produced FLAT keys "txt_hash".
    # So we have a mix. 
    # We need a flattener/unflattener or just simple traversal.
    
    # Simple recursive traverser
    def get_missing_keys(source_obj, target_obj, prefix=""):
        missing = {}
        for k, v in source_obj.items():
            full_key = f"{prefix}.{k}" if prefix else k
            
            if isinstance(v, dict):
                # Recurse
                target_val = target_obj.get(k, {})
                if not isinstance(target_val, dict):
                     target_val = {} # Type mismatch or missing
                
                sub_missing = get_missing_keys(v, target_val, full_key)
                if sub_missing:
                    missing[k] = sub_missing
            elif isinstance(v, str):
                # String value
                if k not in target_obj:
                    missing[k] = v
        return missing

    # We also need a way to PUT translated values back into the structure
    def update_nested(target_obj, updates):
        for k, v in updates.items():
            if isinstance(v, dict):
                if k not in target_obj:
                    target_obj[k] = {}
                update_nested(target_obj[k], v)
            else:
                target_obj[k] = v

    # Initialization
    try:
        translator = JITTranslator()
    except Exception as e:
        print(f"Failed to init translator: {e}")
        return

    files = glob.glob(os.path.join(LOCALES_DIR, "*.json"))
    
    for file_path in files:
        filename = os.path.basename(file_path)
        if filename == SOURCE_LANG_FILE:
            continue
            
        if filename not in LANG_MAP:
            print(f"Skipping {filename} (no lang code mapped)")
            continue
            
        target_code = LANG_MAP[filename]
        print(f"Processing {filename} ({target_code})...")
        
        target_data = load_json(file_path)
        
        # Identify missing items
        # To batch efficiently, we first collect ALL missing strings
        
        flat_missing_map = {} # full_key -> text
        
        def collect_missing(s_obj, t_obj, path=[]):
            for k, v in s_obj.items():
                if isinstance(v, dict):
                    t_val = t_obj.get(k, {})
                    if not isinstance(t_val, dict): t_val = {}
                    collect_missing(v, t_val, path + [k])
                elif isinstance(v, str):
                    if k not in t_obj:
                        flat_missing_map[".".join(path + [k])] = v

        collect_missing(source_data, target_data)
        
        if not flat_missing_map:
            print(f"  - No missing keys.")
            continue
            
        print(f"  - Found {len(flat_missing_map)} missing keys.")
        
        # Batch Translate
        keys = list(flat_missing_map.keys())
        texts = list(flat_missing_map.values())
        
        try:
            translations = translator.translate_batch(texts, target_code)
        except Exception as e:
            print(f"Translation failed: {e}")
            continue
            
        # Re-integrate
        updates = {}
        for i, key in enumerate(keys):
            # Split key back into parts
            parts = key.split('.')
            # Build nested dict
            current = updates
            for part in parts[:-1]:
                if part not in current:
                    current[part] = {}
                current = current[part]
            current[parts[-1]] = translations[i]
            
        # Merge updates into target_data
        update_nested(target_data, updates)
        
        # Save
        save_json(file_path, target_data)
        print(f"  - Updated {filename}")

if __name__ == "__main__":
    main()
