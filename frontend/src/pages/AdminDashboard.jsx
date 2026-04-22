import { useState, useEffect } from 'react';
import { Card, Spin, Tag, Table, Select, Statistic, message, Button, Modal, Form, Input, InputNumber, Popconfirm, DatePicker } from 'antd';
import { ShoppingCartOutlined, UserOutlined, DollarOutlined, TrophyOutlined, TeamOutlined, PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { adminAPI, productAPI, categoryAPI } from '../api';
import { formatVND, getStatusColor, getStatusText } from '../utils';
import { getProductImage } from '../productImages';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loyaltyStats, setLoyaltyStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [productModal, setProductModal] = useState({ open: false, editing: null });
  const [voucherModal, setVoucherModal] = useState({ open: false, editing: null });
  const [form] = Form.useForm();
  const [voucherForm] = Form.useForm();

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      adminAPI.dashboard().catch(() => ({ data: { data: null } })),
      adminAPI.getOrders().catch(() => ({ data: { data: [] } })),
      adminAPI.loyaltyStats().catch(() => ({ data: { data: null } })),
      productAPI.getAll({ pageSize: 100 }).catch(() => ({ data: { data: [] } })),
      categoryAPI.getAll().catch(() => ({ data: { data: [] } })),
      adminAPI.getVouchers().catch(() => ({ data: { data: [] } })),
    ]).then(([dRes, oRes, lRes, pRes, cRes, vRes]) => {
      setDashboard(dRes.data.data);
      setOrders(oRes.data.data || []);
      setLoyaltyStats(lRes.data.data);
      const pData = pRes.data.data;
      setProducts(Array.isArray(pData) ? pData : (pData?.data || pData?.items || []));
      setCategories(cRes.data.data || []);
      setVouchers(vRes.data.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, []);

  // === ORDER STATUS ===
  const updateStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateStatus(orderId, { status: newStatus });
      message.success(`Cập nhật → ${getStatusText(newStatus)}`);
      const res = await adminAPI.getOrders();
      setOrders(res.data.data || []);
    } catch (err) { message.error(err.response?.data?.message || 'Lỗi cập nhật'); }
  };

  // === PRODUCT CRUD ===
  const openProductModal = (product = null) => {
    setProductModal({ open: true, editing: product });
    if (product) form.setFieldsValue(product);
    else form.resetFields();
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
    } catch (err) { message.error(err.response?.data?.message || 'Lỗi lưu sản phẩm'); }
  };

  const deleteProduct = async (id) => {
    try { await adminAPI.deleteProduct(id); message.success('Đã xóa sản phẩm'); loadAll(); }
    catch (err) { message.error(err.response?.data?.message || 'Lỗi xóa'); }
  };

  // === VOUCHER CRUD ===
  const openVoucherModal = (voucher = null) => {
    setVoucherModal({ open: true, editing: voucher });
    if (voucher) {
      voucherForm.setFieldsValue({
        ...voucher,
        startDate: dayjs(voucher.startDate),
        endDate: dayjs(voucher.endDate),
      });
    } else {
      voucherForm.resetFields();
    }
  };

  const handleVoucherSubmit = async (values) => {
    try {
      const data = {
        ...values,
        code: values.code?.toUpperCase(),
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
      };
      if (voucherModal.editing) {
        await adminAPI.updateVoucher(voucherModal.editing.id, {
          description: data.description,
          minOrderAmount: data.minOrderAmount,
          maxDiscountAmount: data.maxDiscountAmount,
          usageLimit: data.usageLimit,
          endDate: data.endDate,
          isActive: data.isActive ?? true,
        });
        message.success('Cập nhật voucher thành công!');
      } else {
        await adminAPI.createVoucher(data);
        message.success('Tạo voucher thành công!');
      }
      setVoucherModal({ open: false, editing: null });
      loadAll();
    } catch (err) { message.error(err.response?.data?.message || 'Lỗi lưu voucher'); }
  };

  const deleteVoucher = async (id) => {
    try { await adminAPI.deleteVoucher(id); message.success('Đã xóa voucher'); loadAll(); }
    catch (err) { message.error(err.response?.data?.message || 'Lỗi xóa'); }
  };

  // === EXPORT EXCEL ===
  const exportOrders = () => {
    const data = orders.map(o => ({
      'Mã đơn': o.orderCode,
      'Khách hàng': o.customerName || '',
      'Email': o.customerEmail || '',
      'Tổng tiền': o.totalAmount,
      'Giảm giá': o.discountAmount,
      'Ưu đãi TV': o.memberDiscount,
      'Thanh toán': o.finalAmount,
      'PTTT': o.paymentMethod,
      'TT Thanh toán': o.paymentStatus === 'Paid' ? 'Đã TT' : 'Chưa TT',
      'Trạng thái': getStatusText(o.status),
      'Ngày tạo': new Date(o.createdAt).toLocaleDateString('vi-VN'),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 18 }, { wch: 20 }, { wch: 25 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 14 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Đơn hàng');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `DonHang_${new Date().toISOString().slice(0, 10)}.xlsx`);
    message.success('Đã xuất file Excel!');
  };

  const exportProducts = () => {
    const data = products.map(p => ({
      'Tên SP': p.name,
      'Thương hiệu': p.brand,
      'Danh mục': p.categoryName || '',
      'Giá': p.price,
      'Kho': p.stockQuantity,
      'Mô tả': p.description || '',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 30 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 8 }, { wch: 40 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `SanPham_${new Date().toISOString().slice(0, 10)}.xlsx`);
    message.success('Đã xuất file Excel!');
  };

  // === CHART DATA ===
  const getRevenueChartData = () => {
    const map = {};
    orders.filter(o => o.status !== 'Cancelled').forEach(o => {
      const day = new Date(o.createdAt).toLocaleDateString('vi-VN');
      map[day] = (map[day] || 0) + o.finalAmount;
    });
    return Object.entries(map).map(([date, revenue]) => ({ date, revenue })).slice(-10);
  };

  const getStatusPieData = () => {
    const map = {};
    orders.forEach(o => {
      const label = getStatusText(o.status);
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  };

  const PIE_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#ef4444'];

  if (loading) return (
    <div className="app-content" style={{ padding: 24 }}>
      {/* Skeleton stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 80, height: 14, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', borderRadius: 4, marginBottom: 16, animation: 'shimmer 1.5s infinite' }} />
            <div style={{ width: 120, height: 28, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', borderRadius: 6, animation: 'shimmer 1.5s infinite' }} />
          </div>
        ))}
      </div>
      {/* Skeleton charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 24, height: 300, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ width: 160, height: 18, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', borderRadius: 4, marginBottom: 24, animation: 'shimmer 1.5s infinite' }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200 }}>
            {[60, 80, 45, 90, 70, 55, 85, 40, 75, 65].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', borderRadius: '4px 4px 0 0', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 24, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', animation: 'shimmer 1.5s infinite' }} />
        </div>
      </div>
      {/* Skeleton table rows */}
      <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ width: 200, height: 18, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', borderRadius: 4, marginBottom: 20, animation: 'shimmer 1.5s infinite' }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
            {[100, 150, 80, 100, 80, 120].map((w, j) => (
              <div key={j} style={{ width: w, height: 14, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', borderRadius: 4, animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
      `}</style>
    </div>
  );

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
        {['overview', 'orders', 'products', 'vouchers', 'loyalty'].map(t => (
          <Button key={t} type={tab === t ? 'primary' : 'default'} onClick={() => setTab(t)}
            style={tab === t ? { background: 'var(--accent)' } : {}}>
            {t === 'overview' ? '📈 Tổng quan' : t === 'orders' ? '📋 Đơn hàng' : t === 'products' ? '📦 Sản phẩm' : t === 'vouchers' ? '🎫 Voucher' : '🏆 Loyalty'}
          </Button>
        ))}
      </div>

      {/* ==================== OVERVIEW TAB ==================== */}
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

          {/* Revenue Chart */}
          {orders.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
              <Card title="💰 Doanh thu theo ngày" style={{ borderRadius: 'var(--radius)' }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={getRevenueChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={11} />
                    <YAxis fontSize={11} tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={v => formatVND(v)} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Doanh thu" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card title="📊 Trạng thái đơn hàng" style={{ borderRadius: 'var(--radius)' }}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={getStatusPieData()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`} fontSize={11}>
                      {getStatusPieData().map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Legend fontSize={12} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

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

      {/* ==================== ORDERS TAB ==================== */}
      {tab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ color: 'var(--gray-500)' }}>{orders.length} đơn hàng</span>
            <Button icon={<DownloadOutlined />} onClick={exportOrders} style={{ borderRadius: 10 }}>
              Xuất Excel
            </Button>
          </div>
          <Card style={{ borderRadius: 'var(--radius)' }}>
            <Table dataSource={orders} rowKey="id" scroll={{ x: 1000 }} pagination={{ pageSize: 10 }} columns={[
              { title: 'Mã', dataIndex: 'orderCode', width: 160, render: v => <strong>{v}</strong> },
              { title: 'Khách hàng', dataIndex: 'customerName', width: 140 },
              { title: 'Tổng tiền', dataIndex: 'finalAmount', width: 140, render: v => <span style={{ color: 'var(--red)', fontWeight: 600 }}>{formatVND(v)}</span> },
              { title: 'PTTT', dataIndex: 'paymentMethod', width: 80, render: v => v === 'COD' ? '💵 COD' : '🏦 CK' },
              { title: 'Thanh toán', dataIndex: 'paymentStatus', width: 100, render: v => <Tag color={v === 'Paid' ? 'green' : 'orange'}>{v === 'Paid' ? '✓ Đã TT' : 'Chưa TT'}</Tag> },
              { title: 'Trạng thái', dataIndex: 'status', width: 120, render: v => <Tag color={getStatusColor(v)}>{getStatusText(v)}</Tag> },
              { title: 'Ngày', dataIndex: 'createdAt', width: 110, render: v => new Date(v).toLocaleDateString('vi-VN') },
              {
                title: 'Cập nhật', width: 160, render: (_, r) => {
                  const opts = statusOptions[r.status];
                  if (!opts) return <Tag color="default">—</Tag>;
                  return (
                    <Select placeholder="Chuyển TT" size="small" style={{ width: 145 }}
                      onChange={v => updateStatus(r.id, v)}
                      options={opts.map(s => ({ label: getStatusText(s), value: s }))} />
                  );
                }
              },
            ]} />
          </Card>
        </div>
      )}

      {/* ==================== PRODUCTS TAB ==================== */}
      {tab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ color: 'var(--gray-500)' }}>{products.length} sản phẩm</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button icon={<DownloadOutlined />} onClick={exportProducts} style={{ borderRadius: 10 }}>Xuất Excel</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openProductModal()} style={{ background: 'var(--accent)', borderRadius: 10 }}>Thêm sản phẩm</Button>
            </div>
          </div>

          <Card style={{ borderRadius: 'var(--radius)' }}>
            <Table dataSource={products} rowKey="id" scroll={{ x: 900 }} pagination={{ pageSize: 10 }} columns={[
              { title: 'Ảnh', width: 70, render: (_, r) => {
                const imgUrl = getProductImage(r);
                return <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: 'var(--gray-100)' }}>
                  {imgUrl && <img src={imgUrl} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                </div>;
              }},
              { title: 'Tên', dataIndex: 'name', width: 200, render: v => <strong>{v}</strong> },
              { title: 'Thương hiệu', dataIndex: 'brand', width: 100, render: v => <Tag>{v}</Tag> },
              { title: 'Danh mục', dataIndex: 'categoryName', width: 110, render: v => <Tag color="blue">{v || 'N/A'}</Tag> },
              { title: 'Giá', dataIndex: 'price', width: 140, render: v => <span style={{ color: 'var(--red)', fontWeight: 600 }}>{formatVND(v)}</span> },
              { title: 'Kho', dataIndex: 'stockQuantity', width: 80, render: v => <span style={{ color: v > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{v}</span> },
              { title: 'Hành động', width: 120, render: (_, r) => (
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button type="text" icon={<EditOutlined />} onClick={() => openProductModal(r)} size="small" />
                  <Popconfirm title="Xóa sản phẩm này?" onConfirm={() => deleteProduct(r.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                    <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                  </Popconfirm>
                </div>
              )},
            ]} />
          </Card>

          {/* Product Modal */}
          <Modal title={productModal.editing ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'} open={productModal.open}
            onCancel={() => setProductModal({ open: false, editing: null })} footer={null} width={560}>
            <Form form={form} layout="vertical" onFinish={handleProductSubmit} style={{ marginTop: 16 }}>
              <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Nhập tên' }]}>
                <Input placeholder="VD: Samsung Galaxy S25 Ultra" />
              </Form.Item>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="brand" label="Thương hiệu" rules={[{ required: true, message: 'Chọn' }]}>
                  <Select placeholder="Chọn" showSearch allowClear
                    options={['Samsung', 'Apple', 'Xiaomi', 'OPPO', 'ASUS', 'Dell', 'Lenovo', 'HP', 'Acer', 'MSI'].map(b => ({ label: b, value: b }))}
                    filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())} />
                </Form.Item>
                <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: 'Chọn' }]}>
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
              <Form.Item name="description" label="Mô tả"><Input.TextArea rows={3} /></Form.Item>
              <Form.Item name="imageUrl" label="URL ảnh (tùy chọn)"><Input placeholder="https://..." /></Form.Item>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button onClick={() => setProductModal({ open: false, editing: null })}>Hủy</Button>
                <Button type="primary" htmlType="submit" style={{ background: 'var(--accent)' }}>{productModal.editing ? 'Cập nhật' : 'Thêm mới'}</Button>
              </div>
            </Form>
          </Modal>
        </div>
      )}

      {/* ==================== VOUCHER TAB ==================== */}
      {tab === 'vouchers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ color: 'var(--gray-500)' }}>{vouchers.length} voucher</span>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openVoucherModal()} style={{ background: 'var(--accent)', borderRadius: 10 }}>Tạo voucher</Button>
          </div>

          <Card style={{ borderRadius: 'var(--radius)' }}>
            <Table dataSource={vouchers} rowKey="id" scroll={{ x: 900 }} pagination={{ pageSize: 10 }} columns={[
              { title: 'Mã', dataIndex: 'code', width: 120, render: v => <Tag color="blue" style={{ fontWeight: 700 }}>{v}</Tag> },
              { title: 'Loại', dataIndex: 'discountType', width: 100, render: v => v === 'Percent' ? '📊 Phần trăm' : '💰 Cố định' },
              { title: 'Giá trị', width: 120, render: (_, r) => <span style={{ fontWeight: 700, color: 'var(--green)' }}>{r.discountType === 'Percent' ? `${r.discountValue}%` : formatVND(r.discountValue)}</span> },
              { title: 'Đơn tối thiểu', dataIndex: 'minOrderAmount', width: 130, render: v => formatVND(v) },
              { title: 'Giảm tối đa', dataIndex: 'maxDiscountAmount', width: 130, render: v => v ? formatVND(v) : '—' },
              { title: 'SL dùng', width: 100, render: (_, r) => `${r.usedCount}/${r.usageLimit}` },
              { title: 'HSD', dataIndex: 'endDate', width: 110, render: v => new Date(v).toLocaleDateString('vi-VN') },
              { title: 'Điểm', dataIndex: 'pointsCost', width: 80, render: v => v ? <Tag color="purple">{v}đ</Tag> : '—' },
              { title: '', width: 100, render: (_, r) => (
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button type="text" icon={<EditOutlined />} onClick={() => openVoucherModal(r)} size="small" />
                  <Popconfirm title="Xóa voucher?" onConfirm={() => deleteVoucher(r.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                    <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                  </Popconfirm>
                </div>
              )},
            ]} />
          </Card>

          {/* Voucher Modal */}
          <Modal title={voucherModal.editing ? '✏️ Sửa voucher' : '➕ Tạo voucher mới'} open={voucherModal.open}
            onCancel={() => setVoucherModal({ open: false, editing: null })} footer={null} width={560}>
            <Form form={voucherForm} layout="vertical" onFinish={handleVoucherSubmit} style={{ marginTop: 16 }}>
              {!voucherModal.editing && (
                <Form.Item name="code" label="Mã voucher" rules={[{ required: true, message: 'Nhập mã' }]}>
                  <Input placeholder="VD: SALE10" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              )}
              <Form.Item name="description" label="Mô tả"><Input placeholder="Giảm 10% cho đơn từ 500k" /></Form.Item>
              {!voucherModal.editing && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item name="discountType" label="Loại giảm" rules={[{ required: true }]} initialValue="Percent">
                    <Select options={[{ label: 'Phần trăm (%)', value: 'Percent' }, { label: 'Số tiền cố định', value: 'Fixed' }]} />
                  </Form.Item>
                  <Form.Item name="discountValue" label="Giá trị" rules={[{ required: true, message: 'Nhập giá trị' }]}>
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="minOrderAmount" label="Đơn tối thiểu"><InputNumber style={{ width: '100%' }} min={0} step={100000} /></Form.Item>
                <Form.Item name="maxDiscountAmount" label="Giảm tối đa"><InputNumber style={{ width: '100%' }} min={0} step={50000} /></Form.Item>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="usageLimit" label="Giới hạn SL" initialValue={100}><InputNumber style={{ width: '100%' }} min={1} /></Form.Item>
                <Form.Item name="pointsCost" label="Đổi bằng điểm (tùy chọn)"><InputNumber style={{ width: '100%' }} min={0} /></Form.Item>
              </div>
              {!voucherModal.editing && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: 'Chọn ngày' }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: 'Chọn ngày' }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </div>
              )}
              {voucherModal.editing && (
                <Form.Item name="endDate" label="Gia hạn đến"><DatePicker style={{ width: '100%' }} /></Form.Item>
              )}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button onClick={() => setVoucherModal({ open: false, editing: null })}>Hủy</Button>
                <Button type="primary" htmlType="submit" style={{ background: 'var(--accent)' }}>{voucherModal.editing ? 'Cập nhật' : 'Tạo mới'}</Button>
              </div>
            </Form>
          </Modal>
        </div>
      )}

      {/* ==================== LOYALTY TAB ==================== */}
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
