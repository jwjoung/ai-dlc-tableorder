# Business Logic Model - Unit 0: Foundation

---

## 1. 데이터베이스 초기화 플로우

```
서버 시작
    |
    v
database.js 로드
    |
    v
SQLite 파일 존재? --No--> 파일 생성
    |Yes                     |
    v                        v
PRAGMA 설정 (WAL, foreign_keys)
    |
    v
schema.sql 실행 (CREATE TABLE IF NOT EXISTS)
    |
    v
데이터 존재 확인 (stores 테이블 row count)
    |
    +--0개--> seed.js 실행 (초기 데이터 삽입)
    |
    +--1개 이상--> 스킵
    |
    v
DB 준비 완료, Express 앱에 연결
```

## 2. Express 앱 초기화 플로우

```
server.js 시작
    |
    v
database 초기화
    |
    v
app.js 로드
    |
    v
미들웨어 등록:
  1. cors()
  2. express.json()
  3. 라우트 등록 (auth, menu, order, table, sse)
  4. errorHandler (최하단)
    |
    v
서버 리스닝 (PORT=3000)
```

## 3. 인증 미들웨어 플로우

```
요청 수신
    |
    v
Authorization 헤더 확인
    |
    +--없음--> 401 Unauthorized
    |
    v
"Bearer " 접두사 제거, 토큰 추출
    |
    v
jwt.verify(token, JWT_SECRET)
    |
    +--실패--> 401 Unauthorized (만료 또는 유효하지 않음)
    |
    v
payload에서 role 확인
    |
    +--'admin'--> req.admin = payload, next()
    |
    +--'table'--> req.table = payload, next()
```

## 4. Rate Limiter 플로우

```
로그인 요청 수신
    |
    v
IP 주소 추출 (req.ip)
    |
    v
failedAttempts Map에서 IP 조회
    |
    +--10회 이상 && 15분 미경과--> 429 Too Many Requests
    |
    v
로그인 로직 진행
    |
    +--성공--> failedAttempts에서 IP 제거
    |
    +--실패--> failedAttempts[ip] = { count: +1, lastAttempt: now }
```

## 5. 에러 핸들러 플로우

```
에러 발생 (next(error) 또는 throw)
    |
    v
errorHandler 미들웨어 캐치
    |
    v
statusCode = error.statusCode || 500
    |
    v
응답:
{
  error: {
    message: error.message,
    code: error.code || 'INTERNAL_ERROR'
    ...(개발 환경이면 stack 포함)
  }
}
```
