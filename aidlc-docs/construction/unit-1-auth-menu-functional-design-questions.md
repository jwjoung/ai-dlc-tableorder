# Unit 1: 인증+메뉴 - Functional Design Questions

아래 질문에 답변하여 Functional Design을 구체화해 주세요.
각 질문의 [Answer]: 뒤에 선택지 문자를 입력해 주세요.

---

## Question 1
관리자 JWT 토큰 만료 시간은 16시간으로 설정합니다. 테이블 JWT 토큰 만료 시간은 얼마로 설정할까요?

A) 16시간 (관리자와 동일)
B) 24시간 (하루 영업 기준)
C) 만료 없음 (세션 종료 시까지)
D) Other (please describe after [Answer]: tag below)

[Answer]: B 

## Question 2
테이블 로그인 시 활성 세션이 없으면 어떻게 처리할까요?

A) 자동으로 새 세션을 생성한다
B) 에러를 반환하고 관리자에게 세션 생성을 요청한다
C) Other (please describe after [Answer]: tag below)

[Answer]: A 

## Question 3
메뉴 삭제 시 해당 메뉴가 이미 주문에 포함되어 있으면 어떻게 처리할까요?

A) 소프트 삭제 (is_available = 0으로 변경, 데이터 유지)
B) 하드 삭제 (완전 삭제, order_items에는 menu_name이 저장되어 있으므로 기존 주문 표시 가능)
C) 삭제 차단 (활성 주문이 있으면 삭제 불가)
D) Other (please describe after [Answer]: tag below)

[Answer]: A 

## Question 4
카테고리 삭제 시 해당 카테고리에 메뉴가 존재하면 어떻게 처리할까요?

A) 삭제 차단 (메뉴가 있으면 삭제 불가, 메뉴 먼저 이동/삭제 필요)
B) 해당 카테고리의 메뉴도 함께 삭제
C) 해당 카테고리의 메뉴를 '미분류' 카테고리로 이동 후 삭제
D) Other (please describe after [Answer]: tag below)

[Answer]: A 

## Question 5
메뉴 순서 조정 방식은 어떤 방식을 사용할까요?

A) 위/아래 화살표 버튼 (한 칸씩 이동)
B) 드래그 앤 드롭
C) 직접 순서 번호 입력
D) Other (please describe after [Answer]: tag below)

[Answer]: A 

## Question 6
고객 MenuPage에서 메뉴 상세 보기는 어떤 형태로 제공할까요?

A) 모달/팝업으로 표시 (현재 화면 위에 오버레이)
B) 별도 상세 페이지로 이동
C) 카드 확장 (인라인 확장)
D) Other (please describe after [Answer]: tag below)

[Answer]: A 

## Question 7
고객 MenuPage에서 장바구니 추가 버튼은 어디에 배치할까요?

A) 메뉴 카드에 직접 배치 (카드에 + 버튼)
B) 메뉴 상세 보기에서만 추가 가능
C) 두 곳 모두 (카드에 + 버튼 + 상세에서도 추가 가능)
D) Other (please describe after [Answer]: tag below)

[Answer]: C 

## Question 8
관리자 MenuManagementPage에서 카테고리 관리는 어떤 형태로 제공할까요?

A) 메뉴 관리 페이지 상단에 카테고리 관리 섹션 포함
B) 별도의 카테고리 관리 탭/모달
C) 사이드바에 카테고리 목록, 메인 영역에 메뉴 목록
D) Other (please describe after [Answer]: tag below)

[Answer]: C 

## Question 9
메뉴 이름 중복 허용 여부는 어떻게 할까요?

A) 같은 카테고리 내에서 중복 불가
B) 전체 매장에서 중복 불가
C) 중복 허용 (동일 이름 메뉴 가능)
D) Other (please describe after [Answer]: tag below)

[Answer]: A 

## Question 10
고객 SetupPage에서 초기 설정 후 자동 로그인 실패 시 재시도 정책은 어떻게 할까요?

A) 즉시 SetupPage로 돌아가 재입력 유도 (에러 메시지 표시)
B) 자동 재시도 1회 후 실패 시 SetupPage로 이동
C) Other (please describe after [Answer]: tag below)

[Answer]: A 
