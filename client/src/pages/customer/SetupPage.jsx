import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';

function SetupPage() {
  const navigate = useNavigate();
  const { tableLogin, isAuthenticated, role, isLoading: authLoading } = useAuth();

  const [storeId, setStoreId] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoLogin, setIsAutoLogin] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated && role === 'table') {
      navigate('/customer/menu', { replace: true });
      return;
    }

    const savedStore = localStorage.getItem('storeId');
    const savedTable = localStorage.getItem('tableNumber');
    const savedPassword = localStorage.getItem('tablePassword');

    if (savedStore && savedTable && savedPassword) {
      setStoreId(savedStore);
      setTableNumber(savedTable);
      setPassword(savedPassword);

      (async () => {
        try {
          await tableLogin(savedStore, Number(savedTable), savedPassword);
          navigate('/customer/menu', { replace: true });
        } catch (err) {
          setError(err.message || '자동 로그인에 실패했습니다');
          setIsAutoLogin(false);
        }
      })();
    } else {
      setIsAutoLogin(false);
    }
  }, [authLoading, isAuthenticated, role, navigate, tableLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await tableLogin(storeId.trim(), Number(tableNumber), password);
      navigate('/customer/menu', { replace: true });
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isAutoLogin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6" data-testid="setup-title">
          테이블 설정
        </h1>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-1">
              매장 식별자
            </label>
            <input
              id="storeId"
              type="text"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="매장 식별자 입력"
              required
              data-testid="setup-store-id-input"
            />
          </div>

          <div>
            <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">
              테이블 번호
            </label>
            <input
              id="tableNumber"
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="테이블 번호 입력"
              required
              min="1"
              data-testid="setup-table-number-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호 입력"
              required
              data-testid="setup-password-input"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            data-testid="setup-submit-button"
          >
            {isSubmitting ? '설정 중...' : '설정 완료'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SetupPage;
