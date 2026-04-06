# Tech Stack Decisions - Unit 2: 주문+모니터링

> Unit 0 기술 스택 상속. 추가 패키지 불필요.

## Unit 2 특화 결정사항
| 결정 | 선택 | 이유 |
|------|------|------|
| SSE 구현 | Express Response 기반 스트리밍 | 별도 라이브러리 불필요 |
| 장바구니 저장 | localStorage + React Context | 클라이언트 전용, 서버 불필요 |
| 주문번호 | ORD-YYYYMMDD-XXXX | 날짜+순번, 읽기 쉬움 |
| 주문 삭제 | 하드 삭제 (CASCADE) | order_items도 함께 삭제 |
| SSE 클라이언트 | EventSource API | 브라우저 내장, 자동 재연결 |
