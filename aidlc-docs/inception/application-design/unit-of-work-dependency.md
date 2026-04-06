# Unit of Work 의존성 - 테이블오더 서비스

---

## 의존성 매트릭스

| Unit | 의존 대상 | 의존 유형 | 설명 |
|------|----------|----------|------|
| Unit 0 (Foundation) | 없음 | - | 독립적, 최초 구축 |
| Unit 1 (인증+메뉴) | Unit 0 | Build-time | DB 스키마, 미들웨어, 공통 UI |
| Unit 2 (주문+모니터링) | Unit 0 | Build-time | DB 스키마, 미들웨어, 공통 UI |
| Unit 3 (테이블관리) | Unit 0 | Build-time | DB 스키마, 미들웨어, 공통 UI |
| Unit 2 ↔ Unit 3 | 협업 | Integration | DashboardPage 공유, 주문 삭제 API 호출 |

---

## 개발 순서

```
                 Unit 0: Foundation (Dev 1)
                          |
            +-------------+-------------+
            |             |             |
     Unit 1 (Dev 1)  Unit 2 (Dev 2)  Unit 3 (Dev 3)
     인증 + 메뉴     주문 + 모니터링  테이블 관리
            |             |             |
            +-------------+-------------+
                          |
                    Build & Test
                    (통합 테스트)
```

### Phase 0: Foundation (순차)
- Dev 1이 프로젝트 골격, DB 스키마, 공통 컴포넌트 구축
- Dev 2, Dev 3는 설계 리뷰 및 개발 환경 준비

### Phase 1: 도메인 개발 (병렬)
- Dev 1: 인증 + 메뉴 (Backend + Frontend)
- Dev 2: 주문 + 모니터링 (Backend + Frontend)
- Dev 3: 테이블 관리 (Backend + Frontend)
- 3명 동시 진행, 각자 독립적 파일에서 작업

### Phase 2: 통합 (합류)
- DashboardPage 통합 (Dev 2 레이아웃 + Dev 3 이용완료 버튼)
- 전체 플로우 통합 테스트
- 버그 수정 및 마무리

---

## 협업 포인트 (주의 필요)

| 포인트 | Dev | 내용 | 조율 방법 |
|--------|-----|------|----------|
| DashboardPage.jsx | Dev 2 + Dev 3 | Dev 2가 그리드/SSE 레이아웃, Dev 3가 이용완료/상세보기 | Dev 2가 먼저 레이아웃 작성, Dev 3가 모달 트리거 추가 |
| 주문 삭제 UI | Dev 2 + Dev 3 | API는 Dev 2 orderRoutes, UI 호출은 Dev 3 TableDetailModal | 인터페이스 사전 합의 |
| AuthContext | Unit 1 → Unit 2, 3 | Dev 1이 구현, Dev 2/3가 사용 | Dev 1이 먼저 완성 또는 인터페이스 공유 |
| app.js 라우터 등록 | 전원 | 각 Unit의 라우트를 app.js에 등록 | Unit 0에서 빈 import 미리 준비 |

---

## 병합 충돌 최소화 전략

1. **파일 분리**: 각 Unit이 독립적 파일 소유 (위 코드 구성 전략 참조)
2. **공유 파일 최소화**: App.jsx, app.js만 공유 - Unit 0에서 라우트 등록 골격 미리 작성
3. **인터페이스 우선**: AuthContext, apiClient 인터페이스를 Unit 0에서 정의
4. **순차 병합**: Unit 1 → Unit 2 → Unit 3 순서로 main 브랜치에 병합
