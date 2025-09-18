import express, { Request, Response } from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

interface Message {
  type: string;
  message: string;
}

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

// Broadcast helper
function broadcast(data: Message) {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// HTTP API to receive messages
app.post("/message", (req: Request, res: Response) => {
  const { message } = req.body;
  if (typeof message !== "string") {
    return res.status(400).json({ error: "Message must be a string." });
  }
  broadcast({ type: "new-message", message });
  res.json({ status: "received" });
});

// WebSocket connection
wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");
  ws.send(JSON.stringify({ type: "init", message: "Connection established" }));
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
