#!/usr/bin/env python3
"""
delo-token-helper - extracts discord tokens from browser storage
"""

import os
import sys
import json
import base64
import re
import argparse
from pathlib import Path
from typing import Dict, Optional, List

try:
    import httpx
    from Crypto.Cipher import AES
    from win32crypt import CryptUnprotectData
except ImportError:
    print("error: required dependencies not installed")
    print("run: pip install pycryptodome pywin32 httpx")
    sys.exit(1)


def get_roaming_path() -> str:
    return os.getenv("APPDATA", "")


def get_localappdata_path() -> str:
    return os.getenv("LOCALAPPDATA", "")


def get_browser_paths() -> Dict[str, str]:
    roaming = get_roaming_path()
    local = get_localappdata_path()
    
    return {
        "discord": os.path.join(roaming, "discord", "Local Storage", "leveldb"),
        "discordcanary": os.path.join(roaming, "discordcanary", "Local Storage", "leveldb"),
        "discordptb": os.path.join(roaming, "discordptb", "Local Storage", "leveldb"),
        "lightcord": os.path.join(roaming, "Lightcord", "Local Storage", "leveldb"),
        "opera": os.path.join(roaming, "Opera Software", "Opera Stable", "Local Storage", "leveldb"),
        "operagx": os.path.join(roaming, "Opera Software", "Opera GX Stable", "Local Storage", "leveldb"),
        "chrome": os.path.join(local, "Google", "Chrome", "User Data", "Default", "Local Storage", "leveldb"),
        "chromesxs": os.path.join(local, "Google", "Chrome SxS", "User Data", "Local Storage", "leveldb"),
        "brave": os.path.join(local, "BraveSoftware", "Brave-Browser", "User Data", "Default", "Local Storage", "leveldb"),
        "edge": os.path.join(local, "Microsoft", "Edge", "User Data", "Default", "Local Storage", "leveldb"),
        "vivaldi": os.path.join(local, "Vivaldi", "User Data", "Default", "Local Storage", "leveldb"),
        "yandex": os.path.join(local, "Yandex", "YandexBrowser", "User Data", "Default", "Local Storage", "leveldb"),
        "firefox": os.path.join(roaming, "Mozilla", "Firefox", "Profiles"),
    }


def validate_token(token: str) -> Optional[Dict]:
    """validate a discord token by fetching user info"""
    for attempt in range(3):
        try:
            headers = {"Authorization": token}
            response = httpx.get("https://discord.com/api/v9/users/@me", headers=headers, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                data["token"] = token
                return data
            elif response.status_code == 401:
                # try with MT prefix if missing
                if not token.startswith("MT"):
                    headers["Authorization"] = f"MT{token}"
                    response = httpx.get("https://discord.com/api/v9/users/@me", headers=headers, timeout=5)
                    if response.status_code == 200:
                        data = response.json()
                        data["token"] = headers["Authorization"]
                        return data
                return None
        except Exception:
            pass
    return None


def decrypt_token(encrypted_token: bytes, key: bytes) -> Optional[str]:
    """decrypt an encrypted discord token"""
    try:
        # extract iv and payload
        iv = encrypted_token[3:15]
        payload = encrypted_token[15:]
        
        # decrypt
        cipher = AES.new(key, AES.MODE_GCM, iv)
        decrypted = cipher.decrypt(payload)[:-16]  # remove auth tag
        return decrypted.decode("utf-8", errors="ignore")
    except Exception:
        return None


def get_decryption_key(local_state_path: str) -> Optional[bytes]:
    """get the decryption key from discord's local state file"""
    try:
        with open(local_state_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            encrypted_key = base64.b64decode(data["os_crypt"]["encrypted_key"])
            # remove DPAPI prefix and decrypt
            decrypted_key = CryptUnprotectData(encrypted_key[5:], None, None, None, 0)[1]
            return decrypted_key
    except Exception:
        return None


def extract_tokens_from_content(content: str, key: Optional[bytes] = None) -> List[str]:
    """extract tokens from file content"""
    tokens = []
    
    # look for encrypted tokens (dQw4w9WgXcQ: prefix)
    if key:
        for match in re.findall(r'dQw4w9WgXcQ:[^"\']*', content):
            try:
                encrypted = base64.b64decode(match.split(":")[1])
                token = decrypt_token(encrypted, key)
                if token:
                    tokens.append(token)
            except Exception:
                pass
    
    # look for plain tokens
    for match in re.findall(r'[\w-]{24}\.[\w-]{6}\.[\w-]{25,110}', content):
        tokens.append(match)
    
    return tokens


def scan_discord_client(path: str, roaming_path: str, client_name: str) -> List[Dict]:
    """scan a discord client for tokens"""
    accounts = []
    local_state_path = os.path.join(roaming_path, client_name, "Local State")
    
    key = get_decryption_key(local_state_path) if os.path.exists(local_state_path) else None
    
    if not os.path.exists(path):
        return accounts
    
    for filename in os.listdir(path):
        if not (filename.endswith(".log") or filename.endswith(".ldb")):
            continue
        
        filepath = os.path.join(path, filename)
        try:
            with open(filepath, "r", errors="ignore") as f:
                content = f.read()
                tokens = extract_tokens_from_content(content, key)
                
                for token in tokens:
                    account = validate_token(token)
                    if account:
                        account["source"] = client_name
                        accounts.append(account)
        except Exception:
            pass
    
    return accounts


def scan_chromium_browser(path: str) -> List[Dict]:
    """scan a chromium-based browser for tokens"""
    accounts = []
    
    # handle multiple profiles
    base_path = path.split("User Data")[0] + "User Data"
    profiles = ["Default"]
    
    if os.path.exists(base_path):
        for item in os.listdir(base_path):
            if item.startswith("Profile"):
                profiles.append(item)
    
    for profile in profiles:
        profile_path = os.path.join(base_path, profile, "Local Storage", "leveldb")
        if not os.path.exists(profile_path):
            continue
        
        for filename in os.listdir(profile_path):
            if not (filename.endswith(".log") or filename.endswith(".ldb")):
                continue
            
            filepath = os.path.join(profile_path, filename)
            try:
                with open(filepath, "r", errors="ignore") as f:
                    content = f.read()
                    tokens = extract_tokens_from_content(content)
                    
                    for token in tokens:
                        account = validate_token(token)
                        if account:
                            account["source"] = f"browser:{profile}"
                            accounts.append(account)
            except Exception:
                pass
    
    return accounts


def scan_firefox(path: str) -> List[Dict]:
    """scan firefox for tokens"""
    accounts = []
    
    if not os.path.exists(path):
        return accounts
    
    for root, dirs, files in os.walk(path):
        for filename in files:
            if not filename.endswith(".sqlite"):
                continue
            
            filepath = os.path.join(root, filename)
            try:
                with open(filepath, "r", errors="ignore") as f:
                    content = f.read()
                    tokens = extract_tokens_from_content(content)
                    
                    for token in tokens:
                        account = validate_token(token)
                        if account:
                            account["source"] = "firefox"
                            accounts.append(account)
            except Exception:
                pass
    
    return accounts


def get_all_accounts() -> Dict[str, Dict]:
    """scan all browsers and discord clients for accounts"""
    accounts = {}
    browser_paths = get_browser_paths()
    roaming = get_roaming_path()
    
    for name, path in browser_paths.items():
        try:
            if "cord" in name:
                # discord clients
                found = scan_discord_client(path, roaming, name)
            elif name == "firefox":
                found = scan_firefox(path)
            else:
                found = scan_chromium_browser(path)
            
            for account in found:
                user_id = account.get("id")
                if user_id and user_id not in accounts:
                    accounts[user_id] = account
        except Exception as _:
            pass
    
    return accounts


def format_username(account: Dict) -> str:
    """format discord username from account data"""
    global_name = account.get("global_name")
    username = account.get("username", "unknown")
    discriminator = account.get("discriminator", "0")
    
    if global_name:
        return f"{global_name} (@{username})"
    elif discriminator and discriminator != "0":
        return f"{username}#{discriminator}"
    else:
        return username


def main():
    parser = argparse.ArgumentParser(
        description="extract discord tokens from browser storage",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
examples:
  %(prog)s                    # scan all browsers and show accounts
  %(prog)s --json             # output as json
  %(prog)s --save             # save first found token to deleo cache
  %(prog)s --token TOKEN      # validate a specific token
        """
    )
    
    parser.add_argument("--json", action="store_true", help="output as json")
    parser.add_argument("--save", action="store_true", help="save first token to deleo cache")
    parser.add_argument("--token", type=str, help="validate a specific token")
    
    args = parser.parse_args()
    
    # validate single token mode
    if args.token:
        result = validate_token(args.token)
        if result:
            print("valid token!")
            print(f"  user: {format_username(result)}")
            print(f"  id: {result['id']}")
            print(f"  email: {result.get('email', 'N/A')}")
            sys.exit(0)
        else:
            print("error: invalid token")
            sys.exit(1)
    
    # scan mode
    print("scanning for discord tokens...")
    print()
    
    accounts = get_all_accounts()
    
    if not accounts:
        print("no discord accounts found.")
        print("make sure discord or a browser with discord logged in is installed.")
        sys.exit(1)
    
    # display results
    if args.json:
        print(json.dumps(list(accounts.values()), indent=2))
    else:
        print(f"found {len(accounts)} account(s):\n")
        
        for i, (user_id, account) in enumerate(accounts.items(), 1):
            print(f"[{i}] {format_username(account)}")
            print(f"    id: {user_id}")
            print(f"    source: {account.get('source', 'unknown')}")
            print(f"    token: {account['token'][:20]}...{account['token'][-10:]}")
            print()
    
    # save to cache
    if args.save:
        first_account = list(accounts.values())[0]
        token = first_account["token"]
        
        cache_path = Path.home() / ".deleo_cached_token"
        try:
            with open(cache_path, "w") as f:
                f.write(token)
            print(f"token saved to {cache_path}")
            print("deleo will use this token automatically on next launch")
        except Exception as e:
            print(f"error saving token: {e}")
            sys.exit(1)


if __name__ == "__main__":
    main()
