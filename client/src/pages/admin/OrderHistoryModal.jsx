import { useState, useEffect } from 'react';
import * as tableApi from '../../api/tableApi';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';

function OrderHistoryModal({ isOpen, onClose, tableId, tableNumber }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchHistory = async (filter) => {
    setIsLoading(true);
    try {
      const response = await tableApi.getTableHistory(tableId, filter);
      setHistory(response.data);
    } catch (err) {
      setError(err.message || '내역을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && tableId) {
      fetchHistory({});
    }
  }, [isOpen, tableId]);

  const handleFilter = () => {
    const filter = {};
    if (dateFrom) filter.from = dateFrom;
    if (dateTo) filter.to = dateTo;
    fetchHistory(filter);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`테이블 ${tableNumber} 과거 내역`}>
      <div data-testid="order-history-modal">
        {/* Date Filter */}
        <div className="flex gap-2 mb-4 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">시작일</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm" data-testid="history-date-from" />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">종료일</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm" data-testid="history-date-to" />
          </div>
          <button onClick={handleFilter} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm min-h-[44px]" data-testid="history-filter-btn">조회</button>
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {isLoading ? (
          <div className="flex justify-center py-8"><Loading /></div>
        ) : history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">과거 내역이 없습니다</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map(h => (
              <div key={h.id} className="border rounded-lg p-3" data-testid={`history-card-${h.id}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium">{h.order_number}</p>
                    <p className="text-xs text-gray-500">주문: {new Date(h.ordered_at).toLocaleString('ko-KR')}</p>
                    <p className="text-xs text-gray-400">완료: {new Date(h.completed_at).toLocaleString('ko-KR')}</p>
                  </div>
                  <span className="font-bold text-sm">{h.total_amount.toLocaleString()}원</span>
                </div>
                <div className="space-y-1">
                  {h.items.map(item => (
                    <p key={item.id} className="text-xs text-gray-600">
                      {item.menu_name} × {item.quantity} ({(item.unit_price * item.quantity).toLocaleString()}원)
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default OrderHistoryModal;
