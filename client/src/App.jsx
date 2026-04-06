import { Routes, Route, Navigate } from 'react-router-dom';

// Admin Pages (Unit 3)
import TableSettingsPage from './pages/admin/TableSettingsPage';

// Unit 1, 2 pages - to be enabled after merge
// import SetupPage from './pages/customer/SetupPage';           // Unit 1
// import MenuPage from './pages/customer/MenuPage';             // Unit 1
// import CartPage from './pages/customer/CartPage';             // Unit 2
// import OrderSuccessPage from './pages/customer/OrderSuccessPage'; // Unit 2
// import OrderHistoryPage from './pages/customer/OrderHistoryPage'; // Unit 2
// import LoginPage from './pages/admin/LoginPage';              // Unit 1
// import DashboardPage from './pages/admin/DashboardPage';      // Unit 2
// import MenuManagementPage from './pages/admin/MenuManagementPage'; // Unit 1

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/tables" replace />} />

        {/* Admin Routes (Unit 3) */}
        <Route path="/admin/tables" element={<TableSettingsPage />} />

        {/* Placeholder for Unit 1, 2 routes */}
        {/* <Route path="/customer/setup" element={<SetupPage />} /> */}
        {/* <Route path="/customer/menu" element={<MenuPage />} /> */}
        {/* <Route path="/customer/cart" element={<CartPage />} /> */}
        {/* <Route path="/customer/order-success" element={<OrderSuccessPage />} /> */}
        {/* <Route path="/customer/orders" element={<OrderHistoryPage />} /> */}
        {/* <Route path="/admin/login" element={<LoginPage />} /> */}
        {/* <Route path="/admin/dashboard" element={<DashboardPage />} /> */}
        {/* <Route path="/admin/menus" element={<MenuManagementPage />} /> */}

        {/* Fallback */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">테이블오더</h1>
              <p className="text-gray-500">Unit 3 (테이블관리) 개발 완료.</p>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
