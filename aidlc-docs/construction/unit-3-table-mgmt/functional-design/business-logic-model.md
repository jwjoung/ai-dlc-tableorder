# Unit 3: 테이블관리 - Business Logic Model

---

## 1. 테이블 목록 조회 (tableService.getAllTables)
```
Input: storeId
1. tableRepository.getAllTables(storeId)
2. 각 테이블에 활성 세션 정보 포함
3. 반환: Table[]
```

## 2. 테이블 등록 (tableService.createTable)
```
Input: storeId, { tableNumber, password }
1. 테이블 번호 중복 확인
2. bcrypt.hashSync(password)
3. tableRepository.createTable(storeId, tableNumber, hash)
4. 초기 세션 생성: sessionRepository.createSession(tableId)
5. 반환: 생성된 테이블
```

## 3. 테이블 수정 (tableService.updateTable)
```
Input: tableId, { tableNumber, password }
1. 테이블 존재 확인
2. 번호 변경 시 중복 확인
3. 비밀번호 변경 시 bcrypt.hashSync
4. tableRepository.updateTable
5. 반환: 수정된 테이블
```

## 4. 이용 완료 (tableService.completeTable)
```
Input: tableId
1. 테이블 존재 확인
2. 활성 세션 확인 → 없으면 400
3. 세션의 주문+항목 조회
4. 트랜잭션:
   - 각 주문 → order_history로 복사
   - 각 주문항목 → order_history_items로 복사
   - 현재 주문 삭제 (CASCADE)
   - 세션 종료 (ended_at, is_active=0)
5. SSE 브로드캐스트: table_completed
6. 반환: void
```

## 5. 과거 내역 조회 (tableService.getTableHistory)
```
Input: tableId, dateFilter (optional: { from, to })
1. orderHistoryRepository.getHistory(tableId, dateFilter)
2. 각 이력에 항목 포함
3. 시간 역순 정렬
4. 반환: OrderHistory[]
```
