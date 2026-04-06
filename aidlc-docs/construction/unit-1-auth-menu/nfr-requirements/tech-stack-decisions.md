# Tech Stack Decisions - Unit 1: 인증+메뉴

> Unit 0에서 확정된 기술 스택을 상속합니다. Unit 1 추가 결정사항만 기술합니다.

---

## Unit 0 상속 (변경 없음)

| 영역 | 기술 | 비고 |
|------|------|------|
| Backend | Node.js 20 + Express 4.18 | Unit 0 확정 |
| DB | better-sqlite3 11 | 동기식 API |
| Auth | jsonwebtoken 9 + bcryptjs 2.4 | JWT + bcrypt |
| Frontend | React 18 + Vite 5 + Tailwind 3 | Unit 0 확정 |
| HTTP Client | Axios 1.6 | 인터셉터 활용 |

---

## Unit 1 추가 결정사항

### 인증 관련
| 결정 | 선택 | 이유 |
|------|------|------|
| JWT 발급 방식 | jsonwebtoken.sign() | Unit 0 선택 유지 |
| 관리자 토큰 만료 | 16시간 | 요구사항 FR-A01 |
| 테이블 토큰 만료 | 24시간 | FD Q1 결정 (하루 영업 기준) |
| 비밀번호 비교 | bcryptjs.compare() | 동기식, MVP 성능 충분 |
| 토큰 저장 (클라이언트) | localStorage | Unit 0 apiClient 패턴 |

### 메뉴 관리 관련
| 결정 | 선택 | 이유 |
|------|------|------|
| 메뉴 삭제 | 소프트 삭제 (is_available=0) | FD Q3 결정, 주문 데이터 보호 |
| 카테고리 삭제 | 메뉴 있으면 차단 | FD Q4 결정, 데이터 안전성 |
| 순서 조정 | display_order 교환 | 화살표 버튼 (FD Q5), swap 방식 |
| 이름 중복 | 카테고리 내 중복 불가 | FD Q9 결정 |

### 프론트엔드 관련
| 결정 | 선택 | 이유 |
|------|------|------|
| 상태 관리 | React Context | AuthContext (전역 인증 상태) |
| 메뉴 상세 | 모달/팝업 | FD Q6 결정, 목록 유지 |
| 장바구니 추가 위치 | 카드 + 상세 모달 | FD Q7 결정, 접근성 극대화 |
| 관리자 메뉴 관리 | 사이드바+메인 레이아웃 | FD Q8 결정 |

---

## 추가 패키지 불필요

Unit 1에서는 Unit 0에서 설치한 패키지만으로 구현 가능합니다.
추가 npm 패키지 설치가 필요하지 않습니다.
