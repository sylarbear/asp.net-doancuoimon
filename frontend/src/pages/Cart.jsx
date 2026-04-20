import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, InputNumber, Spin, message, Empty, Input, Select, Divider } from 'antd';
import { DeleteOutlined, ShoppingOutlined, TagOutlined } from '@ant-design/icons';
import { cartAPI, orderAPI, voucherAPI } from '../api';
import { formatVND } from '../utils';
import { getProductImage } from '../productImages';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherResult, setVoucherResult] = useState(null);
  const [form, setForm] = useState({ shippingAddress: '', receiverName: '', receiverPhone: '', note: '', paymentMethod: 'COD' });
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    cartAPI.get().then(res => {
      const cartData = res.data.data;
      setItems(cartData?.items || (Array.isArray(cartData) ? cartData : []));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const total = items.reduce((s, i) => s + (Number(i.productPrice) || Number(i.price) || 0) * (i.quantity || 1), 0);

  const updateQty = async (id, qty) => {
    if (!qty || qty < 1) return;
    try {
      await cartAPI.update(id, { quantity: qty });
      load();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) { message.error('Lỗi cập nhật số lượng'); }
  };

  const remove = async (id) => {
    try {
      await cartAPI.remove(id);
      message.success('Đã xóa khỏi giỏ hàng');
      load();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      message.error('Lỗi xóa sản phẩm');
    }
  };

  const validateVoucher = async () => {
    if (!voucherCode) return;
    try {
      const res = await voucherAPI.validate({ code: voucherCode, orderAmount: total });
      setVoucherResult(res.data.data);
      if (res.data.data.isValid) message.success(`Giảm ${formatVND(res.data.data.discountAmount)}`);
      else message.warning(res.data.data.message);
    } catch { message.error('Lỗi kiểm tra voucher'); }
  };

  const placeOrder = async () => {
    if (!form.shippingAddress || !form.receiverName || !form.receiverPhone) {
      message.warning('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    setOrdering(true);
    try {
      const data = { ...form };
      if (voucherResult?.isValid) data.voucherCode = voucherCode;
      const res = await orderAPI.create(data);
      if (res.data.success) {
        message.success('Đặt hàng thành công!');
        window.dispatchEvent(new Event('cart-updated'));
        navigate('/orders');
      } else {
        message.error(res.data.message);
      }
    } catch (err) { message.error(err.response?.data?.message || 'Lỗi đặt hàng'); }
    setOrdering(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  return (
    <div className="app-content fade-in">
      <h1 className="section-title">🛒 Giỏ hàng ({items.length})</h1>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Empty description="Giỏ hàng trống" />
          <Link to="/products"><Button type="primary" style={{ marginTop: 16, background: 'var(--accent)' }}>Mua sắm ngay</Button></Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Items */}
          <div>
            {items.map(item => {
              // Infer brand from product name for SVG styling
              const knownBrands = ['Samsung', 'Apple', 'iPhone', 'Xiaomi', 'Redmi', 'OPPO', 'ASUS', 'Dell', 'Lenovo', 'HP'];
              const inferredBrand = knownBrands.find(b => item.productName?.toLowerCase().includes(b.toLowerCase()));
              const brand = inferredBrand === 'iPhone' || inferredBrand === 'Redmi' ? (inferredBrand === 'iPhone' ? 'Apple' : 'Xiaomi') : inferredBrand;
              const isLaptop = ['ASUS', 'Dell', 'Lenovo', 'HP'].includes(brand);
              const imgUrl = getProductImage({ name: item.productName, brand: brand || '', categoryId: isLaptop ? 2 : 1 });
              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    {imgUrl ? <img src={imgUrl} alt={item.productName} /> : '📦'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/products/${item.productId}`} style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 15 }}>{item.productName}</Link>
                    <div style={{ color: 'var(--red)', fontWeight: 700, marginTop: 4 }}>{formatVND((item.productPrice || item.price))}</div>
                  </div>
                  <InputNumber min={1} max={99} value={item.quantity} onChange={v => updateQty(item.id, v)} style={{ width: 80 }} />
                  <div className="cart-item-total">{formatVND(item.subTotal || (item.productPrice || item.price) * item.quantity)}</div>
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(item.id)} />
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3 style={{ color: 'var(--navy)', marginBottom: 16 }}>Tóm tắt đơn hàng</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Tạm tính</span><strong>{formatVND(total)}</strong>
            </div>

            {/* Voucher */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Input placeholder="Mã voucher" prefix={<TagOutlined />} value={voucherCode} onChange={e => setVoucherCode(e.target.value.toUpperCase())} />
                <Button onClick={validateVoucher}>Áp dụng</Button>
              </div>
              {voucherResult?.isValid && (
                <div style={{ color: 'var(--green)', fontSize: 13, marginTop: 4 }}>✓ Giảm {formatVND(voucherResult.discountAmount)}</div>
              )}
            </div>

            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
              <span>Tổng</span>
              <span style={{ color: 'var(--red)' }}>{formatVND(total - (voucherResult?.isValid ? voucherResult.discountAmount : 0))}</span>
            </div>

            {!showCheckout ? (
              <Button type="primary" block size="large" icon={<ShoppingOutlined />} onClick={() => setShowCheckout(true)}
                style={{ marginTop: 16, height: 48, borderRadius: 10, fontWeight: 600, background: 'var(--accent)' }}>
                Thanh toán
              </Button>
            ) : (
              <div style={{ marginTop: 16 }}>
                <Input placeholder="Tên người nhận *" value={form.receiverName} onChange={e => setForm(p => ({ ...p, receiverName: e.target.value }))} style={{ marginBottom: 8 }} />
                <Input placeholder="Số điện thoại *" value={form.receiverPhone} onChange={e => setForm(p => ({ ...p, receiverPhone: e.target.value }))} style={{ marginBottom: 8 }} />
                <Input.TextArea placeholder="Địa chỉ giao hàng *" value={form.shippingAddress} onChange={e => setForm(p => ({ ...p, shippingAddress: e.target.value }))} rows={2} style={{ marginBottom: 8 }} />
                <Input placeholder="Ghi chú (tùy chọn)" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} style={{ marginBottom: 8 }} />
                <Select value={form.paymentMethod} onChange={v => setForm(p => ({ ...p, paymentMethod: v }))} style={{ width: '100%', marginBottom: 12 }}
                  options={[{ label: '💵 Thanh toán khi nhận hàng (COD)', value: 'COD' }, { label: '🏦 Chuyển khoản ngân hàng', value: 'BankTransfer' }]} />
                <Button type="primary" block size="large" loading={ordering} onClick={placeOrder}
                  style={{ height: 48, borderRadius: 10, fontWeight: 600, background: 'var(--green)' }}>
                  Xác nhận đặt hàng
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
