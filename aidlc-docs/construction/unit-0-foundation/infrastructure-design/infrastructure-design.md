# Infrastructure Design - Unit 0: Foundation

---

## 1. 배포 환경

- **Target**: 로컬 개발 환경 (추후 클라우드 배포 결정)
- **OS**: macOS / Linux / Windows (Node.js 크로스 플랫폼)
- **런타임**: Node.js 20 LTS

---

## 2. 논리 컴포넌트 → 인프라 매핑

| 논리 컴포넌트 | 인프라 매핑 | 설명 |
|--------------|-----------|------|
| Database Engine | SQLite 파일 (better-sqlite3) | server/data/database.sqlite |
| Authentication Engine | 앱 내장 (jsonwebtoken + bcryptjs) | 별도 서비스 불필요 |
| Rate Limiter | 앱 내장 (In-Memory Map) | 별도 서비스 불필요 |
| SSE Manager | Express 내장 (Response 스트리밍) | 별도 서비스 불필요 |
| Error Handler | Express 미들웨어 | 앱 내장 |
| API Gateway | Vite Dev Server Proxy | 개발 환경 프록시 |
| Client State Manager | Browser localStorage + React Context | 클라이언트 내장 |

**핵심**: 모든 컴포넌트가 단일 프로세스(서버) + 단일 브라우저(클라이언트)에서 동작. 외부 인프라 의존성 없음.

---

## 3. 포트 할당

| 서비스 | 포트 | 설명 |
|--------|------|------|
| Express Backend | 3000 | REST API + SSE |
| Vite Frontend | 5173 | React 개발 서버 |

---

## 4. 파일 시스템 구조

```
table-order/
+-- package.json              # 루트: concurrently 스크립트
+-- .env                      # 환경변수 (gitignore)
+-- .env.example              # 환경변수 예시 (커밋 대상)
+-- .gitignore
+-- server/
|   +-- package.json
|   +-- data/                 # SQLite DB 파일 (gitignore)
|   |   +-- .gitkeep
|   +-- src/
|       +-- app.js
|       +-- server.js
|       +-- config.js          # 환경변수 로드 및 중앙 설정
|       +-- db/
|       +-- middleware/
|       +-- routes/
|       +-- controllers/
|       +-- services/
|       +-- repositories/
+-- client/
    +-- package.json
    +-- index.html
    +-- vite.config.js
    +-- tailwind.config.js
    +-- postcss.config.js
    +-- src/
```

---

## 5. 환경변수 관리

### .env.example
```
PORT=3000
JWT_SECRET=change-this-in-production
DB_PATH=./data/database.sqlite
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### server/src/config.js
```
환경변수를 중앙에서 로드하고 기본값 제공:
  - dotenv.config() (루트 .env 파일)
  - module.exports = { port, jwtSecret, dbPath, nodeEnv, corsOrigin }
```

---

## 6. NPM Scripts

### 루트 package.json
```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm run dev",
    "seed": "cd server && node src/db/seed.js",
    "install:all": "npm install && cd server && npm install && cd ../client && npm install"
  }
}
```

### server/package.json
```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "seed": "node src/db/seed.js"
  }
}
```

### client/package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 7. .gitignore

```
node_modules/
server/data/*.sqlite
.env
dist/
.DS_Store
```

---

## 8. 개발 워크플로우

```
1. git clone → npm run install:all
2. cp .env.example .env (환경변수 설정)
3. npm run seed (DB 초기화 + 샘플 데이터)
4. npm run dev (서버 + 클라이언트 동시 시작)
5. 브라우저: http://localhost:5173
```

---

## 9. 프로덕션 배포 가이드 (향후 참고)

로컬 개발에서 프로덕션 전환 시 고려사항:

| 항목 | 로컬 개발 | 프로덕션 (향후) |
|------|----------|----------------|
| DB | SQLite 파일 | PostgreSQL 또는 RDS |
| 서버 | nodemon | pm2 또는 컨테이너 |
| 프론트엔드 | Vite dev server | `vite build` → Express static 서빙 또는 CDN |
| 프록시 | Vite proxy | Nginx reverse proxy |
| 환경변수 | .env 파일 | 환경변수 주입 (ECS, K8s 등) |
| SSL | 없음 | HTTPS (ACM, Let's Encrypt) |
| 로깅 | console.log | winston + CloudWatch 등 |
