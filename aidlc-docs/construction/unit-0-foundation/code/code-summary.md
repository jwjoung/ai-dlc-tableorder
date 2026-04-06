# Code Summary - Unit 0: Foundation

## 생성 파일 목록 (28개)

### 루트 (3)
- `package.json` - 루트 스크립트 (concurrently)
- `.env.example` - 환경변수 예시
- `.gitignore` - Git 무시 규칙

### Backend (14)
- `server/package.json` - 서버 의존성
- `server/src/config.js` - 환경변수 중앙 설정
- `server/src/app.js` - Express 앱 (CORS, 미들웨어, 라우트 골격)
- `server/src/server.js` - 서버 시작점 (DB 초기화, 리스닝)
- `server/src/db/database.js` - SQLite 연결 (WAL, FK 활성화)
- `server/src/db/schema.sql` - DDL 10개 테이블
- `server/src/db/seed.js` - 초기 데이터 (매장, 관리자, 테이블 5개, 메뉴 10개)
- `server/src/middleware/errorHandler.js` - AppError + 전역 에러 핸들러
- `server/src/middleware/authMiddleware.js` - 관리자 JWT 검증
- `server/src/middleware/tableAuthMiddleware.js` - 테이블 JWT 검증
- `server/src/middleware/rateLimiter.js` - IP 기반 로그인 시도 제한
- `server/data/.gitkeep` - data 디렉토리 유지

### Frontend (11)
- `client/package.json` - 클라이언트 의존성
- `client/index.html` - HTML 엔트리
- `client/vite.config.js` - Vite 설정 (proxy)
- `client/tailwind.config.js` - Tailwind 설정
- `client/postcss.config.js` - PostCSS 설정
- `client/src/index.css` - Tailwind 디렉티브
- `client/src/main.jsx` - React 엔트리
- `client/src/App.jsx` - 라우팅 골격 (Unit 1~3 대기)
- `client/src/components/Button.jsx` - 공통 버튼
- `client/src/components/Modal.jsx` - 공통 모달
- `client/src/components/Loading.jsx` - 로딩 스피너
- `client/src/components/ErrorMessage.jsx` - 에러 메시지
- `client/src/components/Card.jsx` - 카드 레이아웃
- `client/src/api/apiClient.js` - Axios 인터셉터 (JWT, 401 처리)
