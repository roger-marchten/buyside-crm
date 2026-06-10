# BuySide CRM — Team Server

A shared CRM for your whole team. One person runs the server; everyone else opens the app in their browser.

---

## Setup (one-time, 2 minutes)

### 1. Install Node.js
Download from **https://nodejs.org** — choose the **LTS** version.  
Install it like any normal program. That's all.

### 2. Put this folder somewhere permanent
e.g. `C:\Users\YourName\Documents\BuySideCRM\`  
(Don't keep it in Downloads — you'll lose it)

### 3. Start the server

**Windows:** Double-click `START.bat`  
**Mac/Linux:** Open Terminal, drag the folder in, type `bash start.sh`

The first time it runs, it installs two small packages automatically (~2 seconds).

---

## Every day

1. Double-click `START.bat` (Windows) or run `bash start.sh` (Mac)
2. A window opens showing something like:

```
┌─────────────────────────────────────────┐
│         BuySide CRM — Server ready       │
├─────────────────────────────────────────┤
│  Local:    http://localhost:3000          │
│  Network:  http://192.168.1.42:3000       │
└─────────────────────────────────────────┘
```

3. **You** open `http://localhost:3000` in your browser  
4. **Your team** opens `http://192.168.1.42:3000` (use the Network address shown)

> The Network URL only works while you're on the same Wi-Fi / office network.  
> Keep the terminal window open while working — closing it stops the server.

---

## Your data

All data is saved in `crm-data.json` in this folder.  
Back it up occasionally — copy that file somewhere safe.

---

## Stopping the server

Click the terminal window and press `Ctrl + C`.

---

## Troubleshooting

**"node is not recognized"** → Node.js isn't installed. Go to step 1.  
**Team can't connect** → Make sure you're on the same network. Check your firewall allows port 3000.  
**Port already in use** → Change the port: open `server.js`, find `PORT = 3000`, change it to e.g. `3001`.
