import { Routes, Route, Navigate } from 'react-router-dom';

// Customer Pages (Unit 1, 2)
// import SetupPage from './pages/customer/SetupPage';
// import MenuPage from './pages/customer/MenuPage';
// import CartPage from './pages/customer/CartPage';
// import OrderSuccessPage from './pages/customer/OrderSuccessPage';
// import OrderHistoryPage from './pages/customer/OrderHistoryPage';

// Admin Pages (Unit 1, 2, 3)
// import LoginPage from './pages/admin/LoginPage';
// import DashboardPage from './pages/admin/DashboardPage';
// import MenuManagementPage from './pages/admin/MenuManagementPage';
// import TableSettingsPage from './pages/admin/TableSettingsPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/customer/menu" replace />} />

        {/* Customer Routes - to be enabled by Unit 1, 2 */}
        {/* <Route path="/customer/setup" element={<SetupPage />} /> */}
        {/* <Route path="/customer/menu" element={<MenuPage />} /> */}
        {/* <Route path="/customer/cart" element={<CartPage />} /> */}
        {/* <Route path="/customer/order-success" element={<OrderSuccessPage />} /> */}
        {/* <Route path="/customer/orders" element={<OrderHistoryPage />} /> */}

        {/* Admin Routes - to be enabled by Unit 1, 2, 3 */}
        {/* <Route path="/admin/login" element={<LoginPage />} /> */}
        {/* <Route path="/admin/dashboard" element={<DashboardPage />} /> */}
        {/* <Route path="/admin/menus" element={<MenuManagementPage />} /> */}
        {/* <Route path="/admin/tables" element={<TableSettingsPage />} /> */}

        {/* Placeholder */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">테이블오더</h1>
              <p className="text-gray-500">Foundation 준비 완료. Unit 1~3 개발 대기 중.</p>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
