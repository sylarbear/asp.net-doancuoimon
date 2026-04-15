import { useState, useEffect } from 'react';
import { Spin, Tag, Empty, Button, message, Modal } from 'antd';
import { orderAPI, paymentAPI } from '../api';
import { formatVND, getStatusColor, getStatusText } from '../utils';

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
      <h1 className="section-title">📋 Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <Empty description="Chưa có đơn hàng nào" />
      ) : (
        orders.map(o => (
          <div key={o.id} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16, boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <strong style={{ color: 'var(--navy)', fontSize: 16 }}>{o.orderCode}</strong>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{new Date(o.createdAt).toLocaleString('vi-VN')}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Tag color={getStatusColor(o.status)}>{getStatusText(o.status)}</Tag>
                <Tag color={o.paymentStatus === 'Paid' ? 'green' : 'orange'}>{o.paymentStatus === 'Paid' ? '✓ Đã TT' : 'Chưa TT'}</Tag>
              </div>
            </div>

            {/* Items */}
            {o.orderDetails.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <span>{d.productName} × {d.quantity}</span>
                <span style={{ fontWeight: 600 }}>{formatVND(d.subTotal)}</span>
              </div>
            ))}

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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginTop: 8 }}>
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
