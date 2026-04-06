# Code Generation Plan - Unit 0: Foundation

## Unit Context
- **Unit**: Unit 0 - Foundation (공통 기반)
- **담당**: Dev 1
- **스토리 매핑**: 직접 매핑 없음 (인프라 기반, Unit 1~3의 선행 조건)
- **Workspace Root**: /home/ec2-user/environment/aidlc-table-order

## 생성 대상
- 프로젝트 구조 및 설정 파일
- SQLite DB 스키마 + seed 데이터
- Express 앱 골격 + 공통 미들웨어
- React + Vite + Tailwind 초기화 + 공통 UI 컴포넌트
- API 클라이언트 기반 + 라우팅 골격

---

## Execution Steps

### Step 1: 루트 프로젝트 설정
- [x] 루트 package.json (concurrently 스크립트)
- [x] .env.example
- [x] .gitignore

### Step 2: Backend 프로젝트 초기화
- [x] server/package.json (의존성: express, better-sqlite3, jsonwebtoken, bcryptjs, cors, dotenv, nodemon)
- [x] server/src/config.js (환경변수 중앙 설정)

### Step 3: 데이터베이스
- [x] server/src/db/database.js (SQLite 연결, PRAGMA 설정, 스키마 초기화)
- [x] server/src/db/schema.sql (10개 테이블 DDL)
- [x] server/src/db/seed.js (초기 데이터: 매장, 관리자, 테이블 5개, 카테고리 3개, 메뉴 샘플)

### Step 4: 공통 미들웨어
- [x] server/src/middleware/errorHandler.js (AppError 클래스 + 전역 에러 핸들러)
- [x] server/src/middleware/authMiddleware.js (관리자 JWT 검증)
- [x] server/src/middleware/tableAuthMiddleware.js (테이블 JWT 검증)
- [x] server/src/middleware/rateLimiter.js (IP 기반 로그인 시도 제한)

### Step 5: Express 앱 골격
- [x] server/src/app.js (Express 앱 설정, CORS, 미들웨어, 라우트 등록 골격)
- [x] server/src/server.js (서버 시작점, DB 초기화, 리스닝)

### Step 6: Frontend 프로젝트 초기화
- [x] client/package.json (의존성: react, react-dom, react-router-dom, axios, tailwindcss 등)
- [x] client/index.html
- [x] client/vite.config.js (proxy 설정)
- [x] client/tailwind.config.js
- [x] client/postcss.config.js

### Step 7: 공통 UI 컴포넌트
- [x] client/src/main.jsx (React 엔트리)
- [x] client/src/App.jsx (라우팅 골격)
- [x] client/src/components/Button.jsx
- [x] client/src/components/Modal.jsx
- [x] client/src/components/Loading.jsx
- [x] client/src/components/ErrorMessage.jsx
- [x] client/src/components/Card.jsx

### Step 8: API 클라이언트 기반
- [x] client/src/api/apiClient.js (Axios 인스턴스, 인터셉터)

### Step 9: 문서 요약
- [x] aidlc-docs/construction/unit-0-foundation/code/code-summary.md
