const WebSocket = require('ws');
const Session = require('./models/Session');
const mongoose = require('mongoose');

const wss = new WebSocket.Server({ port: 6000 });

// In-memory session state cache (for demoing, use Redis in prod)
const sessions = new Map();

wss.on('connection', async (ws, req) => {

  let currentSessionId = null;

  ws.on('message', async (msg) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === 'joinSession') {
        currentSessionId = data.sessionId;

        // Load or initialize codeContent from DB
        let session = sessions.get(currentSessionId);
        if (!session) {
          session = await Session.findById(currentSessionId);
          if (!session) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid session ID' }));
            return;
          }
          sessions.set(currentSessionId, session.codeContent);
        }
        // Send current code state to user joining
        ws.send(JSON.stringify({ type: 'initCode', code: sessions.get(currentSessionId) || '' }));
      }

      if (data.type === 'codeChange') {
        // Update state in-memory
        sessions.set(currentSessionId, data.code);

        // Broadcast to all clients except sender
        wss.clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'codeUpdate', code: data.code }));
          }
        });

        // Also asynchronously save to DB (debounce in real app)
        await Session.findByIdAndUpdate(currentSessionId, { codeContent: data.code, lastModified: new Date() });

      }
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    // Handle cleanup if needed
  });

});

console.log('WebSocket Sync Server running on port 6000');
