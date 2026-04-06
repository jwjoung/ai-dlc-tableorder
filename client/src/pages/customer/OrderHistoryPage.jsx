import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as orderApi from '../../api/orderApi';
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

function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi.getMyOrders();
        setOrders(response.data);
      } catch (err) {
        setError(err.message || '주문 내역을 불러오는데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <h1 className="text-lg font-bold text-gray-800" data-testid="order-history-title">주문 내역</h1>
      </header>

      {error && (
        <div className="px-4 pt-2">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      )}

      <div className="flex-1 p-4 space-y-3" data-testid="order-history-list">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">주문 내역이 없습니다</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border p-4" data-testid={`order-card-${order.id}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-800">{order.order_number}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleString('ko-KR')}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status] || ''}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              <div className="space-y-1 mb-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.menu_name} × {item.quantity}
                    </span>
                    <span className="text-gray-600">
                      {(item.unit_price * item.quantity).toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 flex justify-between">
                <span className="text-sm font-medium text-gray-700">합계</span>
                <span className="font-bold text-blue-600">
                  {order.total_amount.toLocaleString()}원
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-white border-t flex">
        <button onClick={() => navigate('/customer/menu')} className="flex-1 py-3 text-center text-gray-500 min-h-[48px]" data-testid="nav-menu">🍽️ 메뉴</button>
        <button onClick={() => navigate('/customer/cart')} className="flex-1 py-3 text-center text-gray-500 min-h-[48px]" data-testid="nav-cart">🛒 장바구니</button>
        <button className="flex-1 py-3 text-center text-blue-600 font-medium min-h-[48px]" data-testid="nav-orders">📋 주문내역</button>
      </div>
    </div>
  );
}

export default OrderHistoryPage;
