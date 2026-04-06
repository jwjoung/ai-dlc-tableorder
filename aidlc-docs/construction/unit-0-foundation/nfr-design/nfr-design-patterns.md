# NFR Design Patterns - Unit 0: Foundation

---

## 1. 인증 패턴 (Authentication Pattern)

### Bearer Token Pattern
```
클라이언트                         서버
    |                               |
    |--- POST /api/auth/login ----->|
    |                               | 자격증명 검증
    |                               | JWT 생성 (payload + secret + expiry)
    |<-- { token: "eyJ..." } -------|
    |                               |
    | localStorage.setItem(token)   |
    |                               |
    |--- GET /api/menus ----------->|
    |    Authorization: Bearer eyJ..|
    |                               | authMiddleware:
    |                               |   토큰 추출 → jwt.verify()
    |                               |   req.admin/req.table 설정
    |<-- { data: [...] } -----------|
```

### Token Refresh 전략
- MVP에서는 토큰 갱신 없이 만료 시 재로그인
- 관리자: 16시간 만료 → 하루 영업 중 1~2회 재로그인
- 테이블: 24시간 만료 → 초기 설정 후 거의 재로그인 불필요

---

## 2. Rate Limiting 패턴 (Sliding Window)

### In-Memory Rate Limiter
```
Map<string, { count: number, firstAttempt: Date }>

요청 수신:
  1. key = req.ip
  2. record = map.get(key)
  3. IF record && (now - record.firstAttempt) < 15분:
       IF record.count >= 10:
         → 429 Too Many Requests
       ELSE:
         record.count++
  4. IF record && (now - record.firstAttempt) >= 15분:
       map.delete(key)  // 윈도우 리셋
  5. IF !record:
       map.set(key, { count: 1, firstAttempt: now })
  6. 로그인 성공 시: map.delete(key)
```

### 메모리 정리
- 15분 이상 경과한 레코드는 다음 접근 시 자동 삭제
- 서버 재시작 시 전체 리셋 (MVP 허용)

---

## 3. 에러 처리 패턴 (Centralized Error Handling)

### Custom Error Class
```
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message)
    this.statusCode = statusCode
    this.code = code
  }
}

사용 예:
  throw new AppError('메뉴를 찾을 수 없습니다', 404, 'MENU_NOT_FOUND')
  throw new AppError('인증이 필요합니다', 401, 'UNAUTHORIZED')
  throw new AppError('잘못된 요청입니다', 400, 'VALIDATION_ERROR')
```

### Controller → Service Error Flow
```
Controller:
  try {
    const result = await service.method()
    res.json({ data: result })
  } catch (error) {
    next(error)  // errorHandler로 전달
  }

errorHandler (최하단 미들웨어):
  (err, req, res, next) => {
    statusCode = err.statusCode || 500
    res.status(statusCode).json({
      error: {
        message: err.message,
        code: err.code || 'INTERNAL_ERROR',
        ...(isDev && { stack: err.stack })
      }
    })
  }
```

---

## 4. 데이터 접근 패턴 (Repository Pattern)

### Repository 구조
```
각 Repository:
  - constructor(db): DB 인스턴스 주입
  - Prepared Statement 캐싱
  - 단일 책임: 하나의 테이블(또는 관련 테이블) 담당

예시:
  menuRepository:
    findAll(storeId)        → SELECT ... WHERE store_id = ?
    findById(id)            → SELECT ... WHERE id = ?
    create(data)            → INSERT INTO ... VALUES (?, ?, ...)
    update(id, data)        → UPDATE ... SET ... WHERE id = ?
    delete(id)              → DELETE FROM ... WHERE id = ?
```

### 트랜잭션 패턴
```
better-sqlite3 트랜잭션:

const transaction = db.transaction((orderData, items) => {
  const orderResult = orderStmt.run(orderData)
  for (const item of items) {
    itemStmt.run(orderResult.lastInsertRowid, item)
  }
  return orderResult.lastInsertRowid
})

const orderId = transaction(orderData, items)
```

---

## 5. SSE 패턴 (Server-Sent Events)

### Connection Management
```
SSE Service:
  clients = new Map<storeId, Set<Response>>()

  addClient(res, storeId):
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()
    clients.get(storeId).add(res)
    
    // Heartbeat: 30초마다
    const heartbeat = setInterval(() => {
      res.write(': ping\n\n')
    }, 30000)
    
    req.on('close', () => {
      clearInterval(heartbeat)
      clients.get(storeId).delete(res)
    })

  broadcast(storeId, event, data):
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    for (const client of clients.get(storeId)) {
      client.write(payload)
    }
```

### 이벤트 포맷
```
event: new_order
data: {"orderId":1,"tableNumber":3,"items":[...],"totalAmount":25000}

event: order_updated  
data: {"orderId":1,"status":"preparing"}

event: order_deleted
data: {"orderId":1,"tableId":3}

event: table_completed
data: {"tableId":3}
```

---

## 6. API 클라이언트 패턴 (Interceptor Pattern)

### Axios Interceptor
```
Request Interceptor:
  config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  }

Response Interceptor:
  Success: response => response.data
  Error: error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/admin/login'  // 또는 /customer/setup
    }
    throw error.response?.data?.error || { message: '네트워크 오류' }
  }
```

---

## 7. 프론트엔드 상태 패턴

### Context + localStorage Sync Pattern
```
AuthContext:
  state: { token, user, isAuthenticated, role }
  
  초기화:
    token = localStorage.getItem('token')
    IF token → jwt decode → 만료 확인 → state 설정
    IF 만료 → localStorage 제거 → 미인증 상태

CartContext:
  state: { items, totalAmount }
  
  초기화:
    items = JSON.parse(localStorage.getItem('cart')) || []
  
  변경 시:
    localStorage.setItem('cart', JSON.stringify(items))
```
