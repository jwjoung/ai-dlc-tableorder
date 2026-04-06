# Requirements Verification Questions

제공하신 요구사항 문서를 분석한 결과, 몇 가지 사항에 대한 확인이 필요합니다.
각 질문의 [Answer]: 태그 뒤에 선택지를 입력해주세요.

> **AI 추천 사항이 미리 채워져 있습니다.** 변경이 필요하면 수정해주세요.

---

## Question 1
백엔드(서버) 기술 스택으로 어떤 것을 사용하시겠습니까?

A) Node.js (Express/Fastify)
B) Python (FastAPI/Django)
C) Java (Spring Boot)
D) Go
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: SSE 기반 실시간 주문 모니터링에 Node.js의 이벤트 기반 아키텍처가 적합. 프론트엔드와 동일한 JavaScript 생태계로 개발 효율성 극대화. Express는 성숙한 생태계와 풍부한 미들웨어 보유.

## Question 2
프론트엔드 기술 스택으로 어떤 것을 사용하시겠습니까?

A) React (Vite)
B) Next.js
C) Vue.js
D) Plain HTML/CSS/JavaScript
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: 컴포넌트 기반 설계로 고객용/관리자용 UI 재사용성 우수. Vite의 빠른 빌드와 HMR로 개발 생산성 높음. 장바구니, 실시간 대시보드 등 상태 관리가 필요한 UI에 React가 적합.

## Question 3
데이터베이스로 어떤 것을 사용하시겠습니까?

A) PostgreSQL
B) MySQL
C) SQLite (경량, 개발/소규모 운영)
D) DynamoDB (AWS NoSQL)
X) Other (please describe after [Answer]: tag below)

[Answer]: C
> **추천 이유**: MVP 단계에서 별도 DB 서버 설치 없이 즉시 사용 가능. 파일 기반으로 설정이 간단하고 배포가 용이. 소규모 매장(테이블 10개 이하) 기준 성능 충분. 추후 PostgreSQL로 마이그레이션 용이.

## Question 4
배포 환경은 어디를 목표로 하시겠습니까?

A) AWS (EC2, ECS, Lambda 등)
B) 로컬/온프레미스 서버
C) Docker 컨테이너 (클라우드 미정)
D) 배포 환경은 나중에 결정 (로컬 개발 우선)
X) Other (please describe after [Answer]: tag below)

[Answer]: D
> **추천 이유**: MVP 단계에서는 로컬 개발 환경에서 기능 검증에 집중. 배포 인프라 결정은 기능 완성 후로 미뤄 개발 속도 확보.

## Question 5
매장(Store) 구조는 어떻게 설계하시겠습니까?

A) 단일 매장 전용 (하나의 매장만 지원)
B) 멀티 매장 지원 (여러 매장이 독립적으로 운영)
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: MVP 범위에서는 단일 매장에 집중하여 핵심 주문 프로세스를 완성. 요구사항에 매장 식별자가 포함되어 있어 데이터 모델은 멀티 매장 확장 가능하도록 설계하되, 기능적으로는 단일 매장만 지원.

## Question 6
메뉴 이미지 관리 방식은 어떻게 하시겠습니까?

A) 외부 이미지 URL 직접 입력 (이미지 업로드 기능 없음)
B) 서버에 이미지 파일 업로드 후 저장
C) AWS S3 등 클라우드 스토리지에 업로드
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: MVP에서 이미지 업로드/리사이징은 제외 사항(constraints.md)에 명시됨. URL 입력 방식이 가장 단순하며 외부 의존성 없음.

## Question 7
관리자 계정 관리 방식은 어떻게 하시겠습니까?

A) 사전 설정된 관리자 계정 사용 (DB seed 또는 환경변수)
B) 관리자 회원가입 기능 포함
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: MVP에서는 사전 설정된 관리자 계정으로 충분. 회원가입 기능은 불필요한 복잡성 추가. DB seed로 초기 관리자 계정을 생성하는 방식이 간단하고 안전.

## Question 8
동시 접속 규모(한 매장 기준)를 어떻게 예상하시겠습니까?

A) 소규모 (테이블 10개 이하)
B) 중규모 (테이블 10~50개)
C) 대규모 (테이블 50개 이상)
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: MVP 검증 단계에서는 소규모로 시작. SQLite + 단일 서버 구성으로 충분히 처리 가능한 규모. 검증 후 규모 확장 고려.

## Question 9
고객용 인터페이스와 관리자용 인터페이스를 어떻게 구성하시겠습니까?

A) 하나의 웹 애플리케이션 내에서 경로로 분리 (예: /customer, /admin)
B) 별도의 두 개 웹 애플리케이션으로 분리
X) Other (please describe after [Answer]: tag below)

[Answer]: A
> **추천 이유**: 단일 앱으로 빌드/배포 단순화. 공통 컴포넌트(메뉴 카드 등) 재사용 용이. 경로 기반 분리로 역할별 접근 제어 가능. MVP에서 별도 앱 분리는 과도한 복잡성.

## Question 10: Security Extensions
이 프로젝트에 보안 확장 규칙을 적용하시겠습니까?

A) Yes - 모든 SECURITY 규칙을 필수 제약으로 적용 (프로덕션 수준 애플리케이션 권장)
B) No - SECURITY 규칙 건너뜀 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: B
> **추천 이유**: MVP/프로토타입 단계에서는 핵심 기능 구현에 집중. 요구사항에 이미 기본 보안(JWT, bcrypt)이 포함되어 있어 기본적인 보안은 확보됨. 프로덕션 배포 전 보안 강화 단계에서 적용 권장.
