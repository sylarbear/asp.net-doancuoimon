import { useState, useEffect } from 'react';
import { Card, Spin, Tag, Table, Select, Statistic, message, Button, Modal } from 'antd';
import { ShoppingCartOutlined, UserOutlined, DollarOutlined, TrophyOutlined, TeamOutlined } from '@ant-design/icons';
import { adminAPI } from '../api';
import { formatVND, getStatusColor, getStatusText } from '../utils';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loyaltyStats, setLoyaltyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminAPI.dashboard().catch(() => ({ data: { data: null } })),
      adminAPI.getOrders().catch(() => ({ data: { data: [] } })),
      adminAPI.loyaltyStats().catch(() => ({ data: { data: null } })),
    ]).then(([dRes, oRes, lRes]) => {
      setDashboard(dRes.data.data);
      setOrders(oRes.data.data || []);
      setLoyaltyStats(lRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateStatus(orderId, { status: newStatus });
      message.success(`Cập nhật → ${getStatusText(newStatus)}`);
      const res = await adminAPI.getOrders();
      setOrders(res.data.data || []);
    } catch (err) { message.error(err.response?.data?.message || 'Lỗi cập nhật'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  const statusOptions = {
    Pending: ['Confirmed', 'Cancelled'],
    Confirmed: ['Shipping', 'Cancelled'],
    Shipping: ['Delivered'],
    Delivered: ['Completed'],
  };

  return (
    <div className="app-content fade-in">
      <h1 className="section-title">📊 Admin Dashboard</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['overview', 'orders', 'loyalty'].map(t => (
          <Button key={t} type={tab === t ? 'primary' : 'default'} onClick={() => setTab(t)}
            style={tab === t ? { background: 'var(--accent)' } : {}}>
            {t === 'overview' ? '📈 Tổng quan' : t === 'orders' ? '📋 Đơn hàng' : '🏆 Loyalty'}
          </Button>
        ))}
      </div>

      {tab === 'overview' && dashboard && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { title: 'Doanh thu', value: formatVND(dashboard.totalRevenue), icon: <DollarOutlined />, color: '#10b981' },
              { title: 'Đơn hàng', value: dashboard.totalOrders, icon: <ShoppingCartOutlined />, color: '#3b82f6' },
              { title: 'Chờ xử lý', value: dashboard.pendingOrders || 0, icon: <ShoppingCartOutlined />, color: '#f59e0b' },
              { title: 'Sản phẩm', value: dashboard.totalProducts, icon: <TrophyOutlined />, color: '#8b5cf6' },
              { title: 'Khách hàng', value: dashboard.totalCustomers, icon: <UserOutlined />, color: '#06b6d4' },
            ].map((s, i) => (
              <Card key={i} style={{ borderRadius: 'var(--radius)', borderLeft: `4px solid ${s.color}` }}>
                <Statistic title={s.title} value={s.value} prefix={s.icon} valueStyle={{ color: s.color, fontWeight: 700 }} />
              </Card>
            ))}
          </div>

          {orders.length > 0 && (
            <Card title="Đơn hàng gần đây" style={{ borderRadius: 'var(--radius)' }}>
              {orders.slice(0, 5).map(o => (
                <div key={o.orderCode} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span><strong>{o.orderCode}</strong> — {o.customerName || 'N/A'}</span>
                  <span><Tag color={getStatusColor(o.status)}>{getStatusText(o.status)}</Tag> {formatVND(o.finalAmount)}</span>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}

      {/* Orders */}
      {tab === 'orders' && (
        <Card style={{ borderRadius: 'var(--radius)' }}>
          <Table dataSource={orders} rowKey="id" scroll={{ x: 900 }} pagination={{ pageSize: 10 }} columns={[
            { title: 'Mã', dataIndex: 'orderCode', width: 160, render: v => <strong>{v}</strong> },
            { title: 'Khách hàng', dataIndex: 'customerName', width: 140 },
            { title: 'Tổng tiền', dataIndex: 'finalAmount', width: 140, render: v => <span style={{ color: 'var(--red)', fontWeight: 600 }}>{formatVND(v)}</span> },
            { title: 'Thanh toán', dataIndex: 'paymentMethod', width: 100 },
            { title: 'TT Thanh toán', dataIndex: 'paymentStatus', width: 100, render: v => <Tag color={v === 'Paid' ? 'green' : 'orange'}>{v}</Tag> },
            { title: 'Trạng thái', dataIndex: 'status', width: 120, render: v => <Tag color={getStatusColor(v)}>{getStatusText(v)}</Tag> },
            { title: 'Ngày tạo', dataIndex: 'createdAt', width: 140, render: v => new Date(v).toLocaleDateString('vi-VN') },
            {
              title: 'Hành động', width: 180, render: (_, r) => {
                const opts = statusOptions[r.status];
                if (!opts) return null;
                return (
                  <Select placeholder="Cập nhật" size="small" style={{ width: 150 }}
                    onChange={v => updateStatus(r.id, v)}
                    options={opts.map(s => ({ label: getStatusText(s), value: s }))} />
                );
              }
            },
          ]} />
        </Card>
      )}

      {/* Loyalty */}
      {tab === 'loyalty' && loyaltyStats && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Tổng thành viên', value: loyaltyStats.totalMembers, icon: <TeamOutlined /> },
              { label: '🥉 Bronze', value: loyaltyStats.bronzeCount },
              { label: '🥈 Silver', value: loyaltyStats.silverCount },
              { label: '🥇 Gold', value: loyaltyStats.goldCount },
              { label: '💎 Diamond', value: loyaltyStats.diamondCount },
            ].map((s, i) => (
              <Card key={i} style={{ borderRadius: 'var(--radius)', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>{s.label}</div>
              </Card>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card style={{ borderRadius: 'var(--radius)' }}>
              <Statistic title="Tổng điểm đã phát" value={loyaltyStats.totalPointsIssued} prefix="🎁" valueStyle={{ color: 'var(--green)' }} />
            </Card>
            <Card style={{ borderRadius: 'var(--radius)' }}>
              <Statistic title="Tổng điểm đã đổi" value={loyaltyStats.totalPointsRedeemed} prefix="🔄" valueStyle={{ color: 'var(--accent)' }} />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
