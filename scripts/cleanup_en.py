import json
import os

JSON_PATH = "src/locales/en.json"

def cleanup():
    if not os.path.exists(JSON_PATH):
        print("en.json not found")
        return

    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    initial_count = len(data)
    # Filter out keys starting with txt_
    clean_data = {k: v for k, v in data.items() if not k.startswith('txt_')}
    final_count = len(clean_data)

    print(f"Removed {initial_count - final_count} garbage keys.")

    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(clean_data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    cleanup()
