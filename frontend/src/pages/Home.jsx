import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spin, Tag } from 'antd';
import { RocketOutlined, SafetyCertificateOutlined, CustomerServiceOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { productAPI, categoryAPI, voucherAPI } from '../api';
import { formatVND } from '../utils';

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
      {/* Hero */}
      <section className="hero">
        <h1 className="fade-in">Công nghệ <span>đỉnh cao</span><br />Giá cả tốt nhất</h1>
        <p className="fade-in">Mua sắm điện thoại, laptop chính hãng với ưu đãi hấp dẫn. Tích điểm đổi voucher giảm đến 35%!</p>
        <Link to="/products" className="btn-primary" style={{ fontSize: 17, padding: '14px 36px' }}>
          <RocketOutlined /> Khám phá ngay
        </Link>
      </section>

      <div className="app-content">
        {/* Vouchers */}
        {vouchers.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 className="section-title">🎫 Ưu đãi đang có</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {vouchers.map(v => (
                <div key={v.id} className="voucher-card fade-in">
                  <div className="voucher-discount">Giảm {v.discountValue}%</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { icon: <ThunderboltOutlined />, title: 'Giao hàng nhanh', desc: 'Nhận hàng trong 24h' },
              { icon: <SafetyCertificateOutlined />, title: 'Chính hãng 100%', desc: 'Cam kết sản phẩm chính hãng' },
              { icon: <CustomerServiceOutlined />, title: 'Hỗ trợ 24/7', desc: 'Tư vấn mua hàng miễn phí' },
              { icon: <RocketOutlined />, title: 'Tích điểm đổi quà', desc: 'Mua càng nhiều ưu đãi càng lớn' },
            ].map((f, i) => (
              <div key={i} className="fade-in" style={{
                background: 'white', borderRadius: 'var(--radius)', padding: 24,
                textAlign: 'center', boxShadow: 'var(--shadow)', border: '1px solid var(--gray-200)'
              }}>
                <div style={{ fontSize: 32, color: 'var(--accent)', marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 className="section-title" style={{ margin: 0 }}>📱 Sản phẩm nổi bật</h2>
            <Link to="/products" className="btn-outline">Xem tất cả →</Link>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
          ) : (
            <div className="product-grid">
              {products.slice(0, 8).map(p => (
                <Link to={`/products/${p.id}`} key={p.id} className="product-card fade-in" style={{ textDecoration: 'none' }}>
                  <div className="card-img">
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} /> : '📦'}
                  </div>
                  <div className="card-body">
                    <div className="card-brand">{p.brand}</div>
                    <div className="card-name">{p.name}</div>
                    <div className="card-price">{formatVND(p.price)}</div>
                    <div className="card-stock">Còn {p.stockQuantity} sản phẩm</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
