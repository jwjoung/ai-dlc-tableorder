class SSEService {
  constructor() {
    this.clients = new Map(); // storeId → Set<{ res, heartbeat }>
  }

  addClient(req, res, storeId) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send initial connection event
    res.write('event: connected\ndata: {"status":"connected"}\n\n');

    if (!this.clients.has(storeId)) {
      this.clients.set(storeId, new Set());
    }

    const heartbeat = setInterval(() => {
      res.write(': ping\n\n');
    }, 30000);

    const client = { res, heartbeat };
    this.clients.get(storeId).add(client);

    req.on('close', () => {
      clearInterval(heartbeat);
      this.clients.get(storeId).delete(client);
      if (this.clients.get(storeId).size === 0) {
        this.clients.delete(storeId);
      }
    });
  }

  broadcast(storeId, event, data) {
    const storeClients = this.clients.get(storeId);
    if (!storeClients || storeClients.size === 0) return;

    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

    for (const client of storeClients) {
      client.res.write(payload);
    }
  }

  getClientCount(storeId) {
    return this.clients.get(storeId)?.size || 0;
  }
}

module.exports = new SSEService();
