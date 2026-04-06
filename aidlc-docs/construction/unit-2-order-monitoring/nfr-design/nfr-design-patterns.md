# NFR Design Patterns - Unit 2: 주문+모니터링

---

## 1. 주문 트랜잭션 패턴

```
orderService.createOrder:
  const createOrderTx = db.transaction((orderData, items) => {
    const orderResult = orderStmt.run(orderData);
    const orderId = orderResult.lastInsertRowid;
    for (const item of items) {
      itemStmt.run(orderId, item.menuId, item.menuName, item.quantity, item.unitPrice);
    }
    return orderId;
  });
```

## 2. SSE Connection Management 패턴

```
sseService:
  clients = new Map()  // storeId → Set<Response>

  addClient(res, storeId):
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()
    
    if (!clients.has(storeId)) clients.set(storeId, new Set())
    clients.get(storeId).add(res)
    
    heartbeat = setInterval(() => res.write(': ping\n\n'), 30000)
    req.on('close', () => { clearInterval(heartbeat); clients.get(storeId).delete(res) })

  broadcast(storeId, event, data):
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    clients.get(storeId)?.forEach(client => client.write(payload))
```

## 3. 프론트엔드 SSE Client 패턴

```
sseClient:
  let eventSource = null

  connect(onEvent):
    const token = localStorage.getItem('token')
    eventSource = new EventSource(`/api/sse/orders?token=${token}`)
    
    eventSource.addEventListener('new_order', e => onEvent('new_order', JSON.parse(e.data)))
    eventSource.addEventListener('order_updated', e => onEvent('order_updated', JSON.parse(e.data)))
    eventSource.addEventListener('order_deleted', e => onEvent('order_deleted', JSON.parse(e.data)))
    eventSource.addEventListener('table_completed', e => onEvent('table_completed', JSON.parse(e.data)))

  disconnect():
    eventSource?.close()
    eventSource = null
```

## 4. 주문 상태 전이 검증 패턴

```
const STATUS_TRANSITIONS = {
  pending: 'preparing',
  preparing: 'completed',
};

validateStatusTransition(currentStatus, newStatus):
  if (STATUS_TRANSITIONS[currentStatus] !== newStatus)
    throw AppError('유효하지 않은 상태 변경입니다', 400)
```

## 5. Cart Context + localStorage Sync 패턴

```
CartContext:
  items 변경 시마다:
    localStorage.setItem('cart', JSON.stringify(items))
  
  초기화 시:
    items = JSON.parse(localStorage.getItem('cart') || '[]')
```
