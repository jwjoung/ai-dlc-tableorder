# Code Summary - Unit 3: 테이블관리

## 생성된 파일 (11개 신규 + 2개 수정)

### Backend (6개 신규 + 1개 수정)
| 파일 | 설명 |
|------|------|
| server/src/repositories/tableRepository.js | 테이블 CRUD |
| server/src/repositories/sessionRepository.js | 세션 조회/생성/종료 |
| server/src/repositories/orderHistoryRepository.js | 주문→이력 이동, 이력 조회 |
| server/src/services/tableService.js | 테이블 관리, 이용 완료, 이력 조회 |
| server/src/controllers/tableController.js | 테이블 HTTP 처리 |
| server/src/routes/tableRoutes.js | /api/tables/* |
| server/src/app.js (수정) | tableRoutes 등록 |

### Frontend (5개 신규 + 1개 수정)
| 파일 | Story | 설명 |
|------|-------|------|
| client/src/api/tableApi.js | - | 테이블 API 호출 |
| client/src/pages/admin/TableSettingsPage.jsx | US-A04 | 테이블 등록/수정 |
| client/src/pages/admin/TableDetailModal.jsx | US-A05,A06 | 주문 삭제, 이용 완료 |
| client/src/pages/admin/OrderHistoryModal.jsx | US-A07 | 과거 내역, 날짜 필터 |
| client/src/App.jsx (수정) | - | 라우트 활성화 |

## Story 구현 현황
| Story | 상태 |
|-------|------|
| US-A04 테이블 초기 설정 | ✅ |
| US-A05 주문 삭제 | ✅ |
| US-A06 테이블 이용 완료 | ✅ |
| US-A07 과거 주문 내역 조회 | ✅ |

## API 엔드포인트
| Method | Endpoint | 상태 |
|--------|----------|------|
| GET | /api/tables | ✅ |
| POST | /api/tables | ✅ |
| PUT | /api/tables/:id | ✅ |
| POST | /api/tables/:id/complete | ✅ |
| GET | /api/tables/:id/history | ✅ |
