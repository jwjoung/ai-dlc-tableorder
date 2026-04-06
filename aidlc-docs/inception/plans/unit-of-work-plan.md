# Unit of Work Plan - 테이블오더 서비스

> **AI 추천 사항이 미리 채워져 있습니다.** 변경이 필요하면 수정해주세요.

---

## Planning Questions

### Question 1
작업 단위를 어떻게 분해하시겠습니까?

A) 기술 계층별 2단위 - Unit 1: Backend (DB+API), Unit 2: Frontend (React)
B) 기능 도메인별 3단위 - Unit 1: 인증/테이블, Unit 2: 메뉴, Unit 3: 주문/모니터링
C) 단일 단위 - 전체를 하나의 단위로 개발
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: 모놀리스 MVP에서 기술 계층별 분리가 가장 자연스러움. Backend를 먼저 완성하면 API를 독립적으로 테스트 가능. Frontend는 완성된 API 위에 구축. 의존성 방향이 단순(Frontend → Backend).

### Question 2
개발 순서는 어떻게 하시겠습니까?

A) Sequential - Backend 완료 후 Frontend 시작
B) Parallel - Backend와 Frontend 동시 개발 (Mock API 활용)
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: Sequential이 MVP에서 가장 안전. Backend API가 확정된 상태에서 Frontend를 개발하면 재작업 최소화. Mock API 관리 오버헤드 없음.

---

## Execution Checklist

### Step 1: 단위 정의
- [x] Unit 1 (Backend) 정의: 범위, 책임, 산출물
- [x] Unit 2 (Frontend) 정의: 범위, 책임, 산출물

### Step 2: 의존성 매트릭스
- [x] Unit 간 의존성 정의
- [x] 개발 순서 확정

### Step 3: 스토리 매핑
- [x] 각 스토리를 해당 Unit에 매핑
- [x] 매핑 완성도 검증 (모든 스토리가 할당됨)

### Step 4: 코드 구성 전략
- [x] Greenfield 프로젝트 디렉토리 구조 정의
