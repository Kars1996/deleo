# Token Helper

a standalone python tool to extract discord tokens from browser storage. useful for quickly getting your token without manual copy-pasting from devtools.

## Installation

requires python 3.8+ and pip:

```bash
cd scripts
pip install -r requirements.txt
```

## Usage

### Scan all browsers
```bash
python token-helper.py
```

### Output as JSON
```bash
python token-helper.py --json
```

### Save to deleo cache
```bash
python token-helper.py --save
```

this saves the first found token to `~/.deleo_cached_token` so deleo can use it automatically.

### Validate a specific token
```bash
python token-helper.py --token YOUR_TOKEN_HERE
```

## Supported Browsers

- discord (stable, canary, ptb)
- google chrome
- microsoft edge
- brave
- opera / opera gx
- firefox
- vivaldi
- and more chromium-based browsers

## Security Note

this tool reads from browser storage files which requires:
- windows (uses dpapi for decryption)
- no admin privileges needed for most browsers
- discord clients may require the app to be closed

extracted tokens are only as secure as your system. don't share them.
