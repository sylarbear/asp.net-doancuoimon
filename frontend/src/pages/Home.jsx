import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Spin, Tag, Skeleton } from 'antd';
import { RocketOutlined, SafetyCertificateOutlined, CustomerServiceOutlined, ThunderboltOutlined, LeftOutlined, RightOutlined, FireOutlined, GiftOutlined, StarFilled } from '@ant-design/icons';
import { productAPI, categoryAPI, voucherAPI } from '../api';
import { formatVND } from '../utils';
import { getProductImage } from '../productImages';

// Banner data - quảng cáo sản phẩm nổi bật
const bannerSlides = [
  {
    id: 1,
    productId: 3,
    title: 'Samsung Galaxy S25 Ultra',
    subtitle: 'Flagship đỉnh cao 2026',
    desc: 'Snapdragon 8 Elite • Camera 200MP • Galaxy AI',
    price: 33990000,
    badge: 'MỚI',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accentColor: '#4d8af0',
    image: '/images/products/samsung-galaxy-s25-ultra.jpg',
  },
  {
    id: 2,
    productId: 6,
    title: 'iPhone 16 Pro Max',
    subtitle: 'Apple Intelligence',
    desc: 'Chip A18 Pro • Camera 48MP 5x Zoom • Titanium',
    price: 34490000,
    badge: 'HOT',
    gradient: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d30 50%, #3a3a3d 100%)',
    accentColor: '#a78bfa',
    image: '/images/products/iphone-16-pro-max.jpg',
  },
  {
    id: 3,
    productId: 15,
    title: 'ASUS ROG Strix G16',
    subtitle: 'Gaming Monster',
    desc: 'Core i9-14900HX • RTX 4070 • 240Hz QHD',
    price: 39990000,
    badge: 'GAMING',
    gradient: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #2d1b69 100%)',
    accentColor: '#ff4655',
    image: '/images/products/asus-rog-strix-g16.jpg',
  },
  {
    id: 4,
    productId: 9,
    title: 'Xiaomi 15 Ultra',
    subtitle: 'Camera Leica chuyên nghiệp',
    desc: 'Snapdragon 8 Elite • 16GB RAM • Leica 50MP',
    price: 22990000,
    badge: 'SALE',
    gradient: 'linear-gradient(135deg, #1a0a00 0%, #3d1f00 50%, #ff6900 100%)',
    accentColor: '#ff9f43',
    image: '/images/products/xiaomi-15-ultra.jpg',
  },
  {
    id: 5,
    productId: 18,
    title: 'Dell XPS 16',
    subtitle: 'Ultrabook cao cấp nhất',
    desc: 'Core Ultra 9 • RTX 4070 • OLED 3.2K',
    price: 44990000,
    badge: 'PREMIUM',
    gradient: 'linear-gradient(135deg, #0a192f 0%, #0d2b4a 50%, #007db8 100%)',
    accentColor: '#5bc0f5',
    image: '/images/products/dell-xps-16.jpg',
  },
];

// === BANNER CAROUSEL COMPONENT ===
function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => goTo((current + 1) % bannerSlides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + bannerSlides.length) % bannerSlides.length), [current, goTo]);

  // Auto-slide every 4 seconds
  useEffect(() => {
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  // Pause on hover
  const pauseAuto = () => clearInterval(timerRef.current);
  const resumeAuto = () => { timerRef.current = setInterval(next, 4000); };

  const slide = bannerSlides[current];

  return (
    <section
      className="hero-banner"
      style={{ background: slide.gradient }}
      onMouseEnter={pauseAuto}
      onMouseLeave={resumeAuto}
    >
      {/* Decorative elements */}
      <div className="banner-deco">
        <div className="banner-circle c1" style={{ background: slide.accentColor }} />
        <div className="banner-circle c2" style={{ background: slide.accentColor }} />
        <div className="banner-circle c3" style={{ background: slide.accentColor }} />
      </div>

      <div className="banner-content">
        {/* Left: Text content */}
        <div className="banner-text" key={`text-${current}`}>
          <span className="banner-badge" style={{ background: slide.accentColor }}>
            {slide.badge === 'HOT' && <FireOutlined />}
            {slide.badge === 'SALE' && <GiftOutlined />}
            {slide.badge === 'PREMIUM' && <StarFilled />}
            {' '}{slide.badge}
          </span>
          <h1 className="banner-title">{slide.title}</h1>
          <p className="banner-subtitle">{slide.subtitle}</p>
          <p className="banner-desc">{slide.desc}</p>
          <div className="banner-price">{formatVND(slide.price)}</div>
          <Link to={`/products/${slide.productId}`} className="banner-cta" style={{ borderColor: slide.accentColor, color: slide.accentColor }}>
            Mua ngay →
          </Link>
        </div>

        {/* Right: Product image */}
        <div className="banner-image" key={`img-${current}`}>
          <div className="banner-img-glow" style={{ background: slide.accentColor }} />
          <img src={slide.image} alt={slide.title} />
        </div>
      </div>

      {/* Navigation arrows */}
      <button className="banner-arrow banner-arrow-left" onClick={prev} aria-label="Previous"><LeftOutlined /></button>
      <button className="banner-arrow banner-arrow-right" onClick={next} aria-label="Next"><RightOutlined /></button>

      {/* Dots indicator */}
      <div className="banner-dots">
        {bannerSlides.map((_, i) => (
          <button
            key={i}
            className={`banner-dot ${i === current ? 'active' : ''}`}
            style={i === current ? { background: slide.accentColor } : {}}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ pageSize: 8 }),
      categoryAPI.getAll(),
      voucherAPI.getAvailable().catch(() => ({ data: { data: [] } })),
    ]).then(([prodRes, catRes, voucherRes]) => {
      const pData = prodRes.data.data;
      setProducts(Array.isArray(pData) ? pData : (pData?.data || pData?.items || []));
      setCategories(catRes.data.data || []);
      setVouchers(voucherRes.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Banner Carousel */}
      <BannerCarousel />

      <div className="app-content">
        {/* Vouchers */}
        {vouchers.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 className="section-title">🎫 Ưu đãi đang có</h2>
            <div className="voucher-grid">
              {vouchers.map(v => (
                <div key={v.id} className="voucher-card fade-in">
                  <div className="voucher-discount">Giảm {v.discountType === 'Percent' ? `${v.discountValue}%` : formatVND(v.discountValue)}</div>
                  <div style={{ opacity: 0.7, fontSize: 13, marginTop: 4 }}>{v.description}</div>
                  <div style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>Đơn tối thiểu: {formatVND(v.minOrderAmount)} • Giảm tối đa: {formatVND(v.maxDiscountAmount)}</div>
                  <div className="voucher-code">{v.code}</div>
                  {v.pointsCost && <Tag color="purple" style={{ marginTop: 8 }}>Đổi {v.pointsCost} điểm</Tag>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        <section style={{ marginBottom: 48 }}>
          <div className="feature-grid">
            {[
              { icon: <ThunderboltOutlined />, title: 'Giao hàng nhanh', desc: 'Nhận hàng trong 24h' },
              { icon: <SafetyCertificateOutlined />, title: 'Chính hãng 100%', desc: 'Cam kết sản phẩm chính hãng' },
              { icon: <CustomerServiceOutlined />, title: 'Hỗ trợ 24/7', desc: 'Tư vấn mua hàng miễn phí' },
              { icon: <RocketOutlined />, title: 'Tích điểm đổi quà', desc: 'Mua càng nhiều ưu đãi càng lớn' },
            ].map((f, i) => (
              <div key={i} className="feature-card fade-in">
                <div style={{ fontSize: 32, color: 'var(--accent)', marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <h2 className="section-title" style={{ margin: 0 }}>📱 Sản phẩm nổi bật</h2>
            <Link to="/products" className="btn-outline">Xem tất cả →</Link>
          </div>
          {loading ? (
            <div className="product-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="product-card">
                  <Skeleton.Image active style={{ width: '100%', height: 200 }} />
                  <div style={{ padding: 16 }}>
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="product-grid">
              {products.slice(0, 8).map(p => {
                const imgUrl = getProductImage(p);
                return (
                  <Link to={`/products/${p.id}`} key={p.id} className="product-card fade-in" style={{ textDecoration: 'none' }}>
                    <div className="card-img">
                      {imgUrl ? <img src={imgUrl} alt={p.name} loading="lazy" /> : <span className="card-img-fallback">{p.categoryId === 2 ? '💻' : '📱'}</span>}
                      <div className="card-badges">
                        {p.stockQuantity === 0 && <span className="badge badge-out">Hết hàng</span>}
                        {p.stockQuantity > 0 && p.stockQuantity <= 5 && <span className="badge badge-hot">Sắp hết</span>}
                        {p.price >= 20000000 && <span className="badge badge-premium">Premium</span>}
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="card-brand">{p.brand}</div>
                      <div className="card-name">{p.name}</div>
                      <div className="card-price">{formatVND(p.price)}</div>
                      <div className="card-stock">Còn {p.stockQuantity} sản phẩm</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
