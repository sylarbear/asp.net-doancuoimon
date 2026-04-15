import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, InputNumber, Spin, message, Rate, Divider, Form, Input } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined, StarFilled } from '@ant-design/icons';
import { productAPI, cartAPI, reviewAPI } from '../api';
import { formatVND } from '../utils';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productAPI.getById(id),
      reviewAPI.getList(id),
      reviewAPI.getSummary(id),
    ]).then(([pRes, rRes, sRes]) => {
      setProduct(pRes.data.data);
      setReviews(rRes.data.data || []);
      setSummary(sRes.data.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await cartAPI.add({ productId: parseInt(id), quantity: qty });
      message.success('Đã thêm vào giỏ hàng!');
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

  return (
    <div className="app-content fade-in">
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>Quay lại</Button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, background: 'white', borderRadius: 'var(--radius)', padding: 32, boxShadow: 'var(--shadow)' }}>
        {/* Image */}
        <div style={{ background: 'var(--gray-100)', borderRadius: 12, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, color: 'var(--accent)' }}>
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : '📦'}
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{product.brand}</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--navy)', marginBottom: 8, lineHeight: 1.3 }}>{product.name}</h1>

          {summary && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Rate disabled value={summary.averageRating} allowHalf style={{ fontSize: 16 }} />
              <span style={{ color: 'var(--gray-500)', fontSize: 14 }}>({summary.totalReviews} đánh giá)</span>
            </div>
          )}

          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--red)', marginBottom: 16 }}>{formatVND(product.price)}</div>

          <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, marginBottom: 24 }}>{product.description}</p>

          <div style={{ marginBottom: 24, padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 10 }}>
            {product.stockQuantity > 0 ? (
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Còn {product.stockQuantity} sản phẩm</span>
            ) : (
              <span style={{ color: 'var(--red)', fontWeight: 600 }}>✕ Hết hàng</span>
            )}
          </div>

          {product.stockQuantity > 0 && !isAdmin && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <InputNumber min={1} max={product.stockQuantity} value={qty} onChange={setQty} size="large" style={{ width: 100 }} />
              <Button type="primary" icon={<ShoppingCartOutlined />} size="large" loading={adding} onClick={addToCart}
                style={{ height: 48, paddingInline: 32, borderRadius: 10, fontWeight: 600, background: 'var(--accent)' }}>
                Thêm vào giỏ
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div style={{ marginTop: 48 }}>
        <h2 className="section-title">⭐ Đánh giá sản phẩm</h2>

        {user && !isAdmin && (
          <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 24, marginBottom: 24, boxShadow: 'var(--shadow)' }}>
            <h3 style={{ marginBottom: 16, color: 'var(--navy)' }}>Viết đánh giá</h3>
            <Form onFinish={submitReview} layout="vertical">
              <Form.Item name="rating" rules={[{ required: true, message: 'Chọn số sao' }]}>
                <Rate style={{ fontSize: 24 }} />
              </Form.Item>
              <Form.Item name="comment">
                <Input.TextArea rows={3} placeholder="Nhận xét của bạn..." />
              </Form.Item>
              <Button type="primary" htmlType="submit" style={{ background: 'var(--accent)' }}>Gửi đánh giá</Button>
            </Form>
          </div>
        )}

        {reviews.length === 0 ? (
          <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: 32 }}>Chưa có đánh giá nào</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 20, marginBottom: 12, boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong style={{ color: 'var(--navy)' }}>{r.userName}</strong>
                <Rate disabled value={r.rating} style={{ fontSize: 14 }} />
              </div>
              {r.comment && <p style={{ color: 'var(--gray-500)' }}>{r.comment}</p>}
              <div style={{ fontSize: 12, color: 'var(--gray-300)', marginTop: 4 }}>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
