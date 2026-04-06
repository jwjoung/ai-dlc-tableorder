# Infrastructure Design - Unit 1: 인증+메뉴

> Unit 0 인프라 설계를 상속합니다. Unit 1은 추가 외부 인프라 없이 기존 구조 내에서 구현됩니다.

---

## 1. 논리 컴포넌트 → 파일 매핑

### Backend (server/src/)
| 컴포넌트 | 파일 경로 | 신규/수정 |
|----------|----------|----------|
| authRoutes | routes/authRoutes.js | 신규 |
| menuRoutes | routes/menuRoutes.js | 신규 |
| authController | controllers/authController.js | 신규 |
| menuController | controllers/menuController.js | 신규 |
| authService | services/authService.js | 신규 |
| menuService | services/menuService.js | 신규 |
| adminRepository | repositories/adminRepository.js | 신규 |
| menuRepository | repositories/menuRepository.js | 신규 |
| app.js | app.js | 수정 (라우트 등록 활성화) |

### Frontend (client/src/)
| 컴포넌트 | 파일 경로 | 신규/수정 |
|----------|----------|----------|
| AuthContext | contexts/AuthContext.jsx | 신규 |
| authApi | api/authApi.js | 신규 |
| menuApi | api/menuApi.js | 신규 |
| SetupPage | pages/customer/SetupPage.jsx | 신규 |
| MenuPage | pages/customer/MenuPage.jsx | 신규 |
| LoginPage | pages/admin/LoginPage.jsx | 신규 |
| MenuManagementPage | pages/admin/MenuManagementPage.jsx | 신규 |
| App.jsx | App.jsx | 수정 (라우트 활성화, AuthContext 래핑) |

---

## 2. 수정 대상 기존 파일

### server/src/app.js
```
변경 내용:
- authRoutes, menuRoutes require 주석 해제
- app.use('/api/auth', authRoutes) 주석 해제
- app.use('/api/menus', menuRoutes) 주석 해제
- /api/categories 라우트 추가 (menuRoutes에서 처리)
```

### client/src/App.jsx
```
변경 내용:
- SetupPage, MenuPage, LoginPage, MenuManagementPage import 추가
- AuthContext.Provider로 전체 앱 래핑
- /customer/setup, /customer/menu, /admin/login, /admin/menus 라우트 활성화
- 기본 리다이렉트 로직 변경
```

---

## 3. 디렉토리 생성 필요

```
server/src/routes/          (빈 디렉토리 → 파일 추가)
server/src/controllers/     (빈 디렉토리 → 파일 추가)
server/src/services/        (빈 디렉토리 → 파일 추가)
server/src/repositories/    (빈 디렉토리 → 파일 추가)
client/src/contexts/        (빈 디렉토리 → 파일 추가)
client/src/pages/customer/  (빈 디렉토리 → 파일 추가)
client/src/pages/admin/     (빈 디렉토리 → 파일 추가)
```

---

## 4. 추가 인프라 요구사항

**없음** - Unit 1의 모든 컴포넌트는 기존 인프라 내에서 동작:
- 인증: 앱 내장 (JWT + bcrypt)
- 데이터: 기존 SQLite (schema 변경 없음)
- API: 기존 Express 서버에 라우트 추가
- 프론트엔드: 기존 Vite + React에 페이지/컨텍스트 추가
- 추가 패키지: 없음 (Unit 0에서 설치한 패키지로 충분)

---

## 5. 파일 생성 요약

| 구분 | 신규 파일 수 | 수정 파일 수 |
|------|------------|------------|
| Backend | 8 | 1 (app.js) |
| Frontend | 7 | 1 (App.jsx) |
| **합계** | **15** | **2** |
