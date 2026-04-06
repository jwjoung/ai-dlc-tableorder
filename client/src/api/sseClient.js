let eventSource = null;

export function connect(onEvent) {
  disconnect();

  const token = localStorage.getItem('token');
  if (!token) return;

  eventSource = new EventSource(`/api/sse/orders?token=${encodeURIComponent(token)}`);

  eventSource.addEventListener('new_order', (e) => {
    onEvent('new_order', JSON.parse(e.data));
  });

  eventSource.addEventListener('order_updated', (e) => {
    onEvent('order_updated', JSON.parse(e.data));
  });

  eventSource.addEventListener('order_deleted', (e) => {
    onEvent('order_deleted', JSON.parse(e.data));
  });

  eventSource.addEventListener('table_completed', (e) => {
    onEvent('table_completed', JSON.parse(e.data));
  });

  eventSource.addEventListener('connected', (e) => {
    onEvent('connected', JSON.parse(e.data));
  });

  eventSource.onerror = () => {
    // EventSource will auto-reconnect
  };
}

export function disconnect() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
}
