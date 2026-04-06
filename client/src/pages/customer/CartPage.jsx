import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import * as orderApi from '../../api/orderApi';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ErrorMessage from '../../components/ErrorMessage';

function CartPage() {
  const navigate = useNavigate();
  const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleOrder = async () => {
    if (items.length === 0) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const orderItems = items.map(item => ({
        menuId: item.id,
        quantity: item.quantity,
      }));
      const response = await orderApi.createOrder(orderItems);
      clearCart();
      navigate(`/customer/order-success?orderNumber=${response.data.order_number}`);
    } catch (err) {
      setError(err.message || '주문에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-gray-500 text-lg mb-4">장바구니가 비어있습니다</p>
          <Button onClick={() => navigate('/customer/menu')} data-testid="cart-go-menu">
            메뉴 보러가기
          </Button>
        </div>
        <BottomNav navigate={navigate} active="cart" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <h1 className="text-lg font-bold text-gray-800" data-testid="cart-title">장바구니</h1>
      </header>

      {error && (
        <div className="px-4 pt-2">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      )}

      <div className="flex-1 p-4 space-y-3" data-testid="cart-items">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border p-4" data-testid={`cart-item-${item.id}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-800">{item.name}</h3>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 text-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
                data-testid={`cart-remove-${item.id}`}
              >
                ✕
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg min-w-[44px] min-h-[44px]"
                  data-testid={`cart-qty-minus-${item.id}`}
                >
                  -
                </button>
                <span className="font-medium min-w-[2rem] text-center" data-testid={`cart-qty-${item.id}`}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg min-w-[44px] min-h-[44px]"
                  data-testid={`cart-qty-plus-${item.id}`}
                >
                  +
                </button>
              </div>
              <span className="font-bold text-gray-800">
                {(item.price * item.quantity).toLocaleString()}원
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-white border-t p-4 space-y-3">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-sm text-red-500 hover:text-red-700 min-h-[44px]"
            data-testid="cart-clear"
          >
            전체 비우기
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-500">총 금액</p>
            <p className="text-xl font-bold text-blue-600" data-testid="cart-total">
              {totalAmount.toLocaleString()}원
            </p>
          </div>
        </div>
        <Button
          onClick={handleOrder}
          disabled={isSubmitting}
          className="w-full"
          data-testid="cart-order-button"
        >
          {isSubmitting ? '주문 중...' : `주문하기 (${totalAmount.toLocaleString()}원)`}
        </Button>
      </div>

      <BottomNav navigate={navigate} active="cart" />

      {showClearConfirm && (
        <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="장바구니 비우기">
          <p className="text-gray-700 mb-4">장바구니를 비우시겠습니까?</p>
          <div className="flex gap-2">
            <button
              onClick={() => { clearCart(); setShowClearConfirm(false); }}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg min-h-[44px]"
              data-testid="cart-clear-confirm"
            >
              비우기
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg min-h-[44px]"
              data-testid="cart-clear-cancel"
            >
              취소
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function BottomNav({ navigate, active }) {
  return (
    <div className="sticky bottom-0 bg-white border-t flex">
      <button onClick={() => navigate('/customer/menu')} className={`flex-1 py-3 text-center min-h-[48px] ${active === 'menu' ? 'text-blue-600 font-medium' : 'text-gray-500'}`} data-testid="nav-menu">🍽️ 메뉴</button>
      <button onClick={() => navigate('/customer/cart')} className={`flex-1 py-3 text-center min-h-[48px] ${active === 'cart' ? 'text-blue-600 font-medium' : 'text-gray-500'}`} data-testid="nav-cart">🛒 장바구니</button>
      <button onClick={() => navigate('/customer/orders')} className={`flex-1 py-3 text-center min-h-[48px] ${active === 'orders' ? 'text-blue-600 font-medium' : 'text-gray-500'}`} data-testid="nav-orders">📋 주문내역</button>
    </div>
  );
}

export default CartPage;
