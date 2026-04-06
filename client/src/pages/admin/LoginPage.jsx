import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';

function LoginPage() {
  const navigate = useNavigate();
  const { adminLogin, isAuthenticated, role, isLoading: authLoading } = useAuth();

  const [storeId, setStoreId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authLoading, isAuthenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await adminLogin(storeId.trim(), username.trim(), password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6" data-testid="login-title">
          매장 관리자 로그인
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
              data-testid="login-store-id-input"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              사용자명
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="사용자명 입력"
              required
              data-testid="login-username-input"
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
              data-testid="login-password-input"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            data-testid="login-submit-button"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
