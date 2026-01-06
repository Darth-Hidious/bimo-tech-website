# i18n Automation Pipeline

This project uses a "Brute Force" extraction and "Just-In-Time" translation strategy to manage internationalization.

## Scripts

### 1. Extraction (`scripts/extract_i18n.py`)
Scans `src/app` and `src/components` for hardcoded strings in JSX/TSX, replaces them with deterministic hash-based keys (e.g., `t('txt_a1b2c3')`), and saves the source strings to `src/locales/en.json`.

**Usage:**
```bash
python3 scripts/extract_i18n.py
```

### 2. Translation (`scripts/translate_i18n.py`)
Fills in missing keys in other locale files (`pl.json`, `de.json`, etc.) using NLLB-200 (Neural Machine Translation).

**System Requirements:**
- Python 3.8+
- ~2GB RAM
- ~1GB Disk Space (for AI Model)
- Internet connection (First run only, for model download)

**Prerequisites Installation:**
```bash
pip install ctranslate2 transformers sentencepiece filelock
```
*Note: If you have a GPU, ensure you have the appropriate CUDA drivers, although the script defaults to CPU if not found.*

**Usage:**
```bash
python3 scripts/translate_i18n.py
```
On the first run, it will automatically download and convert the `nllb-200-distilled-600M` model.

## Workflow Integration
1.  **Develop**: Write code with hardcoded English strings.
2.  **Extract**: Run `scripts/extract_i18n.py` before committing.
    - Check the diffs to ensure extraction was clean.
3.  **Translate**: Run `scripts/translate_i18n.py` to auto-generate other languages.
    - This can be added to a CI/CD pipeline.
