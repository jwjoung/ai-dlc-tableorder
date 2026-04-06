# NFR Design Patterns - Unit 1: 인증+메뉴

> Unit 0 패턴(Bearer Token, Rate Limiting, Centralized Error Handling, Repository, Interceptor, Context+localStorage Sync)을 상속합니다.
> Unit 1 도메인 특화 적용 패턴만 기술합니다.

---

## 1. 인증 플로우 패턴 (Dual Auth Pattern)

### 관리자 인증 체인
```
POST /api/auth/admin/login
  → rateLimiter(req)
  → authController.adminLogin(req, res, next)
    → authService.loginAdmin(storeIdentifier, username, password)
      → adminRepository.findStoreByIdentifier(storeIdentifier)
      → adminRepository.findByStoreAndUsername(storeId, username)
      → bcrypt.compareSync(password, admin.password_hash)
      → jwt.sign({ id, storeId, username, role:'admin' }, secret, { expiresIn:'16h' })
    → clearFailedAttempts(req.ip)
    → res.json({ data: { token, admin } })
  catch → recordFailedAttempt(req.ip) → next(error)
```

### 테이블 인증 체인
```
POST /api/auth/table/login
  → rateLimiter(req)
  → authController.tableLogin(req, res, next)
    → authService.loginTable(storeIdentifier, tableNumber, password)
      → adminRepository.findStoreByIdentifier(storeIdentifier)
      → adminRepository.findTableByStoreAndNumber(storeId, tableNumber)
      → bcrypt.compareSync(password, table.password_hash)
      → adminRepository.findActiveSession(tableId)
        → 없으면: adminRepository.createSession(tableId)
      → jwt.sign({ id, storeId, tableNumber, sessionId, role:'table' }, secret, { expiresIn:'24h' })
    → clearFailedAttempts(req.ip)
    → res.json({ data: { token, table, sessionId } })
  catch → recordFailedAttempt(req.ip) → next(error)
```

### 인증 미들웨어 라우팅
```
menuRoutes:
  GET  /api/menus         → tableAuthMiddleware → menuController.getAll
  GET  /api/menus/:id     → tableAuthMiddleware → menuController.getById
  POST /api/menus         → authMiddleware      → menuController.create
  PUT  /api/menus/:id     → authMiddleware      → menuController.update
  DELETE /api/menus/:id   → authMiddleware      → menuController.delete
  PUT  /api/menus/:id/order → authMiddleware    → menuController.updateOrder

categoryRoutes (menuRoutes에 포함):
  GET  /api/categories        → tableAuthMiddleware → menuController.getCategories
  POST /api/categories        → authMiddleware      → menuController.createCategory
  PUT  /api/categories/:id    → authMiddleware      → menuController.updateCategory
  DELETE /api/categories/:id  → authMiddleware      → menuController.deleteCategory
```

---

## 2. 소프트 삭제 패턴 (Soft Delete)

### 메뉴 삭제 전략
```
삭제 요청:
  menuService.deleteMenu(id)
    → UPDATE menu_items SET is_available = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?

조회 분기:
  고객용 (getAvailableMenus):
    → WHERE is_available = 1
  관리자용 (getAllMenus):
    → WHERE 조건 없음 (전체 표시, 비활성 메뉴는 UI에서 시각적 구분)
```

### 이름 중복 검사 범위
```
findByNameInCategory(categoryId, name):
  → WHERE category_id = ? AND name = ? AND is_available = 1
  (소프트 삭제된 메뉴는 중복 검사에서 제외)
```

---

## 3. 순서 교환 패턴 (Swap Order)

### 트랜잭션 기반 순서 교환
```
menuService.updateMenuOrder(menuId, direction):
  1. 현재 메뉴 조회 → currentMenu
  2. 같은 카테고리 메뉴 목록 조회 (display_order ASC)
  3. 현재 인덱스 찾기
  4. direction='up' → targetIndex = currentIndex - 1
     direction='down' → targetIndex = currentIndex + 1
  5. 범위 밖이면 → 400 에러

  트랜잭션:
    UPDATE menu_items SET display_order = ? WHERE id = ?  -- current → target.order
    UPDATE menu_items SET display_order = ? WHERE id = ?  -- target → current.order
```

---

## 4. 프론트엔드 자동 로그인 패턴

### SetupPage Auto-Login Flow
```
SetupPage mount:
  1. localStorage에서 storeId, tableNumber, tablePassword 읽기
  2. 모두 존재하면:
     → setIsLoading(true)
     → authContext.tableLogin(storeId, tableNumber, password)
       → 성공: navigate('/customer/menu')
       → 실패: setError(message), localStorage 유지 (재시도 가능)
     → setIsLoading(false)
  3. 하나라도 없으면:
     → 설정 폼 표시
```

### AuthContext 초기화 Flow
```
AuthContext mount:
  1. token = localStorage.getItem('token')
  2. token 없으면: { isAuthenticated: false, isLoading: false }
  3. token 있으면:
     → verifyToken() API 호출
       → valid: user 설정, isAuthenticated=true
       → invalid/expired: token 제거, isAuthenticated=false
  4. isLoading = false
```

---

## 5. Controller-Service 에러 전파 패턴

### Unit 1 에러 코드 매핑
```
authService:
  매장 없음         → AppError('매장을 찾을 수 없습니다', 401, 'UNAUTHORIZED')
  인증 실패         → AppError('아이디 또는 비밀번호가 일치하지 않습니다', 401, 'UNAUTHORIZED')
  테이블 인증 실패   → AppError('테이블 정보가 일치하지 않습니다', 401, 'UNAUTHORIZED')

menuService:
  메뉴 없음         → AppError('메뉴를 찾을 수 없습니다', 404, 'NOT_FOUND')
  카테고리 없음      → AppError('카테고리를 찾을 수 없습니다', 404, 'NOT_FOUND')
  이름 중복         → AppError('같은 카테고리에 동일한 이름의 메뉴가 있습니다', 409, 'CONFLICT')
  카테고리 삭제 차단  → AppError('카테고리에 메뉴가 존재합니다', 400, 'VALIDATION_ERROR')
  이동 불가         → AppError('더 이상 이동할 수 없습니다', 400, 'VALIDATION_ERROR')
  검증 실패         → AppError('필수 필드를 확인해주세요', 400, 'VALIDATION_ERROR')
```

### Controller 패턴
```
const methodName = async (req, res, next) => {
  try {
    const result = service.method(params);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};
```
