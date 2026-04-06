# Code Summary - Unit 1: 인증+메뉴

## 생성된 파일 (16개 신규 + 2개 수정)

### Backend - Repository Layer (2개)
| 파일 | 설명 |
|------|------|
| server/src/repositories/adminRepository.js | 매장/관리자/테이블/세션 데이터 접근 |
| server/src/repositories/menuRepository.js | 메뉴/카테고리 데이터 접근 (CRUD, 순서 교환) |

### Backend - Service Layer (2개)
| 파일 | 설명 |
|------|------|
| server/src/services/authService.js | 관리자/테이블 로그인, 토큰 검증, bcrypt/JWT |
| server/src/services/menuService.js | 메뉴/카테고리 CRUD, 검증, 순서 조정, 소프트 삭제 |

### Backend - Controller Layer (2개)
| 파일 | 설명 |
|------|------|
| server/src/controllers/authController.js | 인증 HTTP 요청/응답 처리 |
| server/src/controllers/menuController.js | 메뉴/카테고리 HTTP 요청/응답 처리 |

### Backend - Routes Layer (2개)
| 파일 | 설명 |
|------|------|
| server/src/routes/authRoutes.js | /api/auth/* (로그인, 검증) |
| server/src/routes/menuRoutes.js | /api/menus/*, /api/categories/* |

### Backend - Integration (1개 수정)
| 파일 | 변경 |
|------|------|
| server/src/app.js | authRoutes, menuRoutes 등록 활성화 |

### Frontend - API Layer (2개)
| 파일 | 설명 |
|------|------|
| client/src/api/authApi.js | adminLogin, tableLogin, verifyToken |
| client/src/api/menuApi.js | 메뉴/카테고리 CRUD API 호출 |

### Frontend - Context (1개)
| 파일 | 설명 |
|------|------|
| client/src/contexts/AuthContext.jsx | 전역 인증 상태, 자동 로그인, localStorage 동기화 |

### Frontend - Pages (4개)
| 파일 | Story | 설명 |
|------|-------|------|
| client/src/pages/customer/SetupPage.jsx | US-C01 | 테이블 초기 설정, 자동 로그인 |
| client/src/pages/customer/MenuPage.jsx | US-C02 | 카테고리 탭, 메뉴 그리드, 상세 모달, 장바구니 추가 |
| client/src/pages/admin/LoginPage.jsx | US-A01 | 관리자 로그인 |
| client/src/pages/admin/MenuManagementPage.jsx | US-A08,A09,A10 | 사이드바+메인, CRUD, 순서 조정 |

### Frontend - Integration (1개 수정)
| 파일 | 변경 |
|------|------|
| client/src/App.jsx | AuthProvider 래핑, 라우트 활성화 |

---

## Story 구현 현황
| Story | 상태 | Backend | Frontend |
|-------|------|---------|----------|
| US-C01 | ✅ | authService.loginTable | SetupPage + AuthContext |
| US-C02 | ✅ | menuService.getAllMenus | MenuPage |
| US-A01 | ✅ | authService.loginAdmin | LoginPage + AuthContext |
| US-A08 | ✅ | menuService.createMenu | MenuManagementPage |
| US-A09 | ✅ | menuService.updateMenu/deleteMenu | MenuManagementPage |
| US-A10 | ✅ | menuService.updateMenuOrder | MenuManagementPage |

## API 엔드포인트 구현 현황
| Method | Endpoint | 상태 |
|--------|----------|------|
| POST | /api/auth/admin/login | ✅ |
| POST | /api/auth/table/login | ✅ |
| POST | /api/auth/verify | ✅ |
| GET | /api/menus | ✅ |
| GET | /api/menus/:id | ✅ |
| POST | /api/menus | ✅ |
| PUT | /api/menus/:id | ✅ |
| DELETE | /api/menus/:id | ✅ |
| PUT | /api/menus/:id/order | ✅ |
| GET | /api/categories | ✅ |
| POST | /api/categories | ✅ |
| PUT | /api/categories/:id | ✅ |
| DELETE | /api/categories/:id | ✅ |
