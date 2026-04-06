# Unit 3: 테이블관리 - Business Rules

---

## BR-TBL-01: 테이블 번호
- 매장 내 유니크 (store_id + table_number)
- 1 이상 정수

## BR-TBL-02: 테이블 비밀번호
- bcrypt 해싱 (salt rounds: 10)
- 최소 4자

## BR-TBL-03: 이용 완료 조건
- 활성 세션이 존재해야 함
- 주문이 없어도 이용 완료 가능 (세션만 종료)

## BR-TBL-04: 이력 이동
- 주문 + 항목을 order_history/order_history_items로 복사
- 원본 주문 삭제 (CASCADE)
- completed_at = 현재 시각

## BR-TBL-05: 과거 내역 필터
- 날짜 필터: from/to (YYYY-MM-DD)
- 기본: 전체 (필터 없음)
- 시간 역순 정렬

## BR-API-U3: 인증 요구사항
| 엔드포인트 | 인증 |
|-----------|------|
| GET /api/tables | authMiddleware |
| POST /api/tables | authMiddleware |
| PUT /api/tables/:id | authMiddleware |
| POST /api/tables/:id/complete | authMiddleware |
| GET /api/tables/:id/history | authMiddleware |
