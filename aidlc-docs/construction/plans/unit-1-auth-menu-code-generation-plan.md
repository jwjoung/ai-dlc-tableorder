# Unit 1: 인증+메뉴 - Code Generation Plan

## Unit Context
- **Unit**: Unit 1 - 인증 + 메뉴 도메인
- **스토리**: US-C01, US-C02, US-A01, US-A08, US-A09, US-A10 (6개)
- **의존성**: Unit 0 Foundation (완료)
- **프로젝트 타입**: Greenfield Monolith
- **워크스페이스**: /home/ec2-user/environment/ai-dlc-tableorder

## Story Traceability
| Story | 설명 | Backend | Frontend |
|-------|------|---------|----------|
| US-C01 | 테이블 자동 로그인 | authService.loginTable | SetupPage, AuthContext |
| US-C02 | 메뉴 조회 및 탐색 | menuService.getAllMenus | MenuPage |
| US-A01 | 매장 관리자 로그인 | authService.loginAdmin | LoginPage, AuthContext |
| US-A08 | 메뉴 등록 | menuService.createMenu | MenuManagementPage |
| US-A09 | 메뉴 수정 및 삭제 | menuService.updateMenu/deleteMenu | MenuManagementPage |
| US-A10 | 메뉴 노출 순서 조정 | menuService.updateMenuOrder | MenuManagementPage |

---

## Execution Steps

### Step 1: Repository Layer - adminRepository
- [x] 1.1 `server/src/repositories/adminRepository.js` 생성
  - findStoreByIdentifier(storeIdentifier)
  - findByStoreAndUsername(storeId, username)
  - findTableByStoreAndNumber(storeId, tableNumber)
  - findActiveSession(tableId)
  - createSession(tableId)

### Step 2: Repository Layer - menuRepository
- [x] 2.1 `server/src/repositories/menuRepository.js` 생성
  - getAllCategories(storeId)
  - getCategoryById(id)
  - createCategory(storeId, name, displayOrder)
  - updateCategory(id, name, displayOrder)
  - deleteCategory(id)
  - getMenuCountByCategory(categoryId)
  - getAllMenus(storeId)
  - getAvailableMenus(storeId)
  - getMenuById(id)
  - getMenusByCategory(categoryId)
  - createMenu(data)
  - updateMenu(id, data)
  - softDeleteMenu(id)
  - updateMenuOrder(id, displayOrder)
  - findByNameInCategory(categoryId, name, excludeId)
  - getMaxDisplayOrder(categoryId)
  - swapMenuOrder(id1, order1, id2, order2)

### Step 3: Service Layer - authService
- [x] 3.1 `server/src/services/authService.js` 생성
  - loginAdmin(storeIdentifier, username, password, ip)
  - loginTable(storeIdentifier, tableNumber, password, ip)
  - verifyToken(token)

### Step 4: Service Layer - menuService
- [x] 4.1 `server/src/services/menuService.js` 생성
  - getAllMenus(storeId, isAdmin)
  - getMenuById(id)
  - createMenu(storeId, data)
  - updateMenu(id, data)
  - deleteMenu(id)
  - updateMenuOrder(id, direction)
  - getCategories(storeId)
  - createCategory(storeId, data)
  - updateCategory(id, data)
  - deleteCategory(id)
  - validateMenu(data)

### Step 5: Controller Layer - authController
- [x] 5.1 `server/src/controllers/authController.js` 생성
  - adminLogin(req, res, next)
  - tableLogin(req, res, next)
  - verify(req, res, next)

### Step 6: Controller Layer - menuController
- [x] 6.1 `server/src/controllers/menuController.js` 생성
  - getAll(req, res, next)
  - getById(req, res, next)
  - create(req, res, next)
  - update(req, res, next)
  - remove(req, res, next)
  - updateOrder(req, res, next)
  - getCategories(req, res, next)
  - createCategory(req, res, next)
  - updateCategory(req, res, next)
  - deleteCategory(req, res, next)

### Step 7: Routes Layer - authRoutes, menuRoutes
- [x] 7.1 `server/src/routes/authRoutes.js` 생성
- [x] 7.2 `server/src/routes/menuRoutes.js` 생성 (메뉴 + 카테고리 라우트)

### Step 8: Backend Integration - app.js 수정
- [x] 8.1 `server/src/app.js` 수정 (authRoutes, menuRoutes 등록 활성화)

### Step 9: Frontend API Layer
- [x] 9.1 `client/src/api/authApi.js` 생성
- [x] 9.2 `client/src/api/menuApi.js` 생성

### Step 10: Frontend Context - AuthContext
- [x] 10.1 `client/src/contexts/AuthContext.jsx` 생성

### Step 11: Frontend Pages - 고객
- [x] 11.1 `client/src/pages/customer/SetupPage.jsx` 생성 (US-C01)
- [x] 11.2 `client/src/pages/customer/MenuPage.jsx` 생성 (US-C02)

### Step 12: Frontend Pages - 관리자
- [x] 12.1 `client/src/pages/admin/LoginPage.jsx` 생성 (US-A01)
- [x] 12.2 `client/src/pages/admin/MenuManagementPage.jsx` 생성 (US-A08, US-A09, US-A10)

### Step 13: Frontend Integration - App.jsx 수정
- [x] 13.1 `client/src/App.jsx` 수정 (AuthContext 래핑, 라우트 활성화)

### Step 14: Documentation
- [x] 14.1 `aidlc-docs/construction/unit-1-auth-menu/code/code-summary.md` 생성

---

## 파일 생성 요약
| 구분 | 신규 | 수정 |
|------|------|------|
| Backend Repositories | 2 | 0 |
| Backend Services | 2 | 0 |
| Backend Controllers | 2 | 0 |
| Backend Routes | 2 | 0 |
| Backend Integration | 0 | 1 (app.js) |
| Frontend API | 2 | 0 |
| Frontend Context | 1 | 0 |
| Frontend Pages | 4 | 0 |
| Frontend Integration | 0 | 1 (App.jsx) |
| Documentation | 1 | 0 |
| **합계** | **16** | **2** |
