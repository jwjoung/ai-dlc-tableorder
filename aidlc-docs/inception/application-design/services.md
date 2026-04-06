# 서비스 레이어 설계 - 테이블오더 서비스

---

## 서비스 아키텍처 개요

```
Client (React) --> API Routes --> Controllers --> Services --> Repositories --> SQLite
                                                     |
                                              SSE Service --> SSE Clients
```

---

## 1. AuthService - 인증 서비스

**책임**: 관리자/테이블 인증, JWT 토큰 관리, 로그인 시도 제한

**의존성**: adminRepository, tableRepository, sessionRepository

**오케스트레이션**:
- 관리자 로그인: adminRepository에서 계정 조회 → bcrypt 비밀번호 검증 → JWT 발급
- 테이블 로그인: tableRepository에서 테이블 조회 → 비밀번호 검증 → 현재 세션 조회/생성 → JWT 발급
- 시도 제한: 메모리 기반 카운터로 IP/ID별 실패 횟수 추적

---

## 2. MenuService - 메뉴 서비스

**책임**: 메뉴 CRUD, 카테고리 관리, 순서 조정, 데이터 검증

**의존성**: menuRepository

**오케스트레이션**:
- 메뉴 조회: menuRepository에서 카테고리별로 그룹화하여 조회
- 메뉴 등록/수정: 검증(필수필드, 가격 범위) → menuRepository에 저장
- 순서 조정: 대상 메뉴의 display_order 업데이트

---

## 3. OrderService - 주문 서비스

**책임**: 주문 생성, 상태 관리, 삭제, 총액 계산

**의존성**: orderRepository, menuRepository, sessionRepository, sseService

**오케스트레이션**:
- 주문 생성: 메뉴 유효성 확인 → 주문/항목 저장 → 총액 계산 → SSE 브로드캐스트 (new_order)
- 상태 변경: orderRepository 업데이트 → SSE 브로드캐스트 (order_updated)
- 주문 삭제: orderRepository 삭제 → 테이블 총액 재계산 → SSE 브로드캐스트 (order_deleted)

---

## 4. TableService - 테이블/세션 서비스

**책임**: 테이블 관리, 세션 라이프사이클, 이용 완료, 이력 관리

**의존성**: tableRepository, sessionRepository, orderRepository, orderHistoryRepository, sseService

**오케스트레이션**:
- 테이블 등록: tableRepository에 테이블 생성 → 초기 세션 생성
- 이용 완료: 현재 세션의 주문/항목을 orderHistory로 복사 → 현재 주문 삭제 → 세션 종료 → SSE 브로드캐스트 (table_completed)
- 과거 내역: orderHistoryRepository에서 날짜 필터링하여 조회

---

## 5. SSEService - 실시간 이벤트 서비스

**책임**: SSE 연결 관리, 이벤트 브로드캐스트

**의존성**: 없음 (다른 서비스에서 주입받아 사용)

**오케스트레이션**:
- 클라이언트 등록: 매장ID별 클라이언트 목록 관리 (Map)
- 연결 해제: 클라이언트 연결 종료 시 목록에서 제거
- 브로드캐스트: 매장ID에 연결된 모든 클라이언트에 이벤트 전송

**이벤트 타입**:
| 이벤트 | 발생 시점 | 데이터 |
|--------|----------|--------|
| new_order | 새 주문 생성 | 주문 정보 (테이블번호, 메뉴, 금액) |
| order_updated | 주문 상태 변경 | 주문ID, 새 상태 |
| order_deleted | 주문 삭제 | 주문ID, 테이블ID |
| table_completed | 테이블 이용 완료 | 테이블ID |
