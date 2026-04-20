import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, DashboardOutlined, HomeOutlined, AppstoreOutlined, MenuOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const fetchCart = useCallback(() => {
    if (user && !isAdmin) {
      cartAPI.get().then(res => {
        const d = res.data.data;
        setCartCount(d?.totalItems || d?.items?.length || (Array.isArray(d) ? d.length : 0));
      }).catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  }, [user, isAdmin]);

  // Fetch on mount & page change
  useEffect(() => {
    fetchCart();
  }, [fetchCart, location.pathname]);

  // Listen for cart-updated events (from ProductDetail, Cart pages)
  useEffect(() => {
    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [fetchCart]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => { logout(); setCartCount(0); navigate('/'); };
  const isActive = (path) => location.pathname === path ? 'active' : '';
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="app-header">
        <Link to="/" className="header-logo">
          <div className="logo-icon">T</div>
          TechnoStore
        </Link>

        {/* Search bar */}
        <div className="header-search">
          <SearchOutlined className="header-search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={headerSearch}
            onChange={e => setHeaderSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && headerSearch.trim()) {
                navigate(`/products?search=${encodeURIComponent(headerSearch.trim())}`);
                setHeaderSearch('');
                setMobileOpen(false);
              }
            }}
          />
        </div>

        {/* Mobile hamburger */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileOpen(!mobileOpen)} 
          aria-label="Menu"
          type="button"
        >
          {mobileOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>

        <nav className={`header-nav ${mobileOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={closeMobile}><HomeOutlined /> Trang chủ</Link>
          <Link to="/products" className={isActive('/products')} onClick={closeMobile}><AppstoreOutlined /> Sản phẩm</Link>
          {user ? (
            <>
              {!isAdmin && (
                <Link to="/cart" className={isActive('/cart')} onClick={closeMobile}>
                  <Badge count={cartCount} size="small" offset={[4, -4]}>
                    <ShoppingCartOutlined style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18 }} />
                  </Badge>
                  <span style={{ marginLeft: 4 }}>Giỏ hàng</span>
                </Link>
              )}
              {!isAdmin && <Link to="/orders" className={isActive('/orders')} onClick={closeMobile}>Đơn hàng</Link>}
              {isAdmin && <Link to="/admin" className={isActive('/admin')} onClick={closeMobile}><DashboardOutlined /> Dashboard</Link>}
              <Link to="/profile" className={isActive('/profile')} onClick={closeMobile}><UserOutlined /> {user.fullName}</Link>
              <button type="button" onClick={() => { handleLogout(); closeMobile(); }}><LogoutOutlined /> Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')} onClick={closeMobile}>Đăng nhập</Link>
              <Link to="/register" className={`btn-primary ${isActive('/register')}`} style={{ padding: '8px 20px', fontSize: 13 }} onClick={closeMobile}>
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Mobile overlay - OUTSIDE header to avoid stacking context issues */}
      {mobileOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
