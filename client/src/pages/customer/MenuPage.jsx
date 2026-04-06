import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as menuApi from '../../api/menuApi';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

function MenuPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading: authLoading } = useAuth();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await menuApi.getMenus();
      setCategories(response.data);
    } catch (err) {
      setError(err.message || '메뉴를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || role !== 'table') {
      navigate('/customer/setup', { replace: true });
      return;
    }
    fetchMenus();
  }, [authLoading, isAuthenticated, role, navigate, fetchMenus]);

  const filteredMenus = selectedCategory
    ? categories.filter(c => c.id === selectedCategory).flatMap(c => c.menus)
    : categories.flatMap(c => c.menus);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setQuantity(1);
    setIsDetailOpen(true);
  };

  const handleAddToCart = (menu, qty = 1) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(item => item.id === menu.id);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        id: menu.id,
        name: menu.name,
        price: menu.price,
        quantity: qty,
        image_url: menu.image_url,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setIsDetailOpen(false);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Category Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex overflow-x-auto px-2 py-2 gap-2" data-testid="menu-category-tabs">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-[44px] ${
              selectedCategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            data-testid="menu-category-tab-all"
          >
            전체
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-[44px] ${
                selectedCategory === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              data-testid={`menu-category-tab-${cat.id}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 pt-4">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      )}

      {/* Menu Grid */}
      <div className="flex-1 p-4">
        {filteredMenus.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">메뉴가 없습니다</p>
        ) : (
          <div className="grid grid-cols-2 gap-3" data-testid="menu-grid">
            {filteredMenus.map(menu => (
              <div
                key={menu.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden"
                data-testid={`menu-card-${menu.id}`}
              >
                <div
                  onClick={() => handleMenuClick(menu)}
                  className="cursor-pointer"
                >
                  {menu.image_url ? (
                    <img
                      src={menu.image_url}
                      alt={menu.name}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-3xl">🍽️</span>
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 text-sm truncate">{menu.name}</h3>
                    <p className="text-blue-600 font-bold text-sm mt-1">
                      {menu.price.toLocaleString()}원
                    </p>
                  </div>
                </div>
                <div className="px-3 pb-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(menu, 1);
                    }}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium min-h-[44px] hover:bg-blue-600 active:bg-blue-700"
                    data-testid={`menu-add-to-cart-${menu.id}`}
                  >
                    + 담기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-white border-t flex" data-testid="menu-bottom-nav">
        <button
          className="flex-1 py-3 text-center text-blue-600 font-medium min-h-[48px]"
          data-testid="nav-menu"
        >
          🍽️ 메뉴
        </button>
        <button
          onClick={() => navigate('/customer/cart')}
          className="flex-1 py-3 text-center text-gray-500 min-h-[48px]"
          data-testid="nav-cart"
        >
          🛒 장바구니
        </button>
        <button
          onClick={() => navigate('/customer/orders')}
          className="flex-1 py-3 text-center text-gray-500 min-h-[48px]"
          data-testid="nav-orders"
        >
          📋 주문내역
        </button>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedMenu && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedMenu.name}
        >
          <div data-testid="menu-detail-modal">
            {selectedMenu.image_url ? (
              <img
                src={selectedMenu.image_url}
                alt={selectedMenu.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gray-400 text-5xl">🍽️</span>
              </div>
            )}
            <p className="text-2xl font-bold text-blue-600 mb-2">
              {selectedMenu.price.toLocaleString()}원
            </p>
            {selectedMenu.description && (
              <p className="text-gray-600 mb-4">{selectedMenu.description}</p>
            )}

            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold"
                data-testid="menu-detail-qty-minus"
              >
                -
              </button>
              <span className="text-xl font-bold min-w-[2rem] text-center" data-testid="menu-detail-qty">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold"
                data-testid="menu-detail-qty-plus"
              >
                +
              </button>
            </div>

            <Button
              onClick={() => handleAddToCart(selectedMenu, quantity)}
              className="w-full"
              data-testid="menu-detail-add-to-cart"
            >
              장바구니 추가 ({(selectedMenu.price * quantity).toLocaleString()}원)
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default MenuPage;
