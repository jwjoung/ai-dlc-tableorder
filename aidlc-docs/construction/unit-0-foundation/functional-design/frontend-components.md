# Frontend Components - Unit 0: Foundation

---

## 1. 공통 UI 컴포넌트

### Button
```
Props:
  - children: ReactNode (버튼 텍스트/아이콘)
  - onClick: () => void
  - variant: 'primary' | 'secondary' | 'danger' (기본: 'primary')
  - size: 'sm' | 'md' | 'lg' (기본: 'md')
  - disabled: boolean (기본: false)
  - loading: boolean (기본: false, true면 스피너 표시)
  - type: 'button' | 'submit' (기본: 'button')
  - className: string (추가 Tailwind 클래스)

스타일:
  - primary: bg-blue-600 text-white hover:bg-blue-700
  - secondary: bg-gray-200 text-gray-800 hover:bg-gray-300
  - danger: bg-red-600 text-white hover:bg-red-700
  - 최소 높이: 44px (터치 친화적)
  - disabled: opacity-50, cursor-not-allowed
```

### Modal
```
Props:
  - isOpen: boolean
  - onClose: () => void
  - title: string
  - children: ReactNode (모달 본문)
  - footer: ReactNode (모달 하단 버튼 영역, optional)

동작:
  - isOpen=true: 오버레이 + 중앙 모달 표시
  - 오버레이 클릭: onClose 호출
  - ESC 키: onClose 호출
  - 본문 스크롤: 모달 내부만 스크롤, 배경 스크롤 방지
```

### Loading
```
Props:
  - size: 'sm' | 'md' | 'lg' (기본: 'md')
  - text: string (optional, 기본: '')

표시:
  - 회전 스피너 아이콘 + text
  - 전체 화면 모드: 페이지 중앙에 표시 (API 로딩 시)
```

### ErrorMessage
```
Props:
  - message: string
  - onClose: () => void (optional)

표시:
  - 빨간색 배경, 흰색 텍스트
  - onClose 제공 시 X 버튼 표시
  - 기본 3초 후 자동 사라짐
```

### Card
```
Props:
  - children: ReactNode
  - onClick: () => void (optional)
  - className: string (추가 Tailwind 클래스)

스타일:
  - bg-white, rounded-lg, shadow-md, p-4
  - onClick 제공 시: hover:shadow-lg, cursor-pointer
```

---

## 2. API 클라이언트 (apiClient.js)

```
설정:
  - baseURL: '/api' (Vite proxy 통해 백엔드로 전달)
  - timeout: 10000ms
  - Content-Type: application/json

인터셉터:
  - Request: localStorage에서 토큰 읽어 Authorization 헤더 추가
  - Response 성공: response.data 반환
  - Response 에러:
    - 401: localStorage 토큰 제거, 로그인 페이지로 이동
    - 그 외: error.response.data.error.message 추출하여 throw

Export:
  - get(url, params)
  - post(url, data)
  - put(url, data)
  - del(url)
```

---

## 3. 라우팅 구조 (App.jsx)

```
Routes:
  /                          -> Redirect to /customer/menu
  /customer/setup            -> SetupPage       [Unit 1]
  /customer/menu             -> MenuPage        [Unit 1]
  /customer/cart             -> CartPage         [Unit 2]
  /customer/order-success    -> OrderSuccessPage [Unit 2]
  /customer/orders           -> OrderHistoryPage [Unit 2]
  /admin/login               -> LoginPage        [Unit 1]
  /admin/dashboard           -> DashboardPage    [Unit 2+3]
  /admin/menus               -> MenuManagementPage [Unit 1]
  /admin/tables              -> TableSettingsPage [Unit 3]

인증 보호:
  /customer/* (setup 제외): tableAuthMiddleware (테이블 로그인 필요)
  /admin/* (login 제외): authMiddleware (관리자 로그인 필요)
```

---

## 4. Vite 설정

```
vite.config.js:
  - server.proxy: { '/api': 'http://localhost:3000' }
  - React plugin
  - 포트: 5173 (기본)

tailwind.config.js:
  - content: ['./src/**/*.{js,jsx}']
  - 기본 테마 확장 없음 (기본 색상 사용)

postcss.config.js:
  - tailwindcss, autoprefixer
```
