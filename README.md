# Deleo

A desktop GUI for deleting Discord messages in bulk. Built with [electrobun](https://blackboard.sh/electrobun).

> ⚠️ **Warning**: Using self-bots violates Discord's Terms of Service. Use at your own risk.

## Background & Purpose

this project was originally created to learn about [electrobun](https://blackboard.sh/electrobun). while the framework shows promise, the development experience revealed several significant issues that made building this app more challenging than expected.

### Issues with Electrobun

**documentation gaps**: the docs felt a bit weird to me and didn't have any system to easily search the docs like systems like fumadocs or mintlify provide.

**type system problems**: the rpc type system is rigid and often fights with typescript. simple patterns like sending messages from bun to the webview required workarounds because the type definitions don't match the actual runtime behavior.

**development friction**: hot reloads are really broken at least in the version I have been using so have had to re-run the comman

**windows support**: for whatever reason the maximize function full-screened the site with no way to do un-maximize, causing the drag region to be clicked through and no native rounded corners with borderless windows. 

**bundling**: can't bundle to a stand-alone .exe but needs electrobuns custom installer

that said, electrobun does deliver on its core promise: you can build desktop apps with web tech and bun. the resulting app is small, fast, and native-feeling. but the developer experience needs significant work before it can compete with established alternatives like tauri or electron.

## Features

- auto-detect discord token from browser cache
- delete messages from dms, group chats, and servers
- adjustable deletion speed (500ms - 3s delay)
- real-time progress tracking with live feed
- stop deletion at any time

## Installation

### Prerequisites

- [bun](https://bun.sh/) installed
- windows (primary target, may work on other platforms)

### Setup

```bash
# clone the repository
git clone https://github.com/kars1996/deleo.git
cd deleo

# install dependencies
bun install

# run in development mode
bun run dev
```

## Getting Your Discord Token

### Option 1: Token Helper (Recommended)

use the included python script to automatically extract your token from discord or your browser:

```bash
cd scripts
pip install -r requirements.txt
python token-helper.py --save
```

this saves your token to `~/.deleo_cached_token` so deleo can use it automatically on the next launch.

### Option 2: Manual Extraction

1. open discord in your browser
2. open devtools (f12)
3. go to network tab
4. send any message
5. click the request and find the `authorization` header
6. copy that token

when entering your token manually in deleo, you can choose to save it for faster login next time.

## Usage

1. **authentication**: choose "auto-detect" to load cached token or "enter manually" to paste your token
2. **channel selection**: select which channels to delete messages from
3. **settings**: choose deletion delay and batch size
4. **delete**: click "delete selected" and watch the progress
5. **stop**: click "stop" at any time to halt the process

## Development

### Project Structure

```
src/
├── bun/           # bun process (backend)
│   ├── handlers/  # rpc handlers
│   ├── channel-utils.ts
│   ├── webview-utils.ts
│   ├── window.ts
│   └── index.ts
├── mainview/      # react ui (frontend)
│   ├── hooks/     # custom react hooks
│   │   ├── useDiscordAuth.ts
│   │   └── useDeletion.ts
│   ├── utils/     # utility functions
│   │   └── avatar.ts
│   └── components/# ui components
├── lib/           # shared utilities
│   └── core/      # discord api client
│       ├── discord-client.ts
│       ├── auth-manager.ts
│       ├── message-searcher.ts
│       └── message-deleter.ts
└── scripts/       # helper scripts
    ├── token-helper.py
    └── requirements.txt
```

## Building

```bash
# build for canary release
bun run build:canary

# build for stable release
bun run build:stable
```

## Limitations

- windows is the primary target platform
- only deletes messages you have permission to delete
- rate limited by discord (automatically handles with delays)
- may get your discord account banned if used excessively

## Credits

based on [delo](https://github.com/notsapinho/deleo) by notsapinho
