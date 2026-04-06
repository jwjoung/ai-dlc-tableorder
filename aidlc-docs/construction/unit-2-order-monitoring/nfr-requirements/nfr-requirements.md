# NFR Requirements - Unit 2: 주문+모니터링

> Unit 0 Foundation NFR 상속. Unit 2 도메인 특화 NFR.

---

## 1. 성능
### NFR-U2-P01: 주문 생성 응답
- 주문 생성 API: 300ms 이내 (트랜잭션 + SSE 브로드캐스트 포함)

### NFR-U2-P02: SSE 이벤트 전파
- 주문 이벤트 → 관리자 화면 반영: 2초 이내
- Heartbeat: 30초 간격

### NFR-U2-P03: 대시보드 초기 로딩
- 전체 활성 주문 조회: 500ms 이내

## 2. 보안
### NFR-U2-S01: 주문 API 인가
- 주문 생성/세션 조회: tableAuthMiddleware
- 관리자 조회/상태변경/삭제: authMiddleware
- SSE 연결: authMiddleware

## 3. 신뢰성
### NFR-U2-R01: 주문 데이터 무결성
- 주문 생성은 트랜잭션으로 원자성 보장 (orders + order_items)
- 메뉴명/단가 스냅샷 저장 (메뉴 변경에 영향 없음)

### NFR-U2-R02: SSE 연결 관리
- 연결 해제 시 자동 정리
- 재연결: EventSource 기본 동작 활용

## 4. 사용성
### NFR-U2-U01: 장바구니 UX
- localStorage 저장 (새로고침 유지)
- 실시간 총액 표시
- 수량 +-버튼 (터치 44x44px)

### NFR-U2-U02: 주문 성공 UX
- 주문번호 5초 표시 후 자동 리다이렉트
- 장바구니 자동 비우기

### NFR-U2-U03: 대시보드 UX
- 신규 주문 시각적 강조 (3초 하이라이트)
- 상태별 색상 구분
