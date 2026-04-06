import { useState } from 'react';
import * as orderApi from '../../api/orderApi';
import * as tableApi from '../../api/tableApi';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

const STATUS_LABELS = { pending: '대기중', preparing: '준비중', completed: '완료' };
const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-700', preparing: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };

function TableDetailModal({ isOpen, onClose, table, onRefresh }) {
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  if (!table) return null;

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      onRefresh();
    } catch (err) {
      setError(err.message || '상태 변경 실패');
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await orderApi.deleteOrder(deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      setError(err.message || '삭제 실패');
    }
  };

  const handleComplete = async () => {
    try {
      await tableApi.completeTable(table.tableId);
      setShowCompleteConfirm(false);
      onClose();
      onRefresh();
    } catch (err) {
      setError(err.message || '이용 완료 처리 실패');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`테이블 ${table.tableNumber} 상세`}>
      <div data-testid="table-detail-modal">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg">총액: {table.totalAmount?.toLocaleString()}원</span>
          <button
            onClick={() => setShowCompleteConfirm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 min-h-[44px]"
            data-testid="table-detail-complete"
          >
            이용 완료
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {(!table.orders || table.orders.length === 0) ? (
            <p className="text-gray-500 text-center py-4">주문이 없습니다</p>
          ) : (
            table.orders.map(order => (
              <div key={order.id} className="border rounded-lg p-3" data-testid={`table-detail-order-${order.id}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium">{order.order_number}</p>
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString('ko-KR')}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div className="space-y-1 mb-2">
                  {order.items?.map(item => (
                    <p key={item.id} className="text-sm text-gray-700">{item.menu_name} × {item.quantity} ({(item.unit_price * item.quantity).toLocaleString()}원)</p>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">{order.total_amount?.toLocaleString()}원</span>
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button onClick={() => handleStatusChange(order.id, 'preparing')} className="text-xs bg-blue-500 text-white px-3 py-1 rounded min-h-[36px]" data-testid={`table-detail-preparing-${order.id}`}>준비 시작</button>
                    )}
                    {order.status === 'preparing' && (
                      <button onClick={() => handleStatusChange(order.id, 'completed')} className="text-xs bg-green-500 text-white px-3 py-1 rounded min-h-[36px]" data-testid={`table-detail-completed-${order.id}`}>완료</button>
                    )}
                    <button onClick={() => setDeleteTarget(order)} className="text-xs text-red-500 hover:text-red-700 px-2 min-h-[36px]" data-testid={`table-detail-delete-${order.id}`}>삭제</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {deleteTarget && (
        <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="주문 삭제 확인">
          <p className="text-gray-700 mb-4">"{deleteTarget.order_number}" 주문을 삭제하시겠습니까?</p>
          <div className="flex gap-2">
            <button onClick={handleDeleteOrder} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg min-h-[44px]" data-testid="order-delete-confirm">삭제</button>
            <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg min-h-[44px]" data-testid="order-delete-cancel">취소</button>
          </div>
        </Modal>
      )}

      {showCompleteConfirm && (
        <Modal isOpen={showCompleteConfirm} onClose={() => setShowCompleteConfirm(false)} title="이용 완료 확인">
          <p className="text-gray-700 mb-4">테이블 {table.tableNumber}의 이용을 완료하시겠습니까? 현재 주문이 과거 내역으로 이동됩니다.</p>
          <div className="flex gap-2">
            <button onClick={handleComplete} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg min-h-[44px]" data-testid="complete-confirm">이용 완료</button>
            <button onClick={() => setShowCompleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg min-h-[44px]" data-testid="complete-cancel">취소</button>
          </div>
        </Modal>
      )}
    </Modal>
  );
}

export default TableDetailModal;
