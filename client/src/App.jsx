import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Customer Pages (Unit 1)
import SetupPage from './pages/customer/SetupPage';
import MenuPage from './pages/customer/MenuPage';
// import CartPage from './pages/customer/CartPage';               // Unit 2
// import OrderSuccessPage from './pages/customer/OrderSuccessPage'; // Unit 2
// import OrderHistoryPage from './pages/customer/OrderHistoryPage'; // Unit 2

// Admin Pages (Unit 1)
import LoginPage from './pages/admin/LoginPage';
import MenuManagementPage from './pages/admin/MenuManagementPage';
// import DashboardPage from './pages/admin/DashboardPage';         // Unit 2
// import TableSettingsPage from './pages/admin/TableSettingsPage';  // Unit 3

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/customer/setup" replace />} />

          {/* Customer Routes */}
          <Route path="/customer/setup" element={<SetupPage />} />
          <Route path="/customer/menu" element={<MenuPage />} />
          {/* <Route path="/customer/cart" element={<CartPage />} /> */}
          {/* <Route path="/customer/order-success" element={<OrderSuccessPage />} /> */}
          {/* <Route path="/customer/orders" element={<OrderHistoryPage />} /> */}

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/menus" element={<MenuManagementPage />} />
          {/* <Route path="/admin/dashboard" element={<DashboardPage />} /> */}
          {/* <Route path="/admin/tables" element={<TableSettingsPage />} /> */}

          {/* Admin default redirect */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/dashboard" element={<Navigate to="/admin/menus" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/customer/setup" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
