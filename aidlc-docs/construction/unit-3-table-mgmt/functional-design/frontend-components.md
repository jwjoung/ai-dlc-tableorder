# Unit 3: 테이블관리 - Frontend Components

---

## 1. TableSettingsPage (pages/admin/TableSettingsPage.jsx)
- 테이블 목록 표시 (번호, 세션 상태)
- 테이블 추가 모달 (번호, 비밀번호)
- 테이블 수정 모달

## 2. TableDetailModal (pages/admin/TableDetailModal.jsx)
- DashboardPage에서 테이블 카드 클릭 시 표시
- 해당 테이블 전체 주문 목록
- 주문별 상태 변경 버튼
- 주문 삭제 버튼 + 확인 팝업
- 이용 완료 버튼 + 확인 팝업

## 3. OrderHistoryModal (pages/admin/OrderHistoryModal.jsx)
- 과거 주문 내역 모달
- 날짜 필터 (from, to)
- 이력 카드 (주문번호, 시각, 메뉴 목록, 총액, 완료시각)

## 4. tableApi (api/tableApi.js)
| 메서드 | HTTP | URL |
|--------|------|-----|
| getTables() | GET | /tables |
| createTable(data) | POST | /tables |
| updateTable(id, data) | PUT | /tables/:id |
| completeTable(id) | POST | /tables/:id/complete |
| getTableHistory(id, dateFilter) | GET | /tables/:id/history |

## 5. 라우팅
| 경로 | 컴포넌트 | 인증 |
|------|---------|------|
| /admin/tables | TableSettingsPage | admin |
