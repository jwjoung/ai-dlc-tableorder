import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Customer Pages (Unit 1)
import SetupPage from './pages/customer/SetupPage';
import MenuPage from './pages/customer/MenuPage';
// Customer Pages (Unit 2)
import CartPage from './pages/customer/CartPage';
import OrderSuccessPage from './pages/customer/OrderSuccessPage';
import OrderHistoryPage from './pages/customer/OrderHistoryPage';

// Admin Pages (Unit 1)
import LoginPage from './pages/admin/LoginPage';
import MenuManagementPage from './pages/admin/MenuManagementPage';
// Admin Pages (Unit 2)
import DashboardPage from './pages/admin/DashboardPage';
// Admin Pages (Unit 3) - to be enabled after unit3 merge
// import TableSettingsPage from './pages/admin/TableSettingsPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/customer/setup" replace />} />

            {/* Customer Routes */}
            <Route path="/customer/setup" element={<SetupPage />} />
            <Route path="/customer/menu" element={<MenuPage />} />
            <Route path="/customer/cart" element={<CartPage />} />
            <Route path="/customer/order-success" element={<OrderSuccessPage />} />
            <Route path="/customer/orders" element={<OrderHistoryPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/menus" element={<MenuManagementPage />} />
            {/* <Route path="/admin/tables" element={<TableSettingsPage />} /> */}

            {/* Admin default redirect */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/customer/setup" replace />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
