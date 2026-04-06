import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as menuApi from '../../api/menuApi';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

function MenuManagementPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading: authLoading, logout } = useAuth();

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Menu form
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [menuForm, setMenuForm] = useState({ name: '', price: '', description: '', image_url: '', category_id: '' });

  // Category form
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [menuRes, catRes] = await Promise.all([
        menuApi.getMenus(),
        menuApi.getCategories(),
      ]);
      setCategories(catRes.data);

      const allMenus = menuRes.data.flatMap(c => c.menus);
      setMenus(allMenus);

      if (!selectedCategoryId && catRes.data.length > 0) {
        setSelectedCategoryId(catRes.data[0].id);
      }
    } catch (err) {
      setError(err.message || '데이터를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || role !== 'admin') {
      navigate('/admin/login', { replace: true });
      return;
    }
    fetchData();
  }, [authLoading, isAuthenticated, role, navigate, fetchData]);

  const filteredMenus = menus.filter(m => m.category_id === selectedCategoryId);

  // --- Menu CRUD ---

  const openMenuForm = (menu = null) => {
    if (menu) {
      setEditingMenu(menu);
      setMenuForm({
        name: menu.name,
        price: String(menu.price),
        description: menu.description || '',
        image_url: menu.image_url || '',
        category_id: String(menu.category_id),
      });
    } else {
      setEditingMenu(null);
      setMenuForm({
        name: '',
        price: '',
        description: '',
        image_url: '',
        category_id: selectedCategoryId ? String(selectedCategoryId) : '',
      });
    }
    setIsMenuFormOpen(true);
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = {
      name: menuForm.name,
      price: Number(menuForm.price),
      description: menuForm.description,
      image_url: menuForm.image_url,
      category_id: Number(menuForm.category_id),
    };

    try {
      if (editingMenu) {
        await menuApi.updateMenu(editingMenu.id, data);
        showSuccess('메뉴가 수정되었습니다');
      } else {
        await menuApi.createMenu(data);
        showSuccess('메뉴가 등록되었습니다');
      }
      setIsMenuFormOpen(false);
      await fetchData();
    } catch (err) {
      setError(err.message || '저장에 실패했습니다');
    }
  };

  const handleMenuDelete = async () => {
    try {
      await menuApi.deleteMenu(deleteTarget.id);
      showSuccess('메뉴가 삭제되었습니다');
      setDeleteTarget(null);
      setDeleteType(null);
      await fetchData();
    } catch (err) {
      setError(err.message || '삭제에 실패했습니다');
    }
  };

  const handleMenuOrder = async (id, direction) => {
    try {
      await menuApi.updateMenuOrder(id, direction);
      await fetchData();
    } catch (err) {
      setError(err.message || '순서 변경에 실패했습니다');
    }
  };

  // --- Category CRUD ---

  const openCategoryForm = (cat = null) => {
    setEditingCategory(cat);
    setCategoryName(cat ? cat.name : '');
    setIsCategoryFormOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingCategory) {
        await menuApi.updateCategory(editingCategory.id, { name: categoryName });
        showSuccess('카테고리가 수정되었습니다');
      } else {
        await menuApi.createCategory({ name: categoryName });
        showSuccess('카테고리가 추가되었습니다');
      }
      setIsCategoryFormOpen(false);
      await fetchData();
    } catch (err) {
      setError(err.message || '저장에 실패했습니다');
    }
  };

  const handleCategoryDelete = async () => {
    try {
      await menuApi.deleteCategory(deleteTarget.id);
      showSuccess('카테고리가 삭제되었습니다');
      setDeleteTarget(null);
      setDeleteType(null);
      if (selectedCategoryId === deleteTarget.id) {
        setSelectedCategoryId(categories.length > 1 ? categories.find(c => c.id !== deleteTarget.id)?.id : null);
      }
      await fetchData();
    } catch (err) {
      setError(err.message || '삭제에 실패했습니다');
    }
  };

  if (authLoading || isLoading) {
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
        <h1 className="text-lg font-bold text-gray-800" data-testid="menu-mgmt-title">메뉴 관리</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-700 min-h-[44px] px-3"
            data-testid="menu-mgmt-back"
          >
            대시보드
          </button>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-700 min-h-[44px] px-3"
            data-testid="menu-mgmt-logout"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="px-4 pt-2">
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg mb-2 text-sm">
            {successMsg}
          </div>
        )}
      </div>

      <div className="flex min-h-[calc(100vh-60px)]">
        {/* Sidebar - Categories */}
        <aside className="w-56 bg-white border-r p-4 flex-shrink-0" data-testid="menu-mgmt-sidebar">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-gray-700 text-sm">카테고리</h2>
            <button
              onClick={() => openCategoryForm()}
              className="text-blue-500 text-sm hover:text-blue-700 min-h-[44px] px-2"
              data-testid="menu-mgmt-add-category"
            >
              + 추가
            </button>
          </div>

          <ul className="space-y-1">
            {categories.map(cat => (
              <li key={cat.id}>
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer min-h-[44px] ${
                    selectedCategoryId === cat.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  data-testid={`menu-mgmt-category-${cat.id}`}
                >
                  <span className="text-sm truncate flex-1">{cat.name}</span>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openCategoryForm(cat); }}
                      className="text-gray-400 hover:text-blue-500 text-xs p-1"
                      data-testid={`menu-mgmt-edit-category-${cat.id}`}
                    >
                      수정
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(cat); setDeleteType('category'); }}
                      className="text-gray-400 hover:text-red-500 text-xs p-1"
                      data-testid={`menu-mgmt-delete-category-${cat.id}`}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main - Menu List */}
        <main className="flex-1 p-4" data-testid="menu-mgmt-main">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-700">
              {categories.find(c => c.id === selectedCategoryId)?.name || '카테고리 선택'}
            </h2>
            <Button
              onClick={() => openMenuForm()}
              data-testid="menu-mgmt-add-menu"
            >
              + 메뉴 추가
            </Button>
          </div>

          {filteredMenus.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">메뉴가 없습니다</p>
          ) : (
            <table className="w-full bg-white rounded-lg shadow-sm border" data-testid="menu-mgmt-table">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">메뉴명</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">가격</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">순서</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredMenus.map((menu, index) => (
                  <tr key={menu.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{menu.name}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-800">
                      {menu.price.toLocaleString()}원
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        menu.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {menu.is_available ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleMenuOrder(menu.id, 'up')}
                          disabled={index === 0}
                          className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-sm"
                          data-testid={`menu-mgmt-order-up-${menu.id}`}
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMenuOrder(menu.id, 'down')}
                          disabled={index === filteredMenus.length - 1}
                          className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-sm"
                          data-testid={`menu-mgmt-order-down-${menu.id}`}
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openMenuForm(menu)}
                          className="text-blue-500 hover:text-blue-700 text-sm min-h-[44px] px-2"
                          data-testid={`menu-mgmt-edit-menu-${menu.id}`}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => { setDeleteTarget(menu); setDeleteType('menu'); }}
                          className="text-red-500 hover:text-red-700 text-sm min-h-[44px] px-2"
                          data-testid={`menu-mgmt-delete-menu-${menu.id}`}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>

      {/* Menu Form Modal */}
      {isMenuFormOpen && (
        <Modal
          isOpen={isMenuFormOpen}
          onClose={() => setIsMenuFormOpen(false)}
          title={editingMenu ? '메뉴 수정' : '메뉴 추가'}
        >
          <form onSubmit={handleMenuSubmit} className="space-y-4" data-testid="menu-form">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">메뉴명 *</label>
              <input
                type="text"
                value={menuForm.name}
                onChange={(e) => setMenuForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                maxLength={100}
                data-testid="menu-form-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가격 (원) *</label>
              <input
                type="number"
                value={menuForm.price}
                onChange={(e) => setMenuForm(f => ({ ...f, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                data-testid="menu-form-price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
              <select
                value={menuForm.category_id}
                onChange={(e) => setMenuForm(f => ({ ...f, category_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                data-testid="menu-form-category"
              >
                <option value="">카테고리 선택</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <textarea
                value={menuForm.description}
                onChange={(e) => setMenuForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={500}
                data-testid="menu-form-description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL</label>
              <input
                type="text"
                value={menuForm.image_url}
                onChange={(e) => setMenuForm(f => ({ ...f, image_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="menu-form-image-url"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" data-testid="menu-form-submit">
                {editingMenu ? '수정' : '등록'}
              </Button>
              <button
                type="button"
                onClick={() => setIsMenuFormOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 min-h-[44px]"
                data-testid="menu-form-cancel"
              >
                취소
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Category Form Modal */}
      {isCategoryFormOpen && (
        <Modal
          isOpen={isCategoryFormOpen}
          onClose={() => setIsCategoryFormOpen(false)}
          title={editingCategory ? '카테고리 수정' : '카테고리 추가'}
        >
          <form onSubmit={handleCategorySubmit} className="space-y-4" data-testid="category-form">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리명 *</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                maxLength={50}
                data-testid="category-form-name"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" data-testid="category-form-submit">
                {editingCategory ? '수정' : '추가'}
              </Button>
              <button
                type="button"
                onClick={() => setIsCategoryFormOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 min-h-[44px]"
                data-testid="category-form-cancel"
              >
                취소
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => { setDeleteTarget(null); setDeleteType(null); }}
          title="삭제 확인"
        >
          <div data-testid="delete-confirm-modal">
            <p className="text-gray-700 mb-4">
              {deleteType === 'menu'
                ? `"${deleteTarget.name}" 메뉴를 삭제하시겠습니까?`
                : `"${deleteTarget.name}" 카테고리를 삭제하시겠습니까?`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={deleteType === 'menu' ? handleMenuDelete : handleCategoryDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 min-h-[44px]"
                data-testid="delete-confirm-button"
              >
                삭제
              </button>
              <button
                onClick={() => { setDeleteTarget(null); setDeleteType(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 min-h-[44px]"
                data-testid="delete-cancel-button"
              >
                취소
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default MenuManagementPage;
