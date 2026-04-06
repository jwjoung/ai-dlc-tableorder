# Unit 1: 인증+메뉴 - Business Logic Model

## 개요
Unit 1의 비즈니스 로직 플로우를 정의합니다.

---

## 1. 관리자 로그인 플로우 (authService.loginAdmin)

```
Input: storeIdentifier, username, password

1. Rate Limit 확인
   - rateLimiter 미들웨어에서 IP 기반 사전 차단
2. 매장 조회
   - findStoreByIdentifier(storeIdentifier)
   - 없으면 → 401 "매장을 찾을 수 없습니다"
3. 관리자 조회
   - findByStoreAndUsername(storeId, username)
   - 없으면 → 401 "아이디 또는 비밀번호가 일치하지 않습니다"
4. 비밀번호 검증
   - bcrypt.compare(password, admin.password_hash)
   - 불일치 → recordFailedAttempt(ip) → 401 "아이디 또는 비밀번호가 일치하지 않습니다"
5. JWT 토큰 발급
   - Payload: { id, storeId, username, role: 'admin' }
   - 만료: 16시간
6. 성공 시 clearFailedAttempts(ip)
7. 반환: { token, admin: { id, username, storeId } }
```

---

## 2. 테이블 로그인 플로우 (authService.loginTable)

```
Input: storeIdentifier, tableNumber, password

1. Rate Limit 확인
2. 매장 조회
   - findStoreByIdentifier(storeIdentifier)
   - 없으면 → 401 "매장을 찾을 수 없습니다"
3. 테이블 조회
   - findTableByStoreAndNumber(storeId, tableNumber)
   - 없으면 → 401 "테이블 정보가 일치하지 않습니다"
4. 비밀번호 검증
   - bcrypt.compare(password, table.password_hash)
   - 불일치 → recordFailedAttempt(ip) → 401 "테이블 정보가 일치하지 않습니다"
5. 세션 조회 또는 생성
   - findActiveSession(tableId)
   - 활성 세션 없으면 → createSession(tableId)
6. JWT 토큰 발급
   - Payload: { id: tableId, storeId, tableNumber, sessionId, role: 'table' }
   - 만료: 24시간
7. 성공 시 clearFailedAttempts(ip)
8. 반환: { token, table: { id, tableNumber, storeId }, sessionId }
```

---

## 3. 토큰 검증 플로우 (authService.verifyToken)

```
Input: token (Bearer 토큰)

1. jwt.verify(token, jwtSecret)
2. 성공 → { valid: true, payload }
3. 만료 → { valid: false, error: 'TOKEN_EXPIRED' }
4. 유효하지 않음 → { valid: false, error: 'INVALID_TOKEN' }
```

---

## 4. 메뉴 전체 조회 플로우 (menuService.getAllMenus)

```
Input: storeId, isAdmin (boolean)

1. 카테고리 목록 조회
   - getAllCategories(storeId)
2. 메뉴 조회
   - isAdmin → getAllMenus(storeId) (비가용 메뉴 포함)
   - !isAdmin → getAvailableMenus(storeId) (가용 메뉴만)
3. 카테고리별 그룹화
   - categories.map(cat => ({
       ...cat,
       menus: menus.filter(m => m.category_id === cat.id)
     }))
4. 반환: [{ id, name, display_order, menus: [...] }, ...]
```

---

## 5. 메뉴 상세 조회 플로우 (menuService.getMenuById)

```
Input: menuId

1. getMenuById(menuId)
2. 없으면 → 404 "메뉴를 찾을 수 없습니다"
3. 반환: { id, name, price, description, image_url, category_id, category_name, is_available, display_order }
```

---

## 6. 메뉴 등록 플로우 (menuService.createMenu)

```
Input: storeId, { name, price, description, image_url, category_id }

1. 검증
   - validateMenu(data) → 필수 필드, 가격 범위 확인
2. 카테고리 존재 확인
   - getCategoryById(category_id)
   - 없으면 → 400 "존재하지 않는 카테고리입니다"
3. 이름 중복 검사
   - findByNameInCategory(category_id, name)
   - 있으면 → 409 "같은 카테고리에 동일한 이름의 메뉴가 있습니다"
4. display_order 결정
   - getMaxDisplayOrder(category_id) + 1
5. 메뉴 생성
   - createMenu({ store_id, category_id, name, price, description, image_url, display_order })
6. 반환: 생성된 메뉴 객체
```

---

## 7. 메뉴 수정 플로우 (menuService.updateMenu)

```
Input: menuId, { name, price, description, image_url, category_id }

1. 기존 메뉴 확인
   - getMenuById(menuId)
   - 없으면 → 404 "메뉴를 찾을 수 없습니다"
2. 검증
   - validateMenu(data)
3. 카테고리 변경 시 존재 확인
   - getCategoryById(category_id)
4. 이름 중복 검사 (이름 또는 카테고리 변경 시)
   - findByNameInCategory(category_id, name) → 자기 자신 제외
5. 메뉴 업데이트
   - updateMenu(menuId, data)
6. 반환: 수정된 메뉴 객체
```

---

## 8. 메뉴 삭제 플로우 (menuService.deleteMenu)

```
Input: menuId

1. 기존 메뉴 확인
   - getMenuById(menuId)
   - 없으면 → 404 "메뉴를 찾을 수 없습니다"
2. 소프트 삭제 (is_available = 0)
   - softDeleteMenu(menuId)
3. 반환: void (204 No Content)
```

---

## 9. 메뉴 순서 변경 플로우 (menuService.updateMenuOrder)

```
Input: menuId, direction ('up' | 'down')

1. 현재 메뉴 조회
   - getMenuById(menuId)
   - 없으면 → 404
2. 같은 카테고리 내 메뉴 목록 조회 (is_available=1)
   - getMenusByCategory(category_id)
3. 현재 메뉴의 인덱스 찾기
4. 교환 대상 결정
   - direction='up': 이전 메뉴
   - direction='down': 다음 메뉴
   - 대상 없으면 → 400 "더 이상 이동할 수 없습니다"
5. 두 메뉴의 display_order 교환
   - swapMenuOrder(id1, order1, id2, order2) (트랜잭션)
6. 반환: void (200 OK)
```

---

## 10. 카테고리 목록 조회 (menuService.getCategories)

```
Input: storeId

1. getAllCategories(storeId)
2. 반환: [{ id, name, display_order }, ...]
```

---

## 11. 카테고리 등록 (menuService.createCategory)

```
Input: storeId, { name }

1. 이름 검증 (빈 값 불가)
2. display_order 결정 (기존 최대값 + 1)
3. createCategory(storeId, name, displayOrder)
4. 반환: 생성된 카테고리 객체
```

---

## 12. 카테고리 수정 (menuService.updateCategory)

```
Input: categoryId, { name, display_order }

1. 카테고리 존재 확인
   - getCategoryById(categoryId)
   - 없으면 → 404
2. 이름 검증
3. updateCategory(categoryId, name, display_order)
4. 반환: 수정된 카테고리 객체
```

---

## 13. 카테고리 삭제 (menuService.deleteCategory)

```
Input: categoryId

1. 카테고리 존재 확인
   - getCategoryById(categoryId)
   - 없으면 → 404
2. 카테고리 내 메뉴 존재 확인
   - getMenuCountByCategory(categoryId)
   - 0 초과 → 400 "카테고리에 메뉴가 존재합니다. 메뉴를 먼저 삭제하거나 이동해주세요"
3. deleteCategory(categoryId)
4. 반환: void (204 No Content)
```
