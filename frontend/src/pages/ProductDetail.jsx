import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, InputNumber, Spin, message, Rate, Divider, Form, Input, Tag, Tabs, Tooltip } from 'antd';
import {
  ShoppingCartOutlined, ArrowLeftOutlined, StarFilled, HomeOutlined,
  RightOutlined, SafetyCertificateOutlined, CarOutlined, SyncOutlined,
  PhoneOutlined, LaptopOutlined, CheckCircleOutlined, GiftOutlined,
  ThunderboltOutlined, CreditCardOutlined
} from '@ant-design/icons';
import { productAPI, cartAPI, reviewAPI } from '../api';
import { formatVND } from '../utils';
import { useAuth } from '../context/AuthContext';
import { getProductImage } from '../productImages';

// === SPEC GENERATOR: Parse thông số kỹ thuật từ description + tên sản phẩm ===
function generateSpecs(product) {
  const name = (product.name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const combined = name + ' ' + desc;
  const brand = product.brand || '';
  const isLaptop = product.categoryId === 2 || (product.categoryName || '').toLowerCase().includes('laptop');

  const specs = [];

  // --- Screen ---
  const screenMatch = combined.match(/(\d+\.?\d*)\s*(?:inch|")/i);
  if (screenMatch) {
    specs.push({ label: 'Màn hình', value: `${screenMatch[1]} inch`, icon: '📱' });
  } else if (isLaptop) {
    // Default laptop screens
    if (name.includes('macbook air')) specs.push({ label: 'Màn hình', value: '13.6 inch Liquid Retina', icon: '💻' });
    else if (name.includes('macbook pro')) specs.push({ label: 'Màn hình', value: '14.2 inch Liquid Retina XDR', icon: '💻' });
    else specs.push({ label: 'Màn hình', value: '15.6 inch Full HD', icon: '💻' });
  } else {
    if (name.includes('pro max') || name.includes('ultra')) specs.push({ label: 'Màn hình', value: '6.9 inch Dynamic AMOLED', icon: '📱' });
    else if (name.includes('pro')) specs.push({ label: 'Màn hình', value: '6.3 inch OLED', icon: '📱' });
    else specs.push({ label: 'Màn hình', value: '6.5 inch AMOLED', icon: '📱' });
  }

  // --- Screen tech ---
  const screenTech = combined.match(/(super amoled|amoled|oled|ips|lcd|retina|ltpo|dynamic amoled)/i);
  if (screenTech) {
    specs.push({ label: 'Công nghệ màn hình', value: screenTech[1].charAt(0).toUpperCase() + screenTech[1].slice(1), icon: '🖥️' });
  }

  // --- RAM ---
  const ramMatch = combined.match(/ram\s*(\d+)\s*gb/i);
  if (ramMatch) {
    specs.push({ label: 'RAM', value: `${ramMatch[1]} GB`, icon: '🧠' });
  } else {
    if (name.includes('ultra') || name.includes('pro max')) specs.push({ label: 'RAM', value: '12 GB', icon: '🧠' });
    else if (name.includes('macbook')) specs.push({ label: 'RAM', value: '8 GB Unified', icon: '🧠' });
    else if (isLaptop) specs.push({ label: 'RAM', value: '16 GB DDR5', icon: '🧠' });
    else if (name.includes('pro')) specs.push({ label: 'RAM', value: '8 GB', icon: '🧠' });
    else specs.push({ label: 'RAM', value: '6 GB', icon: '🧠' });
  }

  // --- Storage ---
  const storageMatch = combined.match(/(?:rom|ssd|bộ nhớ)\s*(\d+)\s*(gb|tb)/i);
  if (storageMatch) {
    specs.push({ label: isLaptop ? 'Ổ cứng' : 'Bộ nhớ trong', value: `${storageMatch[1]} ${storageMatch[2].toUpperCase()} ${isLaptop ? 'SSD' : ''}`.trim(), icon: '💾' });
  } else {
    if (name.includes('macbook')) specs.push({ label: 'Ổ cứng', value: '256 GB SSD', icon: '💾' });
    else if (isLaptop) specs.push({ label: 'Ổ cứng', value: '512 GB SSD NVMe', icon: '💾' });
    else if (name.includes('ultra') || name.includes('pro max')) specs.push({ label: 'Bộ nhớ trong', value: '256 GB', icon: '💾' });
    else specs.push({ label: 'Bộ nhớ trong', value: '128 GB', icon: '💾' });
  }

  // --- CPU/Chip ---
  const chipMatch = combined.match(/(snapdragon\s*\d+|dimensity\s*\d+|exynos\s*\d+|a\d+\s*bionic|apple\s*m\d+|intel\s*core\s*i\d+|ryzen\s*\d+|helio\s*\w+)/i);
  if (chipMatch) {
    specs.push({ label: isLaptop ? 'Vi xử lý' : 'Chip xử lý', value: chipMatch[1], icon: '⚡' });
  } else {
    if (brand === 'Apple' && isLaptop) specs.push({ label: 'Vi xử lý', value: name.includes('m3') ? 'Apple M3' : name.includes('m2') ? 'Apple M2' : 'Apple M1', icon: '⚡' });
    else if (brand === 'Apple') specs.push({ label: 'Chip xử lý', value: name.includes('16') ? 'Apple A18 Pro' : name.includes('15') ? 'Apple A16 Bionic' : 'Apple A15 Bionic', icon: '⚡' });
    else if (brand === 'Samsung') specs.push({ label: 'Chip xử lý', value: name.includes('ultra') || name.includes('s25') ? 'Snapdragon 8 Elite' : name.includes('s24') ? 'Exynos 2400' : 'MediaTek Dimensity 6300', icon: '⚡' });
    else if (brand === 'Xiaomi') specs.push({ label: 'Chip xử lý', value: 'MediaTek Helio G99-Ultra', icon: '⚡' });
    else if (brand === 'OPPO') specs.push({ label: 'Chip xử lý', value: 'MediaTek Dimensity 6300', icon: '⚡' });
    else if (isLaptop) specs.push({ label: 'Vi xử lý', value: 'Intel Core i5-1335U', icon: '⚡' });
  }

  // --- Battery ---
  const batteryMatch = combined.match(/pin\s*(\d+)\s*mah/i);
  if (batteryMatch) {
    specs.push({ label: 'Pin', value: `${batteryMatch[1]} mAh`, icon: '🔋' });
  } else if (!isLaptop) {
    if (name.includes('ultra') || name.includes('pro max')) specs.push({ label: 'Pin', value: '5000 mAh', icon: '🔋' });
    else if (name.includes('note')) specs.push({ label: 'Pin', value: '5110 mAh', icon: '🔋' });
    else specs.push({ label: 'Pin', value: '5000 mAh', icon: '🔋' });
  } else {
    specs.push({ label: 'Pin', value: 'Lên đến 18 giờ sử dụng', icon: '🔋' });
  }

  // --- Camera ---
  const camMatch = combined.match(/camera\s*(\d+)\s*mp/i) || combined.match(/(\d+)\s*mp/i);
  if (camMatch && !isLaptop) {
    specs.push({ label: 'Camera chính', value: `${camMatch[1]} MP`, icon: '📷' });
  } else if (!isLaptop) {
    if (name.includes('ultra')) specs.push({ label: 'Camera chính', value: '200 MP OIS', icon: '📷' });
    else if (name.includes('pro max')) specs.push({ label: 'Camera chính', value: '48 MP Pro', icon: '📷' });
    else if (name.includes('pro')) specs.push({ label: 'Camera chính', value: '48 MP', icon: '📷' });
    else specs.push({ label: 'Camera chính', value: '50 MP', icon: '📷' });
  }

  // --- OS ---
  if (brand === 'Apple' && isLaptop) specs.push({ label: 'Hệ điều hành', value: 'macOS Sequoia', icon: '🖥️' });
  else if (brand === 'Apple') specs.push({ label: 'Hệ điều hành', value: 'iOS 18', icon: '📲' });
  else if (isLaptop) specs.push({ label: 'Hệ điều hành', value: 'Windows 11 Home', icon: '🖥️' });
  else specs.push({ label: 'Hệ điều hành', value: 'Android 15', icon: '📲' });

  // --- Weight ---
  if (isLaptop) specs.push({ label: 'Trọng lượng', value: name.includes('macbook air') ? '1.24 kg' : '1.8 kg', icon: '⚖️' });

  return specs;
}

// === PRODUCT HIGHLIGHTS: Điểm nổi bật của sản phẩm ===
function getHighlights(product) {
  const name = (product.name || '').toLowerCase();
  const brand = product.brand || '';
  const isLaptop = product.categoryId === 2;

  const highlights = [];

  if (brand === 'Apple') highlights.push('Hệ sinh thái Apple');
  if (name.includes('5g') || brand === 'Samsung' || brand === 'Apple') highlights.push('Hỗ trợ 5G');
  if (name.includes('ultra') || name.includes('pro max')) highlights.push('Flagship cao cấp');
  if (name.includes('pro')) highlights.push('Dòng Pro chuyên nghiệp');
  if (isLaptop) highlights.push('Thiết kế mỏng nhẹ');
  if (brand === 'Samsung' && name.includes('s25')) highlights.push('Galaxy AI');
  if (brand === 'Apple' && name.includes('16')) highlights.push('Apple Intelligence');
  highlights.push('Chính hãng 100%');
  if (product.price >= 20000000) highlights.push('Trả góp 0%');
  highlights.push('Bảo hành 12 tháng');

  return [...new Set(highlights)].slice(0, 6);
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    setLoading(true);
    setQty(1);
    window.scrollTo(0, 0);
    Promise.all([
      productAPI.getById(id),
      reviewAPI.getList(id),
      reviewAPI.getSummary(id),
    ]).then(([pRes, rRes, sRes]) => {
      const prod = pRes.data.data;
      setProduct(prod);
      setReviews(rRes.data.data || []);
      setSummary(sRes.data.data);

      // Fetch related products (same category, exclude current)
      if (prod?.categoryId) {
        productAPI.getAll({ categoryId: prod.categoryId, pageSize: 10 }).then(rpRes => {
          const rpData = rpRes.data.data;
          const rpList = Array.isArray(rpData) ? rpData : (rpData?.data || rpData?.items || []);
          setRelatedProducts(rpList.filter(p => p.id !== prod.id).slice(0, 4));
        }).catch(() => setRelatedProducts([]));
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await cartAPI.add({ productId: parseInt(id), quantity: qty });
      message.success('Đã thêm vào giỏ hàng!');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi thêm giỏ hàng');
    }
    setAdding(false);
  };

  const submitReview = async (values) => {
    try {
      await reviewAPI.create(id, values);
      message.success('Đánh giá thành công!');
      const [rRes, sRes] = await Promise.all([reviewAPI.getList(id), reviewAPI.getSummary(id)]);
      setReviews(rRes.data.data || []);
      setSummary(sRes.data.data);
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi gửi đánh giá');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  if (!product) return <div style={{ textAlign: 'center', padding: 100 }}>Sản phẩm không tồn tại</div>;

  const imgUrl = getProductImage(product);
  const specs = generateSpecs(product);
  const highlights = getHighlights(product);

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length ? Math.round(reviews.filter(r => r.rating === star).length / reviews.length * 100) : 0,
  }));

  return (
    <div className="app-content fade-in">
      {/* === BREADCRUMB === */}
      <nav className="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 14, color: 'var(--gray-500)', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'var(--gray-500)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <HomeOutlined /> Trang chủ
        </Link>
        <RightOutlined style={{ fontSize: 10 }} />
        <Link to="/products" style={{ color: 'var(--gray-500)', textDecoration: 'none' }}>Sản phẩm</Link>
        <RightOutlined style={{ fontSize: 10 }} />
        <Link to={`/products?category=${product.categoryId}`} style={{ color: 'var(--gray-500)', textDecoration: 'none' }}>
          {product.categoryName || (product.categoryId === 2 ? 'Laptop' : 'Điện thoại')}
        </Link>
        <RightOutlined style={{ fontSize: 10 }} />
        <span style={{ color: 'var(--navy)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* === MAIN PRODUCT DETAILS === */}
      <div className="product-detail-grid">
        {/* Image */}
        <div className="product-detail-image">
          {imgUrl ? (
            <img src={imgUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: 100, opacity: 0.3 }}>{product.categoryId === 2 ? '💻' : '📱'}</span>
          )}
        </div>

        {/* Info */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <Tag color="blue" style={{ fontSize: 12, borderRadius: 6, padding: '2px 10px' }}>
              {product.categoryName || (product.categoryId === 2 ? 'Laptop' : 'Điện thoại')}
            </Tag>
            <Tag style={{ fontSize: 12, borderRadius: 6, padding: '2px 10px', color: 'var(--accent)', borderColor: 'var(--accent)', background: 'rgba(59,130,246,0.06)' }}>
              {product.brand}
            </Tag>
            {product.price >= 20000000 && (
              <Tag color="purple" style={{ fontSize: 12, borderRadius: 6, padding: '2px 10px' }}>
                ✨ Premium
              </Tag>
            )}
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--navy)', marginBottom: 8, lineHeight: 1.3 }}>{product.name}</h1>

          {summary && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Rate disabled value={summary.averageRating} allowHalf style={{ fontSize: 16 }} />
              <span style={{ color: 'var(--gray-500)', fontSize: 14 }}>({summary.totalReviews} đánh giá)</span>
              {summary.totalReviews > 0 && (
                <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 14 }}>
                  {summary.averageRating?.toFixed(1)} ⭐
                </span>
              )}
            </div>
          )}

          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--red)', marginBottom: 4 }}>{formatVND(product.price)}</div>
          {product.price >= 10000000 && (
            <div style={{ fontSize: 13, color: 'var(--green)', marginBottom: 16, fontWeight: 500 }}>
              <CreditCardOutlined /> Trả góp chỉ từ {formatVND(Math.round(product.price / 12 / 1000) * 1000)}/tháng
            </div>
          )}

          <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, marginBottom: 20 }}>{product.description}</p>

          {/* === HIGHLIGHTS === */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {highlights.map((h, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '5px 12px', borderRadius: 20,
                background: 'rgba(59,130,246,0.06)', color: 'var(--accent)',
                fontSize: 12, fontWeight: 600, border: '1px solid rgba(59,130,246,0.15)'
              }}>
                <CheckCircleOutlined /> {h}
              </span>
            ))}
          </div>

          {/* === STOCK STATUS === */}
          <div style={{ marginBottom: 20, padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {product.stockQuantity > 0 ? (
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Còn {product.stockQuantity} sản phẩm</span>
            ) : (
              <span style={{ color: 'var(--red)', fontWeight: 600 }}>✕ Hết hàng</span>
            )}
            <span style={{ fontSize: 12, color: 'var(--gray-300)' }}>SKU: TS-{String(product.id).padStart(5, '0')}</span>
          </div>

          {/* === ADD TO CART === */}
          {product.stockQuantity > 0 && !isAdmin && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
              <InputNumber min={1} max={product.stockQuantity} value={qty} onChange={setQty} size="large" style={{ width: 100 }} />
              <Button type="primary" icon={<ShoppingCartOutlined />} size="large" loading={adding} onClick={addToCart}
                style={{ height: 48, paddingInline: 32, borderRadius: 10, fontWeight: 600, background: 'var(--accent)' }}>
                Thêm vào giỏ
              </Button>
            </div>
          )}

          {/* === POLICIES MINI === */}
          <div className="policy-mini-grid">
            <div className="policy-mini-item">
              <SafetyCertificateOutlined style={{ fontSize: 18, color: 'var(--green)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)' }}>Bảo hành chính hãng</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>12 tháng tại TTBH</div>
              </div>
            </div>
            <div className="policy-mini-item">
              <CarOutlined style={{ fontSize: 18, color: 'var(--accent)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)' }}>Giao hàng miễn phí</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Đơn từ 500K nội thành</div>
              </div>
            </div>
            <div className="policy-mini-item">
              <SyncOutlined style={{ fontSize: 18, color: 'var(--gold)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)' }}>Đổi trả 30 ngày</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Miễn phí 1 đổi 1</div>
              </div>
            </div>
            <div className="policy-mini-item">
              <GiftOutlined style={{ fontSize: 18, color: '#8b5cf6' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)' }}>Tích điểm thưởng</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>+{Math.floor(product.price / 100000)} điểm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === TABS: SPECS / REVIEWS === */}
      <div style={{ marginTop: 40 }}>
        <div className="detail-tabs">
          <button
            className={`detail-tab ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            📋 Thông số kỹ thuật
          </button>
          <button
            className={`detail-tab ${activeTab === 'desc' ? 'active' : ''}`}
            onClick={() => setActiveTab('desc')}
          >
            📝 Mô tả chi tiết
          </button>
          <button
            className={`detail-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            ⭐ Đánh giá ({reviews.length})
          </button>
          <button
            className={`detail-tab ${activeTab === 'policy' ? 'active' : ''}`}
            onClick={() => setActiveTab('policy')}
          >
            🛡️ Chính sách
          </button>
        </div>

        {/* --- SPECS TAB --- */}
        {activeTab === 'specs' && (
          <div className="detail-tab-content fade-in">
            <div className="specs-table">
              {specs.map((s, i) => (
                <div key={i} className="specs-row">
                  <div className="specs-label">
                    <span style={{ marginRight: 6 }}>{s.icon}</span>
                    {s.label}
                  </div>
                  <div className="specs-value">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- DESCRIPTION TAB --- */}
        {activeTab === 'desc' && (
          <div className="detail-tab-content fade-in">
            <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 32, boxShadow: 'var(--shadow)' }}>
              <h3 style={{ color: 'var(--navy)', marginBottom: 16, fontSize: 20 }}>
                {product.categoryId === 2 ? '💻' : '📱'} {product.name}
              </h3>
              <p style={{ color: 'var(--gray-500)', lineHeight: 2, fontSize: 15, whiteSpace: 'pre-wrap' }}>
                {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
              </p>
              <Divider />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div style={{ padding: 16, background: 'var(--gray-50)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>🏷️</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>Thương hiệu</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 600, marginTop: 4 }}>{product.brand}</div>
                </div>
                <div style={{ padding: 16, background: 'var(--gray-50)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>📂</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>Danh mục</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 600, marginTop: 4 }}>{product.categoryName || (product.categoryId === 2 ? 'Laptop' : 'Điện thoại')}</div>
                </div>
                <div style={{ padding: 16, background: 'var(--gray-50)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>📅</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>Ngày đăng bán</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 600, marginTop: 4 }}>{new Date(product.createdAt).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- REVIEWS TAB --- */}
        {activeTab === 'reviews' && (
          <div className="detail-tab-content fade-in">
            {/* Rating summary */}
            {summary && reviews.length > 0 && (
              <div className="review-summary-card">
                <div className="review-summary-left">
                  <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--navy)' }}>
                    {summary.averageRating?.toFixed(1)}
                  </div>
                  <Rate disabled value={summary.averageRating} allowHalf style={{ fontSize: 20 }} />
                  <div style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4 }}>
                    {summary.totalReviews} đánh giá
                  </div>
                </div>
                <div className="review-summary-right">
                  {ratingDistribution.map(rd => (
                    <div key={rd.star} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, width: 20, textAlign: 'right' }}>{rd.star}</span>
                      <StarFilled style={{ color: 'var(--gold)', fontSize: 12 }} />
                      <div style={{ flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${rd.percent}%`, height: '100%', background: 'var(--gold)', borderRadius: 4, transition: 'width 0.5s ease' }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--gray-500)', width: 28 }}>{rd.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review form */}
            {user && !isAdmin && (
              <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 24, marginBottom: 24, boxShadow: 'var(--shadow)' }}>
                <h3 style={{ marginBottom: 16, color: 'var(--navy)' }}>✍️ Viết đánh giá</h3>
                <Form onFinish={submitReview} layout="vertical">
                  <Form.Item name="rating" rules={[{ required: true, message: 'Chọn số sao' }, { type: 'number', min: 1, message: 'Chọn ít nhất 1 sao' }]}>
                    <Rate style={{ fontSize: 28 }} />
                  </Form.Item>
                  <Form.Item name="comment">
                    <Input.TextArea rows={3} placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..." style={{ borderRadius: 10 }} />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" style={{ background: 'var(--accent)', borderRadius: 8 }}>Gửi đánh giá</Button>
                </Form>
              </div>
            )}

            {/* Review list */}
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                <p style={{ color: 'var(--gray-500)', fontSize: 15 }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
              </div>
            ) : (
              reviews.map(r => (
                <div key={r.id} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 20, marginBottom: 12, boxShadow: 'var(--shadow)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--navy), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                        {r.userName?.charAt(0)?.toUpperCase()}
                      </div>
                      <strong style={{ color: 'var(--navy)' }}>{r.userName}</strong>
                    </div>
                    <Rate disabled value={r.rating} style={{ fontSize: 14 }} />
                  </div>
                  {r.comment && <p style={{ color: 'var(--gray-500)', margin: '8px 0 0 46px' }}>{r.comment}</p>}
                  <div style={{ fontSize: 12, color: 'var(--gray-300)', marginTop: 4, marginLeft: 46 }}>
                    {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- POLICY TAB --- */}
        {activeTab === 'policy' && (
          <div className="detail-tab-content fade-in">
            <div className="policy-grid">
              <div className="policy-card">
                <div className="policy-card-icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--green)' }}>
                  <SafetyCertificateOutlined style={{ fontSize: 28 }} />
                </div>
                <h3>Bảo hành</h3>
                <ul>
                  <li>Bảo hành chính hãng 12 tháng</li>
                  <li>Bảo hành tại Trung tâm ủy quyền {product.brand}</li>
                  <li>1 đổi 1 trong 30 ngày nếu lỗi phần cứng</li>
                  <li>Hỗ trợ kỹ thuật miễn phí trọn đời</li>
                </ul>
              </div>
              <div className="policy-card">
                <div className="policy-card-icon" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent)' }}>
                  <CarOutlined style={{ fontSize: 28 }} />
                </div>
                <h3>Vận chuyển</h3>
                <ul>
                  <li>Giao hàng nhanh 2h (nội thành TP.HCM)</li>
                  <li>Giao tiêu chuẩn 1–3 ngày toàn quốc</li>
                  <li>Miễn phí giao hàng cho đơn từ 500.000₫</li>
                  <li>Kiểm tra hàng trước khi thanh toán</li>
                </ul>
              </div>
              <div className="policy-card">
                <div className="policy-card-icon" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--gold)' }}>
                  <SyncOutlined style={{ fontSize: 28 }} />
                </div>
                <h3>Đổi trả</h3>
                <ul>
                  <li>Đổi trả miễn phí trong 30 ngày</li>
                  <li>Sản phẩm lỗi được đổi mới 100%</li>
                  <li>Hoàn tiền nếu không có hàng thay thế</li>
                  <li>Không áp dụng cho sản phẩm đã qua sử dụng</li>
                </ul>
              </div>
              <div className="policy-card">
                <div className="policy-card-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                  <ThunderboltOutlined style={{ fontSize: 28 }} />
                </div>
                <h3>Thanh toán</h3>
                <ul>
                  <li>COD – Thanh toán khi nhận hàng</li>
                  <li>Chuyển khoản ngân hàng</li>
                  <li>Trả góp 0% qua thẻ tín dụng</li>
                  <li>Hỗ trợ trả góp qua công ty tài chính</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* === RELATED PRODUCTS === */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 className="section-title" style={{ margin: 0 }}>🔗 Sản phẩm liên quan</h2>
            <Link to={`/products?category=${product.categoryId}`} className="btn-outline" style={{ fontSize: 13, padding: '8px 16px' }}>
              Xem tất cả →
            </Link>
          </div>
          <div className="product-grid">
            {relatedProducts.map(p => {
              const rpImgUrl = getProductImage(p);
              return (
                <Link to={`/products/${p.id}`} key={p.id} className="product-card fade-in" style={{ textDecoration: 'none' }}>
                  <div className="card-img">
                    {rpImgUrl ? <img src={rpImgUrl} alt={p.name} loading="lazy" /> : <span className="card-img-fallback">{p.categoryId === 2 ? '💻' : '📱'}</span>}
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
                    <div className="card-stock">
                      {p.stockQuantity > 0 ? `Còn ${p.stockQuantity}` : <span style={{ color: 'var(--red)' }}>Hết hàng</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
