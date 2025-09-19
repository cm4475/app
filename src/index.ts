import express, { Request, Response } from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";

interface BroadcastMessage extends MessageSchema {
  type: "message";
}

interface MessageSchema {
  id: string;
  table: number;
  message: string;
  time: string;
}

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(cors());

// Broadcast helper
function broadcast(data: BroadcastMessage) {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// HTTP API to receive messages
app.post("/message", (req: Request, res: Response) => {
  const data = req.body;

  console.log("Received message");

  if (!data || !data.id || !data.table || !data.time) {
    console.log("Invalid message");
    return res.status(400).json({ error: "Invalid message format" });
  }

  broadcast({ type: "message", ...data });
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
