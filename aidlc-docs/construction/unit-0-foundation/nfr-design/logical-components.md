# Logical Components - Unit 0: Foundation

---

## 시스템 논리 아키텍처

```
+---------------------------------------------------------------+
|                    Client (Browser)                           |
|  +---------------------------+  +-------------------------+  |
|  | React App                 |  | localStorage            |  |
|  | - Pages (Customer/Admin)  |  | - JWT Token             |  |
|  | - Contexts (Auth/Cart)    |  | - Cart Items            |  |
|  | - API Client (Axios)      |  | - Table Auth Info       |  |
|  | - SSE Client (EventSource)|  +-------------------------+  |
|  +-------------+-------------+                                |
+-----------------|---------------------------------------------+
                  | HTTP (REST) / SSE
+-----------------|---------------------------------------------+
|                 v          Server (Express)                    |
|  +---------------------------------------------------------+  |
|  | Middleware Layer                                         |  |
|  | [CORS] [JSON Parser] [Auth] [RateLimit] [ErrorHandler]  |  |
|  +---------------------------------------------------------+  |
|  | Routing Layer                                           |  |
|  | [/api/auth] [/api/menus] [/api/orders] [/api/tables]    |  |
|  | [/api/sse]                                              |  |
|  +---------------------------------------------------------+  |
|  | Controller Layer                                        |  |
|  | 요청 파싱 + 응답 생성                                     |  |
|  +---------------------------------------------------------+  |
|  | Service Layer                                           |  |
|  | 비즈니스 로직 + 오케스트레이션                               |  |
|  +---------------------------------------------------------+  |
|  | Repository Layer                                        |  |
|  | 데이터 접근 + Prepared Statements                         |  |
|  +---------------------------------------------------------+  |
|  | Database (better-sqlite3)                               |  |
|  | [SQLite File] WAL Mode + Foreign Keys                   |  |
|  +---------------------------------------------------------+  |
|                                                               |
|  +-------------------+                                        |
|  | SSE Manager       |                                        |
|  | - Client Registry |                                        |
|  | - Heartbeat       |                                        |
|  | - Broadcast       |                                        |
|  +-------------------+                                        |
|                                                               |
|  +-------------------+                                        |
|  | Rate Limiter      |                                        |
|  | - In-Memory Map   |                                        |
|  | - IP Tracking     |                                        |
|  +-------------------+                                        |
+---------------------------------------------------------------+
```

---

## 논리적 컴포넌트 목록

### 1. Database Engine
| 항목 | 내용 |
|------|------|
| 기술 | better-sqlite3 (SQLite) |
| 역할 | 데이터 영속성, 트랜잭션, 쿼리 실행 |
| 설정 | WAL 모드, Foreign Keys ON |
| 파일 | server/data/database.sqlite |
| 초기화 | schema.sql → seed.js (조건부) |

### 2. Authentication Engine
| 항목 | 내용 |
|------|------|
| 기술 | jsonwebtoken + bcryptjs |
| 역할 | JWT 발급/검증, 비밀번호 해싱/비교 |
| 토큰 유형 | admin (16h), table (24h) |
| 미들웨어 | authMiddleware, tableAuthMiddleware |

### 3. Rate Limiter
| 항목 | 내용 |
|------|------|
| 기술 | In-Memory Map |
| 역할 | 로그인 시도 제한 (IP 기반) |
| 정책 | 15분 내 10회 실패 시 차단 |
| 지속성 | 서버 재시작 시 리셋 |

### 4. SSE Manager
| 항목 | 내용 |
|------|------|
| 기술 | Express Response 기반 스트리밍 |
| 역할 | 실시간 이벤트 브로드캐스트 |
| 클라이언트 관리 | Map<storeId, Set<Response>> |
| Heartbeat | 30초 간격 ping |
| 이벤트 | new_order, order_updated, order_deleted, table_completed |

### 5. Error Handler
| 항목 | 내용 |
|------|------|
| 기술 | Express 에러 미들웨어 + AppError 클래스 |
| 역할 | 중앙집중 에러 처리, 구조화된 응답 |
| 응답 형식 | { error: { message, code, stack? } } |

### 6. API Gateway (Vite Proxy)
| 항목 | 내용 |
|------|------|
| 기술 | Vite dev server proxy |
| 역할 | 개발 환경 프론트→백엔드 프록시 |
| 설정 | /api → http://localhost:3000/api |

### 7. Client State Manager
| 항목 | 내용 |
|------|------|
| 기술 | React Context API + localStorage |
| 역할 | 전역 상태 관리 (인증, 장바구니) |
| 지속성 | localStorage 동기화 |
| 컨텍스트 | AuthContext, CartContext |

---

## 컴포넌트 간 통신

| 출발 | 도착 | 프로토콜 | 설명 |
|------|------|----------|------|
| React App | Express Server | HTTP (REST) | API 호출 (Axios) |
| React App | Express Server | SSE | 실시간 주문 스트림 (EventSource) |
| Express Server | SQLite | 동기 함수 호출 | better-sqlite3 |
| SSE Manager | React App | SSE Event | 주문 이벤트 브로드캐스트 |
| React App | localStorage | JS API | 토큰, 장바구니 저장 |

---

## 환경별 구성

| 항목 | Development | Production |
|------|-------------|------------|
| DB 경로 | ./data/database.sqlite | $DB_PATH |
| CORS Origin | http://localhost:5173 | $CORS_ORIGIN |
| 에러 스택 | 포함 | 제외 |
| JWT Secret | dev-secret-key | $JWT_SECRET (필수 변경) |
| 프록시 | Vite dev proxy | 정적 빌드 서빙 또는 Nginx |
