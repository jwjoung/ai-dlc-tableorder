# Application Design Plan - 테이블오더 서비스

> **AI 추천 사항이 미리 채워져 있습니다.** 변경이 필요하면 수정해주세요.

---

## Design Questions

### Question 1
프론트엔드 컴포넌트 구성 패턴은 어떻게 하시겠습니까?

A) Feature-Based - 기능별 폴더 구성 (예: /features/menu, /features/cart, /features/orders)
B) Layer-Based - 계층별 폴더 구성 (예: /components, /pages, /hooks, /services)
C) Hybrid - 페이지는 기능별, 공통 요소는 계층별
X) Other (please describe after [Answer]: tag below)

[Answer]: C
> **추천 이유**: 페이지/라우트는 기능별로 구성하여 직관적 탐색, 공통 UI 컴포넌트와 유틸리티는 계층별로 분리하여 재사용성 확보. MVP에 적합한 균형.

### Question 2
프론트엔드 상태 관리 방식은 어떻게 하시겠습니까?

A) React Context API - 가볍고 간단, 추가 라이브러리 불필요
B) Zustand - 경량 상태 관리, 간결한 API
C) Redux Toolkit - 강력하지만 MVP에 과도할 수 있음
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: MVP 규모에서 Context API로 충분. 인증 상태, 장바구니 등 전역 상태가 복잡하지 않음. 추가 의존성 없이 React 내장 기능으로 해결.

### Question 3
백엔드 API 설계 스타일은 어떻게 하시겠습니까?

A) RESTful Resource-Based - /api/menus, /api/orders 등 자원 중심
B) Action-Based - /api/createOrder, /api/getMenus 등 액션 중심
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: RESTful이 업계 표준이며 직관적. 자원 중심 URL 구조가 CRUD 작업과 자연스럽게 매핑.

### Question 4
백엔드 프로젝트 구조 패턴은 어떻게 하시겠습니까?

A) MVC 패턴 - routes → controllers → models
B) Layered Architecture - routes → controllers → services → repositories
C) Simple Flat - routes에서 직접 DB 접근 (최소 구조)
X) Other (please describe after [Answer]: tag below)

[Answer]: B
> **추천 이유**: Service 레이어 분리로 비즈니스 로직과 데이터 접근을 분리. 테스트 용이성 확보. 주문 처리, 세션 관리 등 복잡한 로직을 Service에서 조합.

### Question 5
프론트엔드 UI 스타일링 방식은 어떻게 하시겠습니까?

A) Tailwind CSS - 유틸리티 기반, 빠른 개발
B) CSS Modules - 컴포넌트 스코프 CSS
C) styled-components - CSS-in-JS
D) Plain CSS - 별도 라이브러리 없음
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: 유틸리티 클래스 기반으로 빠른 UI 개발. 별도 CSS 파일 없이 컴포넌트 내에서 스타일 완결. 터치 친화적 UI를 빠르게 구현 가능.

---

## Execution Checklist

### Step 1: 컴포넌트 식별
- [x] 프론트엔드 컴포넌트 구조 정의
- [x] 백엔드 컴포넌트 구조 정의
- [x] 데이터베이스 스키마 구조 정의

### Step 2: 컴포넌트 메서드 정의
- [x] 프론트엔드 주요 페이지/컴포넌트 메서드
- [x] 백엔드 API 엔드포인트 및 서비스 메서드
- [x] 데이터 접근 메서드 (Repository)

### Step 3: 서비스 레이어 설계
- [x] 인증 서비스 설계
- [x] 주문 서비스 설계
- [x] 메뉴 서비스 설계
- [x] 테이블/세션 서비스 설계
- [x] SSE 서비스 설계

### Step 4: 컴포넌트 의존성 정의
- [x] 프론트엔드 → 백엔드 API 의존성
- [x] 백엔드 서비스 간 의존성
- [x] 데이터 흐름 정의

### Step 5: 통합 설계 문서
- [x] application-design.md 통합 문서 작성
