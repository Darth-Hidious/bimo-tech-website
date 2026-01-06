import os
import re
import json

# CONFIGURATION
TARGET_DIRS = ["src/app", "src/components"]
JSON_SOURCE = "src/locales/en.json"

def load_translations(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    print(f"Error: Could not find {filepath}")
    return {}

def restore_file(filepath, translations):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    modified = False

    # Regex to match the patterns created by the bad extractor
    # 1. Text Nodes: >{t('txt_...')}<
    # We want to restore to: >Original Content<
    TEXT_NODE_REGEX = re.compile(r">{t\('(txt_[a-f0-9]+)'\)}<")

    # 2. Attributes: ={t('txt_...')}
    # We want to restore to: ="Original Content"
    ATTR_REGEX = re.compile(r"={t\('(txt_[a-f0-9]+)'\)}")

    def replace_text_node(match):
        nonlocal modified
        key = match.group(1)
        if key in translations:
            original_text = translations[key]
            # print(f"Restoring text node: {key} -> '{original_text}'")
            modified = True
            return f">{original_text}<"
        else:
            print(f"Warning: Key {key} not found in {JSON_SOURCE} for file {filepath}")
            return match.group(0)

    def replace_attribute(match):
        nonlocal modified
        key = match.group(1)
        if key in translations:
            original_text = translations[key]
            # Escape double quotes for attribute values
            safe_text = original_text.replace('"', '&quot;')
            # print(f"Restoring attribute: {key} -> '{original_text}'")
            modified = True
            return f'="{safe_text}"'
        else:
            print(f"Warning: Key {key} not found in {JSON_SOURCE} for file {filepath}")
            return match.group(0)

    # Apply substitutions
    content = TEXT_NODE_REGEX.sub(replace_text_node, content)
    content = ATTR_REGEX.sub(replace_attribute, content)

    if modified:
        print(f"Restored: {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

def main():
    print("--- Starting Restoration ---")
    translations = load_translations(JSON_SOURCE)
    print(f"Loaded {len(translations)} translation keys.")

    count = 0
    for target_dir in TARGET_DIRS:
        for root, dirs, files in os.walk(target_dir):
            for file in files:
                if file.endswith((".tsx", ".jsx", ".ts", ".js")):
                    restore_file(os.path.join(root, file), translations)
                    count += 1
    
    print(f"--- Restoration Complete over {count} files ---")

if __name__ == "__main__":
    main()
