import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as orderApi from '../../api/orderApi';
import * as sseClient from '../../api/sseClient';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const STATUS_LABELS = {
  pending: '대기중',
  preparing: '준비중',
  completed: '완료',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

function DashboardPage() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedOrders, setHighlightedOrders] = useState(new Set());

  const fetchOrders = useCallback(async () => {
    try {
      const response = await orderApi.getAllOrders();
      setTables(response.data);
    } catch (err) {
      setError(err.message || '데이터를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const handleSSE = (event, data) => {
      if (event === 'new_order') {
        fetchOrders();
        setHighlightedOrders(prev => new Set([...prev, data.orderId]));
        setTimeout(() => {
          setHighlightedOrders(prev => {
            const next = new Set(prev);
            next.delete(data.orderId);
            return next;
          });
        }, 3000);
      } else if (event === 'order_updated') {
        setTables(prev =>
          prev.map(table => ({
            ...table,
            orders: table.orders.map(order =>
              order.id === data.orderId ? { ...order, status: data.status } : order
            ),
          }))
        );
      } else if (event === 'order_deleted') {
        fetchOrders();
      } else if (event === 'table_completed') {
        fetchOrders();
      }
    };

    sseClient.connect(handleSSE);
    return () => sseClient.disconnect();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      setError(err.message || '상태 변경에 실패했습니다');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800" data-testid="dashboard-title">주문 대시보드</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/menus')}
            className="text-sm text-gray-500 hover:text-gray-700 min-h-[44px] px-3"
            data-testid="dashboard-menu-mgmt"
          >
            메뉴관리
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('tokenRole');
              navigate('/admin/login');
            }}
            className="text-sm text-red-500 hover:text-red-700 min-h-[44px] px-3"
            data-testid="dashboard-logout"
          >
            로그아웃
          </button>
        </div>
      </header>

      {error && (
        <div className="px-4 pt-2">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      )}

      {/* Table Grid */}
      <div className="p-4">
        {tables.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">활성 주문이 없습니다</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="dashboard-grid">
            {tables.map(table => (
              <div
                key={table.tableId}
                className="bg-white rounded-lg shadow-sm border overflow-hidden"
                data-testid={`dashboard-table-${table.tableId}`}
              >
                {/* Table Header */}
                <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
                  <span className="font-bold">테이블 {table.tableNumber}</span>
                  <span className="text-sm">{table.totalAmount.toLocaleString()}원</span>
                </div>

                {/* Orders */}
                <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
                  {table.orders.map(order => (
                    <div
                      key={order.id}
                      className={`border rounded-lg p-3 transition-colors duration-300 ${
                        highlightedOrders.has(order.id) ? 'bg-yellow-50 border-yellow-300' : ''
                      }`}
                      data-testid={`dashboard-order-${order.id}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs text-gray-500">{order.order_number}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.created_at).toLocaleTimeString('ko-KR')}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>

                      <div className="space-y-1 mb-2">
                        {order.items.map(item => (
                          <p key={item.id} className="text-sm text-gray-700">
                            {item.menu_name} × {item.quantity}
                          </p>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">{order.total_amount.toLocaleString()}원</span>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'preparing')}
                            className="text-xs bg-blue-500 text-white px-3 py-1 rounded min-h-[36px] hover:bg-blue-600"
                            data-testid={`dashboard-status-preparing-${order.id}`}
                          >
                            준비 시작
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'completed')}
                            className="text-xs bg-green-500 text-white px-3 py-1 rounded min-h-[36px] hover:bg-green-600"
                            data-testid={`dashboard-status-completed-${order.id}`}
                          >
                            완료
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
