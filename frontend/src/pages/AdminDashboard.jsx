import { useState, useEffect } from 'react';
import { Card, Spin, Tag, Table, Select, Statistic, message, Button, Modal, Form, Input, InputNumber, Popconfirm } from 'antd';
import { ShoppingCartOutlined, UserOutlined, DollarOutlined, TrophyOutlined, TeamOutlined, PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined } from '@ant-design/icons';
import { adminAPI, productAPI, categoryAPI } from '../api';
import { formatVND, getStatusColor, getStatusText } from '../utils';
import { getProductImage } from '../productImages';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loyaltyStats, setLoyaltyStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [productModal, setProductModal] = useState({ open: false, editing: null });
  const [form] = Form.useForm();

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      adminAPI.dashboard().catch(() => ({ data: { data: null } })),
      adminAPI.getOrders().catch(() => ({ data: { data: [] } })),
      adminAPI.loyaltyStats().catch(() => ({ data: { data: null } })),
      productAPI.getAll({ pageSize: 100 }).catch(() => ({ data: { data: [] } })),
      categoryAPI.getAll().catch(() => ({ data: { data: [] } })),
    ]).then(([dRes, oRes, lRes, pRes, cRes]) => {
      setDashboard(dRes.data.data);
      setOrders(oRes.data.data || []);
      setLoyaltyStats(lRes.data.data);
      const pData = pRes.data.data;
      setProducts(Array.isArray(pData) ? pData : (pData?.data || pData?.items || []));
      setCategories(cRes.data.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateStatus(orderId, { status: newStatus });
      message.success(`Cập nhật → ${getStatusText(newStatus)}`);
      const res = await adminAPI.getOrders();
      setOrders(res.data.data || []);
    } catch (err) { message.error(err.response?.data?.message || 'Lỗi cập nhật'); }
  };

  const openProductModal = (product = null) => {
    setProductModal({ open: true, editing: product });
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  };

  const handleProductSubmit = async (values) => {
    try {
      if (productModal.editing) {
        await adminAPI.updateProduct(productModal.editing.id, { ...values, isActive: true });
        message.success('Cập nhật sản phẩm thành công!');
      } else {
        await adminAPI.createProduct(values);
        message.success('Thêm sản phẩm thành công!');
      }
      setProductModal({ open: false, editing: null });
      loadAll();
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi lưu sản phẩm');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await adminAPI.deleteProduct(id);
      message.success('Đã xóa sản phẩm');
      loadAll();
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi xóa sản phẩm');
    }
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['overview', 'orders', 'products', 'loyalty'].map(t => (
          <Button key={t} type={tab === t ? 'primary' : 'default'} onClick={() => setTab(t)}
            style={tab === t ? { background: 'var(--accent)' } : {}}>
            {t === 'overview' ? '📈 Tổng quan' : t === 'orders' ? '📋 Đơn hàng' : t === 'products' ? '📦 Sản phẩm' : '🏆 Loyalty'}
          </Button>
        ))}
      </div>

      {tab === 'overview' && dashboard && (
        <div>
          <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
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
                <div key={o.orderCode} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)', flexWrap: 'wrap', gap: 8 }}>
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

      {/* Products Management */}
      {tab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ color: 'var(--gray-500)' }}>{products.length} sản phẩm</span>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openProductModal()}
              style={{ background: 'var(--accent)', borderRadius: 10 }}>
              Thêm sản phẩm
            </Button>
          </div>

          <Card style={{ borderRadius: 'var(--radius)' }}>
            <Table dataSource={products} rowKey="id" scroll={{ x: 900 }} pagination={{ pageSize: 10 }} columns={[
              {
                title: 'Ảnh', width: 70, render: (_, r) => {
                  const imgUrl = getProductImage(r);
                  return <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: 'var(--gray-100)' }}>
                    {imgUrl && <img src={imgUrl} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                  </div>;
                }
              },
              { title: 'Tên sản phẩm', dataIndex: 'name', width: 200, render: v => <strong>{v}</strong> },
              { title: 'Thương hiệu', dataIndex: 'brand', width: 100, render: v => <Tag>{v}</Tag> },
              { title: 'Danh mục', dataIndex: 'categoryName', width: 110, render: v => <Tag color="blue">{v || 'N/A'}</Tag> },
              { title: 'Giá', dataIndex: 'price', width: 140, render: v => <span style={{ color: 'var(--red)', fontWeight: 600 }}>{formatVND(v)}</span> },
              { title: 'Kho', dataIndex: 'stockQuantity', width: 80, render: v => <span style={{ color: v > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{v}</span> },
              {
                title: 'Hành động', width: 120, render: (_, r) => (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Button type="text" icon={<EditOutlined />} onClick={() => openProductModal(r)} size="small" />
                    <Popconfirm title="Xóa sản phẩm này?" onConfirm={() => deleteProduct(r.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                      <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                  </div>
                )
              },
            ]} />
          </Card>

          {/* Product Modal */}
          <Modal
            title={productModal.editing ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
            open={productModal.open}
            onCancel={() => setProductModal({ open: false, editing: null })}
            footer={null}
            width={560}
          >
            <Form form={form} layout="vertical" onFinish={handleProductSubmit} style={{ marginTop: 16 }}>
              <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}>
                <Input placeholder="VD: Samsung Galaxy S25 Ultra" />
              </Form.Item>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="brand" label="Thương hiệu" rules={[{ required: true, message: 'Nhập thương hiệu' }]}>
                  <Select placeholder="Chọn hoặc nhập mới" showSearch allowClear
                    options={['Samsung', 'Apple', 'Xiaomi', 'OPPO', 'ASUS', 'Dell', 'Lenovo', 'HP', 'Acer', 'MSI'].map(b => ({ label: b, value: b }))}
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} />
                </Form.Item>
                <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: 'Chọn danh mục' }]}>
                  <Select placeholder="Chọn" options={categories.map(c => ({ label: c.name, value: c.id }))} />
                </Form.Item>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: 'Nhập giá' }]}>
                  <InputNumber style={{ width: '100%' }} min={0} step={100000} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v.replace(/,/g, '')} />
                </Form.Item>
                <Form.Item name="stockQuantity" label="Số lượng kho" rules={[{ required: true, message: 'Nhập SL' }]}>
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </div>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={3} placeholder="Mô tả chi tiết sản phẩm..." />
              </Form.Item>
              <Form.Item name="imageUrl" label="URL ảnh (tùy chọn)">
                <Input placeholder="https://..." />
              </Form.Item>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button onClick={() => setProductModal({ open: false, editing: null })}>Hủy</Button>
                <Button type="primary" htmlType="submit" style={{ background: 'var(--accent)' }}>
                  {productModal.editing ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      )}

      {/* Loyalty */}
      {tab === 'loyalty' && loyaltyStats && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
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
