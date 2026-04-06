# Story Generation Plan - 테이블오더 서비스

## Overview
요구사항 문서(requirements.md)를 기반으로 사용자 스토리 및 페르소나를 생성하는 계획입니다.

> **AI 추천 사항이 미리 채워져 있습니다.** 변경이 필요하면 수정해주세요.

---

## Part 1: Planning Questions

### Question 1
스토리 분해(Breakdown) 방식은 어떤 접근법을 사용하시겠습니까?

A) User Journey-Based - 사용자 여정/워크플로우 기반 (예: 고객의 주문 여정, 관리자의 운영 여정)
B) Feature-Based - 시스템 기능 기반 (예: 메뉴 관리, 주문 관리, 테이블 관리)
C) Persona-Based - 사용자 유형별 그룹화 (예: 고객 스토리 → 관리자 스토리)
D) Epic-Based - 에픽 계층 구조 (상위 에픽 → 하위 스토리)
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: 테이블오더는 고객의 "입장→메뉴확인→주문→확인" 여정과 관리자의 "로그인→모니터링→관리" 여정이 명확. 사용자 여정 기반이 실제 사용 시나리오를 가장 잘 반영하며, 테스트 시나리오 도출에도 유리.

### Question 2
스토리의 세분화 수준(Granularity)은 어떻게 하시겠습니까?

A) Coarse - 큰 단위 스토리 (기능당 1-2개, 총 5-10개)
B) Medium - 중간 단위 스토리 (기능당 2-4개, 총 10-20개)
C) Fine - 세밀한 단위 스토리 (기능당 3-6개, 총 20-30개)
X) Other (please describe after [Answer]: tag below)

[Answer]: B
> **추천 이유**: MVP 규모에서 너무 세밀하면 오버헤드가 크고, 너무 거칠면 수용 기준이 모호해짐. 중간 단위가 구현 단위와 테스트 단위로 적절.

### Question 3
수용 기준(Acceptance Criteria) 형식은 어떤 것을 사용하시겠습니까?

A) Given-When-Then (BDD 스타일) - "Given [조건], When [행동], Then [결과]"
B) Checklist 스타일 - "- [ ] 조건1 충족", "- [ ] 조건2 충족"
C) Scenario 스타일 - "시나리오: [설명]" 형태의 서술형
X) Other (please describe after [Answer]: tag below)

[Answer]: B
> **추천 이유**: Checklist 스타일이 가장 직관적이고 구현/테스트 시 체크리스트로 바로 활용 가능. MVP에서 BDD 형식은 과도한 형식성.

### Question 4
스토리 우선순위 기준은 어떻게 설정하시겠습니까?

A) MoSCoW (Must/Should/Could/Won't)
B) 사용자 여정 순서 (핵심 플로우 먼저)
C) 비즈니스 가치 기반 (높은 가치 먼저)
X) Other (please describe after [Answer]: tag below)

[Answer]: B
> **추천 이유**: 테이블오더의 핵심은 "주문이 되는 것". 사용자 여정 순서로 우선순위를 두면 가장 중요한 엔드투엔드 플로우가 먼저 구현되어 조기 검증 가능.

### Question 5
페르소나에 포함할 세부 정보 수준은 어떻게 하시겠습니까?

A) Basic - 이름, 역할, 주요 목표만
B) Standard - 이름, 역할, 목표, 동기, 불편사항(Pain Points), 기술 숙련도
C) Detailed - Standard + 시나리오, 하루 일과, 성격 특성 등
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: MVP에서는 핵심 역할과 목표만 파악하면 충분. 과도한 페르소나 설정은 실제 구현에 기여하지 않음.

---

## Part 2: Generation Plan (Execution Checklist)

### Step 1: 페르소나 생성
- [x] 고객(Customer) 페르소나 정의
- [x] 관리자(Admin) 페르소나 정의
- [x] personas.md 파일 생성

### Step 2: 고객 여정 스토리 생성
- [x] 테이블 자동 로그인 스토리
- [x] 메뉴 조회/탐색 스토리
- [x] 장바구니 관리 스토리
- [x] 주문 생성 스토리
- [x] 주문 내역 조회 스토리

### Step 3: 관리자 여정 스토리 생성
- [x] 매장 인증/로그인 스토리
- [x] 실시간 주문 모니터링 스토리
- [x] 테이블 관리 스토리 (초기 설정, 주문 삭제, 이용 완료, 과거 내역)
- [x] 메뉴 관리 스토리 (CRUD, 순서 조정)

### Step 4: 검증 및 완성
- [x] INVEST 기준 검증
- [x] 수용 기준 완성도 확인
- [x] 페르소나-스토리 매핑
- [x] stories.md 파일 생성
