import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
}

function AppContent() {
  return (
    <div className="app-layout">
      <Header />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
      <footer className="app-footer">
        <div className="footer-grid">
          <div>
            <h4>🏪 TechnoStore</h4>
            <p>Hệ thống bán lẻ điện thoại, laptop chính hãng. Cam kết giá tốt, sản phẩm chất lượng.</p>
            <p>📍 123 Nguyễn Văn Linh, TP.HCM</p>
            <p>📞 1900 1234</p>
          </div>
          <div>
            <h4>Hỗ trợ khách hàng</h4>
            <p>Chính sách đổi trả 30 ngày</p>
            <p>Bảo hành chính hãng 12 tháng</p>
            <p>Giao hàng toàn quốc</p>
            <p>Hỗ trợ trả góp 0%</p>
          </div>
          <div>
            <h4>Thanh toán & Vận chuyển</h4>
            <div className="footer-payments">
              <span>💵 COD</span>
              <span>🏦 Chuyển khoản</span>
              <span>💳 VISA/Master</span>
            </div>
            <p style={{marginTop: 12}}>🚚 Giao hàng nhanh 2h (nội thành)</p>
            <p>📦 Giao tiêu chuẩn 1-3 ngày</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 TechnoStore. Tất cả quyền được bảo lưu. | GVHD: ThS. Nguyễn Văn A</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider locale={viVN} theme={{
      token: {
        colorPrimary: '#3b82f6',
        borderRadius: 10,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }
    }}>
      <AntApp>
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}
