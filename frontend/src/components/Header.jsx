import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, DashboardOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { cartAPI } from '../api';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user && !isAdmin) {
      cartAPI.get().then(res => {
        if (res.data.success) setCartCount(res.data.data.length);
      }).catch(() => {});
    }
  }, [user, location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="app-header">
      <Link to="/" className="header-logo">
        <div className="logo-icon">T</div>
        TechnoStore
      </Link>
      <nav className="header-nav">
        <Link to="/" className={isActive('/')}><HomeOutlined /> Trang chủ</Link>
        <Link to="/products" className={isActive('/products')}><AppstoreOutlined /> Sản phẩm</Link>
        {user ? (
          <>
            {!isAdmin && (
              <Link to="/cart" className={isActive('/cart')}>
                <Badge count={cartCount} size="small" offset={[4, -4]}>
                  <ShoppingCartOutlined style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18 }} />
                </Badge>
                <span style={{ marginLeft: 4 }}>Giỏ hàng</span>
              </Link>
            )}
            {!isAdmin && <Link to="/orders" className={isActive('/orders')}>Đơn hàng</Link>}
            {isAdmin && <Link to="/admin" className={isActive('/admin')}><DashboardOutlined /> Dashboard</Link>}
            <Link to="/profile" className={isActive('/profile')}><UserOutlined /> {user.fullName}</Link>
            <button onClick={handleLogout}><LogoutOutlined /> Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive('/login')}>Đăng nhập</Link>
            <Link to="/register" className={`btn-primary ${isActive('/register')}`} style={{ padding: '8px 20px', fontSize: 13 }}>
              Đăng ký
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
