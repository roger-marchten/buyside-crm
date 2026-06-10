const express = require("express");
const http    = require("http");
const ws      = require("ws");
const fs      = require("fs");
const path    = require("path");
const os      = require("os");

const PORT      = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "crm-data.json");

/* ── helpers ── */
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
    catch { /* fall through to seed */ }
  }
  return null; // will seed on first GET
}
function saveData(d) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2), "utf8");
}

/* ── express ── */
const app    = express();
const server = http.createServer(app);
app.use(express.json({ limit: "10mb" }));

// Serve the frontend
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.use(express.static(path.join(__dirname, "public")));

// REST: load full state
app.get("/api/data", (req, res) => {
  const d = loadData();
  res.json({ ok: true, data: d });
});

// REST: save full state (client sends entire state blob)
app.post("/api/data", (req, res) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== "object") {
    return res.status(400).json({ ok: false, error: "Invalid payload" });
  }
  saveData(incoming);
  // broadcast to every other connected client
  broadcast(incoming, req.headers["x-client-id"]);
  res.json({ ok: true });
});

/* ── WebSocket (live sync) ── */
const wss = new ws.WebSocketServer({ server });
const clients = new Map(); // clientId -> ws

wss.on("connection", (socket, req) => {
  const id = Math.random().toString(36).slice(2);
  socket.clientId = id;
  clients.set(id, socket);

  // Send current state immediately on connect
  const d = loadData();
  socket.send(JSON.stringify({ type: "init", data: d }));

  socket.on("close", () => clients.delete(id));
  socket.on("error", () => clients.delete(id));
});

function broadcast(data, excludeId) {
  const msg = JSON.stringify({ type: "update", data });
  clients.forEach((sock, id) => {
    if (id !== excludeId && sock.readyState === ws.WebSocket.OPEN) {
      sock.send(msg);
    }
  });
}

/* ── start ── */
server.listen(PORT, () => {
  // Show all local IPs so team members know what URL to use
  const nets = os.networkInterfaces();
  const ips  = Object.values(nets).flat().filter(n => n.family === "IPv4" && !n.internal).map(n => n.address);
  console.log("\n┌─────────────────────────────────────────┐");
  console.log("│         BuySide CRM — Server ready       │");
  console.log("├─────────────────────────────────────────┤");
  console.log(`│  Local:    http://localhost:${PORT}          │`);
  ips.forEach(ip => {
    const url = `http://${ip}:${PORT}`;
    console.log(`│  Network:  ${url.padEnd(29)} │`);
  });
  console.log("├─────────────────────────────────────────┤");
  console.log("│  Share the Network URL with your team.  │");
  console.log("│  Press Ctrl+C to stop.                  │");
  console.log("└─────────────────────────────────────────┘\n");
});
