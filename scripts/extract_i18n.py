import os
import re
import json
import hashlib
import glob

# CONFIGURATION
TARGET_DIRS = ["src/app", "src/components"]
JSON_OUTPUT = "src/locales/en.json"
I18N_WRAPPER_START = "{t('"
I18N_WRAPPER_END = "')}"
MIN_TEXT_LENGTH = 3

# Regex patterns for JSX
# 1. Text between tags: <div>Hello</div> -> Matches "Hello"
# Captures: >(content)<
TEXT_NODE_REGEX = re.compile(r'>([^<>{}]+)<')

# 2. Attributes: placeholder="Search"
# Captures: attribute, quote, content, quote
ATTR_REGEX = re.compile(r'\b(placeholder|title|alt|aria-label)=(["\'])([^"\']+)\2')

extracted_translations = {}

def generate_key(text):
    hash_object = hashlib.md5(text.encode())
    return f"txt_{hash_object.hexdigest()[:8]}"

def load_existing_translations(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return {}
    return {}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    modified = False

    # 1. Replace Text Nodes
    def replace_text_node(match):
        nonlocal modified
        text = match.group(1)
        stripped = text.strip()
        
        if len(stripped) < MIN_TEXT_LENGTH:
            return match.group(0)
            
        # Avoid double/nested replacement
        if "t(" in text:
            return match.group(0)

        key = generate_key(stripped)
        extracted_translations[key] = stripped
        modified = True
        
        # Preserve whitespace around the stripped text if necessary, 
        # but for simplicity in this brute force, we just replace the content
        # Note: In JSX, whitespace handling can be tricky. 
        # >  Hello  < becomes >{t('key')}< which might lose spaces.
        # Ideally: >{' ' + t('key') + ' '}< but let's stick to simple replacement first.
        
        print(f"Extracted node: '{stripped}' -> {key}")
        return f">{I18N_WRAPPER_START}{key}{I18N_WRAPPER_END}<"

    content = TEXT_NODE_REGEX.sub(replace_text_node, content)

    # 2. Replace Attributes
    def replace_attribute(match):
        nonlocal modified
        attr_name = match.group(1)
        quote = match.group(2)
        text = match.group(3)
        
        if len(text) < MIN_TEXT_LENGTH:
            return match.group(0)
            
        if "t(" in text:
            return match.group(0)

        key = generate_key(text)
        extracted_translations[key] = text
        modified = True
        
        print(f"Extracted attr: '{text}' -> {key}")
        
        # JSX attribute replacement: placeholder="Text" -> placeholder={t('key')}
        return f"{attr_name}={I18N_WRAPPER_START}{key}{I18N_WRAPPER_END}"

    content = ATTR_REGEX.sub(replace_attribute, content)

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# --- MAIN ---
print("--- Starting Extraction ---")

# Load existing keys to merge (optional, mostly we interpret 'extracted' as new ones, 
# but we should append to the main file)
current_translations = load_existing_translations(JSON_OUTPUT)
extracted_translations.update(current_translations) 

for target_dir in TARGET_DIRS:
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith((".tsx", ".jsx", ".ts", ".js")):
                process_file(os.path.join(root, file))

# Save back to JSON
# We want to keep existing keys and add new brute-forced ones.
# The `extracted_translations` dict started with existing ones and added new ones.
with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(extracted_translations, f, indent=2, ensure_ascii=False)

print(f"Done. Total keys: {len(extracted_translations)}")
