# Deployment Architecture - Unit 0: Foundation

---

## 로컬 개발 환경 아키텍처

```
+---------------------------------------------------+
|                  개발자 머신                         |
|                                                     |
|  +---------------------+  +---------------------+  |
|  | Vite Dev Server      |  | Express Server      |  |
|  | :5173                |  | :3000               |  |
|  |                      |  |                      |  |
|  | React App            |  | REST API             |  |
|  | Tailwind CSS         |  | SSE Endpoint         |  |
|  | HMR (Hot Reload)     |  | Middleware           |  |
|  |                      |  |                      |  |
|  | /api/* proxy -------->|  | Services             |  |
|  |                      |  | Repositories         |  |
|  +---------------------+  |                      |  |
|                            | +------------------+ |  |
|                            | | SQLite           | |  |
|                            | | data/database.   | |  |
|                            | | sqlite           | |  |
|                            | +------------------+ |  |
|                            +---------------------+  |
+---------------------------------------------------+
```

---

## 프로세스 구조

### 개발 모드 (`npm run dev`)
```
concurrently
  +-- nodemon server/src/server.js    (Express, :3000)
  +-- vite (client/)                  (React Dev Server, :5173)
```

- **nodemon**: 서버 파일 변경 시 자동 재시작
- **vite**: 프론트엔드 파일 변경 시 HMR (Hot Module Replacement)
- **concurrently**: 두 프로세스 동시 실행, 하나 종료 시 둘 다 종료

### 데이터 플로우
```
Browser (:5173)
    |
    |-- Static Assets (HTML, JS, CSS) --> Vite Dev Server
    |
    |-- /api/* --> Vite Proxy --> Express (:3000) --> SQLite
    |
    |-- SSE /api/sse/orders --> Vite Proxy --> Express (long-lived connection)
```

---

## 빌드 프로세스

### 프론트엔드 빌드
```
npm run build (client/)
  → vite build
  → client/dist/
      +-- index.html
      +-- assets/
          +-- *.js (번들)
          +-- *.css (Tailwind 빌드)
```

### 프로덕션 서빙 옵션
```
Option A: Express에서 정적 파일 서빙
  app.use(express.static('client/dist'))
  // SPA fallback
  app.get('*', (req, res) => res.sendFile('client/dist/index.html'))

Option B: Nginx 리버스 프록시
  / → client/dist/ (정적)
  /api/ → Express :3000 (API)
```

---

## 데이터 지속성

| 데이터 | 저장소 | 위치 | 백업 |
|--------|--------|------|------|
| 매장/메뉴/주문 DB | SQLite 파일 | server/data/database.sqlite | 파일 복사 |
| JWT 토큰 | 브라우저 localStorage | 클라이언트 | N/A |
| 장바구니 | 브라우저 localStorage | 클라이언트 | N/A |
| Rate Limit 상태 | 서버 메모리 | 휘발성 | N/A |
| SSE 클라이언트 목록 | 서버 메모리 | 휘발성 | N/A |
