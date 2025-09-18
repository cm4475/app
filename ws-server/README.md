# ws-server

A basic TypeScript service with an HTTP API to receive messages and a WebSocket server to broadcast updates to all connected clients whenever a new message is received.

## Features

- HTTP POST `/message` to send a message
- WebSocket server broadcasts new messages to all clients

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Build the project:

   ```sh
   npm run build
   ```

3. Start the server:

   ```sh
   npm start
   ```

## Usage

- Send a message:

  ```sh
  curl -X POST http://localhost:3000/message -H "Content-Type: application/json" -d '{"message": "Hello world!"}'
  ```

- Connect to WebSocket:
  - Use any WebSocket client to connect to `ws://localhost:3000`
  - On connection, you receive all previous messages
  - On new message, you receive `{ type: 'new-message', message }`

## Project Structure

- `src/index.ts`: Main server code
- `tsconfig.json`: TypeScript configuration
- `package.json`: Project metadata and scripts
