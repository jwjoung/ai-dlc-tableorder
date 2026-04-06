# Tech Stack Decisions - Unit 0: Foundation

---

## 확정 기술 스택

### Backend
| 기술 | 버전 | 선택 이유 |
|------|------|----------|
| Node.js | 20 LTS | 안정적, SSE 이벤트 기반에 적합 |
| Express | ^4.18 | 성숙한 생태계, 풍부한 미들웨어 |
| better-sqlite3 | ^11.0 | 동기식 API로 단순, WAL 지원, 고성능 |
| jsonwebtoken | ^9.0 | JWT 생성/검증 표준 라이브러리 |
| bcryptjs | ^2.4 | bcrypt 해싱 (네이티브 의존성 없는 JS 구현) |
| cors | ^2.8 | CORS 미들웨어 |
| dotenv | ^16.0 | 환경변수 로드 |

### Frontend
| 기술 | 버전 | 선택 이유 |
|------|------|----------|
| React | ^18 | 컴포넌트 기반, 상태 관리 우수 |
| Vite | ^5 | 빠른 빌드, HMR, 개발 생산성 |
| React Router | ^6 | SPA 라우팅 표준 |
| Tailwind CSS | ^3 | 유틸리티 기반 빠른 UI 개발 |
| Axios | ^1.6 | HTTP 클라이언트, 인터셉터 지원 |

### 개발 도구
| 기술 | 용도 |
|------|------|
| concurrently | 루트에서 server+client 동시 실행 |
| nodemon | 서버 코드 변경 시 자동 재시작 |
| postcss + autoprefixer | Tailwind CSS 빌드 |

---

## 기술 선택 근거

### better-sqlite3 vs sqlite3
- **better-sqlite3 선택**: 동기식 API로 코드가 단순, 트랜잭션 처리 직관적, 성능 우수
- sqlite3는 비동기 콜백 기반으로 코드 복잡도 증가

### bcryptjs vs bcrypt
- **bcryptjs 선택**: 순수 JavaScript 구현으로 네이티브 빌드 불필요
- 설치 환경 문제 없음, 성능은 MVP 규모에서 충분

### Axios vs fetch
- **Axios 선택**: 인터셉터(JWT 자동 첨부, 401 처리), 요청 취소, 타임아웃 기본 지원
- fetch는 기본 기능이 부족하여 래퍼 코드 필요

---

## 환경변수 목록

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| PORT | 3000 | Express 서버 포트 |
| JWT_SECRET | dev-secret-key-change-in-production | JWT 서명 키 |
| DB_PATH | ./data/database.sqlite | SQLite 파일 경로 |
| NODE_ENV | development | 환경 (development/production) |
| CORS_ORIGIN | http://localhost:5173 | CORS 허용 Origin |
