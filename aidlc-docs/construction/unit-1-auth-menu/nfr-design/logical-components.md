# Logical Components - Unit 1: 인증+메뉴

> Unit 0 논리 컴포넌트(7개)를 상속하며, Unit 1에서 추가되는 컴포넌트를 기술합니다.

---

## Unit 1 추가 논리 컴포넌트

### 1. Auth Service Component
| 항목 | 내용 |
|------|------|
| 파일 | server/src/services/authService.js |
| 역할 | 관리자/테이블 인증 비즈니스 로직 |
| 의존성 | adminRepository, jwt, bcrypt, rateLimiter |
| 메서드 | loginAdmin, loginTable, verifyToken |

### 2. Menu Service Component
| 항목 | 내용 |
|------|------|
| 파일 | server/src/services/menuService.js |
| 역할 | 메뉴/카테고리 CRUD 비즈니스 로직 |
| 의존성 | menuRepository |
| 메서드 | getAllMenus, getMenuById, createMenu, updateMenu, deleteMenu, updateMenuOrder, getCategories, createCategory, updateCategory, deleteCategory |

### 3. Admin Repository Component
| 항목 | 내용 |
|------|------|
| 파일 | server/src/repositories/adminRepository.js |
| 역할 | 관리자/테이블/세션/매장 데이터 접근 |
| 의존성 | database (better-sqlite3) |
| 테이블 | stores, admins, tables, table_sessions |

### 4. Menu Repository Component
| 항목 | 내용 |
|------|------|
| 파일 | server/src/repositories/menuRepository.js |
| 역할 | 메뉴/카테고리 데이터 접근 |
| 의존성 | database (better-sqlite3) |
| 테이블 | menu_items, categories |

### 5. Auth Controller Component
| 항목 | 내용 |
|------|------|
| 파일 | server/src/controllers/authController.js |
| 역할 | 인증 HTTP 요청 처리, 응답 생성 |
| 의존성 | authService |

### 6. Menu Controller Component
| 항목 | 내용 |
|------|------|
| 파일 | server/src/controllers/menuController.js |
| 역할 | 메뉴/카테고리 HTTP 요청 처리, 응답 생성 |
| 의존성 | menuService |

### 7. Auth Routes Component
| 항목 | 내용 |
|------|------|
| 파일 | server/src/routes/authRoutes.js |
| 역할 | /api/auth/* 라우트 정의 |
| 미들웨어 | rateLimiter (로그인), authMiddleware/tableAuthMiddleware (검증) |

### 8. Menu Routes Component
| 항목 | 내용 |
|------|------|
| 파일 | server/src/routes/menuRoutes.js |
| 역할 | /api/menus/*, /api/categories/* 라우트 정의 |
| 미들웨어 | tableAuthMiddleware (조회), authMiddleware (CUD) |

### 9. AuthContext Component (Frontend)
| 항목 | 내용 |
|------|------|
| 파일 | client/src/contexts/AuthContext.jsx |
| 역할 | 전역 인증 상태 관리, 자동 로그인 |
| 의존성 | authApi, localStorage |

### 10. Frontend Pages (4개)
| 파일 | 역할 |
|------|------|
| client/src/pages/customer/SetupPage.jsx | 테이블 초기 설정, 자동 로그인 |
| client/src/pages/customer/MenuPage.jsx | 메뉴 조회, 카테고리 탭, 상세 모달 |
| client/src/pages/admin/LoginPage.jsx | 관리자 로그인 |
| client/src/pages/admin/MenuManagementPage.jsx | 메뉴/카테고리 CRUD 관리 |

### 11. API Client Modules (2개)
| 파일 | 역할 |
|------|------|
| client/src/api/authApi.js | 인증 API 호출 |
| client/src/api/menuApi.js | 메뉴/카테고리 API 호출 |

---

## Unit 1 컴포넌트 의존성

```
authRoutes ──> authController ──> authService ──> adminRepository ──> DB
                                      |
                                      +──> bcrypt, jwt, rateLimiter

menuRoutes ──> menuController ──> menuService ──> menuRepository ──> DB

SetupPage ──> AuthContext ──> authApi ──> apiClient ──> /api/auth/*
LoginPage ──> AuthContext ──> authApi ──> apiClient ──> /api/auth/*
MenuPage ──> menuApi ──> apiClient ──> /api/menus/*
MenuManagementPage ──> menuApi ──> apiClient ──> /api/menus/*, /api/categories/*
```
