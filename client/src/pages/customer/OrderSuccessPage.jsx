import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/Button';

function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      navigate('/customer/menu', { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(c => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="text-center" data-testid="order-success">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">주문 완료!</h1>
        <p className="text-gray-600 mb-1">주문번호</p>
        <p className="text-xl font-bold text-blue-600 mb-6" data-testid="order-success-number">
          {orderNumber}
        </p>
        <p className="text-gray-500 mb-4" data-testid="order-success-countdown">
          {countdown}초 후 메뉴 화면으로 이동합니다
        </p>
        <Button
          onClick={() => navigate('/customer/menu', { replace: true })}
          data-testid="order-success-go-menu"
        >
          바로 이동
        </Button>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
