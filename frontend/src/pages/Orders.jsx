import { useState, useEffect } from 'react';
import { Spin, Tag, Empty, Button, message, Modal, Steps } from 'antd';
import { orderAPI, paymentAPI } from '../api';
import { formatVND, getStatusColor, getStatusText } from '../utils';
import { getProductImage } from '../productImages';

const statusSteps = ['Pending', 'Confirmed', 'Shipping', 'Delivered', 'Completed'];

function OrderStatusTracker({ status }) {
  const currentStep = statusSteps.indexOf(status);
  if (status === 'Cancelled') {
    return <Tag color="red" style={{ fontSize: 14, padding: '4px 16px' }}>❌ Đã hủy</Tag>;
  }
  return (
    <Steps
      size="small"
      current={currentStep}
      items={statusSteps.map(s => ({
        title: getStatusText(s),
      }))}
      style={{ marginBottom: 16 }}
    />
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    orderAPI.getAll().then(res => setOrders(res.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const cancelOrder = async (id) => {
    Modal.confirm({
      title: 'Hủy đơn hàng?',
      content: 'Bạn có chắc muốn hủy đơn hàng này?',
      okText: 'Hủy đơn',
      okType: 'danger',
      onOk: async () => {
        try {
          await orderAPI.cancel(id);
          message.success('Đã hủy đơn hàng');
          load();
        } catch (err) { message.error(err.response?.data?.message || 'Lỗi'); }
      }
    });
  };

  const confirmPayment = async (orderId) => {
    try {
      const infoRes = await paymentAPI.getInfo(orderId);
      const info = infoRes.data.data;
      Modal.confirm({
        title: '💳 Thanh toán chuyển khoản',
        width: 480,
        content: (
          <div style={{ padding: '16px 0' }}>
            <p><strong>Ngân hàng:</strong> {info.bank}</p>
            <p><strong>Số tài khoản:</strong> {info.accountNumber}</p>
            <p><strong>Tên TK:</strong> {info.accountName}</p>
            <p><strong>Số tiền:</strong> <span style={{ color: 'var(--red)', fontWeight: 700 }}>{formatVND(info.amount)}</span></p>
            <p><strong>Nội dung:</strong> {info.message}</p>
            <div style={{ background: 'var(--gray-50)', padding: 12, borderRadius: 8, marginTop: 12, fontSize: 13, color: 'var(--gray-500)' }}>
              ⓘ Nhấn "Đã thanh toán" sau khi chuyển khoản thành công
            </div>
          </div>
        ),
        okText: '✅ Đã thanh toán',
        cancelText: 'Đóng',
        onOk: async () => {
          await paymentAPI.confirm(orderId);
          message.success('Thanh toán thành công!');
          load();
        }
      });
    } catch (err) { message.error(err.response?.data?.message || 'Lỗi'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  return (
    <div className="app-content fade-in">
      <h1 className="section-title">📋 Đơn hàng của tôi ({orders.length})</h1>

      {orders.length === 0 ? (
        <Empty description="Chưa có đơn hàng nào" />
      ) : (
        orders.map(o => (
          <div key={o.id} className="order-card">
            {/* Header */}
            <div className="order-header">
              <div>
                <strong style={{ color: 'var(--navy)', fontSize: 16 }}>{o.orderCode}</strong>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{new Date(o.createdAt).toLocaleString('vi-VN')}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Tag color={getStatusColor(o.status)}>{getStatusText(o.status)}</Tag>
                <Tag color={o.paymentStatus === 'Paid' ? 'green' : 'orange'}>{o.paymentStatus === 'Paid' ? '✓ Đã TT' : 'Chưa TT'}</Tag>
                <Tag>{o.paymentMethod === 'COD' ? '💵 COD' : '🏦 CK'}</Tag>
              </div>
            </div>

            {/* Status tracker */}
            {o.status !== 'Cancelled' && <OrderStatusTracker status={o.status} />}

            {/* Items with images */}
            {o.orderDetails.map((d, i) => {
              const knownBrands = ['Samsung', 'Apple', 'iPhone', 'Xiaomi', 'Redmi', 'OPPO', 'ASUS', 'Dell', 'Lenovo', 'HP'];
              const found = knownBrands.find(b => d.productName?.toLowerCase().includes(b.toLowerCase()));
              const brand = found === 'iPhone' ? 'Apple' : found === 'Redmi' ? 'Xiaomi' : found;
              const isLaptop = ['ASUS', 'Dell', 'Lenovo', 'HP'].includes(brand);
              const imgUrl = getProductImage({ name: d.productName, brand: brand || '', categoryId: isLaptop ? 2 : 1 });
              
              return (
                <div key={i} className="order-item">
                  <div className="order-item-img">
                    {imgUrl ? <img src={imgUrl} alt={d.productName} /> : '📦'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{d.productName}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>SL: {d.quantity} × {formatVND(d.unitPrice)}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', whiteSpace: 'nowrap' }}>{formatVND(d.subTotal)}</div>
                </div>
              );
            })}

            {/* Shipping info */}
            {o.shippingAddress && (
              <div style={{ margin: '12px 0', padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 8, fontSize: 13, color: 'var(--gray-500)' }}>
                📍 {o.receiverName} • {o.receiverPhone} • {o.shippingAddress}
              </div>
            )}

            {/* Totals */}
            <div style={{ marginTop: 12, padding: '12px 0', borderTop: '2px solid var(--gray-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--gray-500)' }}>
                <span>Tạm tính</span><span>{formatVND(o.totalAmount)}</span>
              </div>
              {o.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--green)' }}>
                  <span>Voucher ({o.voucherCode})</span><span>-{formatVND(o.discountAmount)}</span>
                </div>
              )}
              {o.memberDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--green)' }}>
                  <span>Ưu đãi thành viên</span><span>-{formatVND(o.memberDiscount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, marginTop: 8 }}>
                <span>Tổng thanh toán</span><span style={{ color: 'var(--red)' }}>{formatVND(o.finalAmount)}</span>
              </div>
              {o.pointsEarned > 0 && o.status === 'Completed' && (
                <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 4 }}>🎁 +{o.pointsEarned} điểm tích lũy</div>
              )}
            </div>

            {/* Actions */}
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              {o.status === 'Pending' && <Button danger onClick={() => cancelOrder(o.id)}>Hủy đơn</Button>}
              {o.paymentMethod === 'BankTransfer' && o.paymentStatus !== 'Paid' && o.status !== 'Cancelled' && (
                <Button type="primary" onClick={() => confirmPayment(o.id)} style={{ background: 'var(--accent)' }}>💳 Thanh toán</Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
