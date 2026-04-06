# Unit 1: 인증+메뉴 - Functional Design Plan

## Plan Overview
Unit 1은 인증(관리자/테이블) 및 메뉴/카테고리 관리 전체 스택을 담당합니다.
6개 스토리: US-C01, US-C02, US-A01, US-A08, US-A09, US-A10

---

## Execution Steps

### Step 1: Domain Entities 설계
- [x] 1.1 admins 테이블 접근 패턴 정의 (조회 by store_id+username)
- [x] 1.2 tables 테이블 접근 패턴 정의 (조회 by store_id+table_number)
- [x] 1.3 table_sessions 접근 패턴 정의 (활성 세션 조회/생성)
- [x] 1.4 categories 접근 패턴 정의 (CRUD, 순서 조정)
- [x] 1.5 menu_items 접근 패턴 정의 (CRUD, 카테고리별 그룹 조회, 순서 조정)

### Step 2: Business Logic Model 설계
- [x] 2.1 관리자 로그인 플로우 설계 (bcrypt 검증, JWT 발급, rate limiting)
- [x] 2.2 테이블 로그인 플로우 설계 (비밀번호 검증, 세션 조회/생성, JWT 발급)
- [x] 2.3 토큰 검증 플로우 설계
- [x] 2.4 메뉴 조회 플로우 설계 (카테고리별 그룹화, 가용성 필터)
- [x] 2.5 메뉴 등록/수정 플로우 설계 (검증 로직 포함)
- [x] 2.6 메뉴 삭제 플로우 설계 (주문 참조 처리)
- [x] 2.7 메뉴 순서 조정 플로우 설계
- [x] 2.8 카테고리 CRUD 플로우 설계

### Step 3: Business Rules 정의
- [x] 3.1 인증 비즈니스 규칙 (JWT 페이로드, 만료, 시도 제한)
- [x] 3.2 메뉴 검증 규칙 (필수 필드, 가격 범위, 이름 중복)
- [x] 3.3 카테고리 검증 규칙
- [x] 3.4 에러 응답 규칙 (인증 실패, 검증 실패, 리소스 미존재)

### Step 4: Frontend Components 설계
- [x] 4.1 AuthContext 상태 설계 (토큰 관리, 자동 로그인, 로그아웃)
- [x] 4.2 SetupPage 컴포넌트 설계 (초기 설정 폼, 자동 로그인 플로우)
- [x] 4.3 LoginPage 컴포넌트 설계 (관리자 로그인 폼)
- [x] 4.4 MenuPage 컴포넌트 설계 (카테고리 탭, 메뉴 그리드, 상세 보기)
- [x] 4.5 MenuManagementPage 컴포넌트 설계 (CRUD, 순서 조정)
- [x] 4.6 authApi, menuApi 인터페이스 설계

---

## Questions
질문 파일 참조: `aidlc-docs/construction/unit-1-auth-menu-functional-design-questions.md`
