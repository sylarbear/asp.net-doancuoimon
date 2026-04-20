import { useState, useEffect } from 'react';
import { Card, Spin, Tag, Progress, Timeline, Empty, Button, Form, Input, message } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { loyaltyAPI, authAPI } from '../api';
import { getTierConfig } from '../utils';

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [loyalty, setLoyalty] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    refreshProfile();
    Promise.all([
      loyaltyAPI.getPoints(),
      loyaltyAPI.getHistory(),
    ]).then(([pRes, hRes]) => {
      setLoyalty(pRes.data.data);
      setHistory(hRes.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      await authAPI.updateProfile(values);
      message.success('Cập nhật thông tin thành công!');
      await refreshProfile();
      setEditing(false);
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi cập nhật');
    }
    setSaving(false);
  };

  const startEdit = () => {
    form.setFieldsValue({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setEditing(true);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  const tierCfg = loyalty ? getTierConfig(loyalty.membershipTier) : getTierConfig('Bronze');

  const tierThresholds = { Bronze: 0, Silver: 500, Gold: 2000, Diamond: 5000 };
  const tierOrder = ['Bronze', 'Silver', 'Gold', 'Diamond'];
  const currentIdx = tierOrder.indexOf(loyalty?.membershipTier || 'Bronze');
  const nextTier = currentIdx < 3 ? tierOrder[currentIdx + 1] : null;
  const progress = nextTier ? ((loyalty?.totalPoints || 0) / tierThresholds[nextTier]) * 100 : 100;

  return (
    <div className="app-content fade-in">
      <h1 className="section-title">👤 Hồ sơ của tôi</h1>

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* User Info */}
        <Card style={{ borderRadius: 'var(--radius)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, var(--navy), var(--accent))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'white', fontWeight: 700 }}>
              {user?.fullName?.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, color: 'var(--navy)' }}>{user?.fullName}</h2>
              <div style={{ color: 'var(--gray-500)' }}>{user?.email}</div>
            </div>
            {!editing && (
              <Button icon={<EditOutlined />} onClick={startEdit} type="text" style={{ color: 'var(--accent)' }}>Sửa</Button>
            )}
          </div>

          {editing ? (
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item name="fullName" label="Họ tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="Điện thoại">
                <Input />
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ">
                <Input.TextArea rows={2} />
              </Form.Item>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button onClick={() => setEditing(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving} style={{ background: 'var(--accent)' }}>Lưu</Button>
              </div>
            </Form>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              <div><strong>📞 Điện thoại:</strong> {user?.phone || 'Chưa cập nhật'}</div>
              <div><strong>📍 Địa chỉ:</strong> {user?.address || 'Chưa cập nhật'}</div>
              <div><strong>📅 Ngày tham gia:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : ''}</div>
            </div>
          )}
        </Card>

        {/* Loyalty */}
        <Card style={{ borderRadius: 'var(--radius)', background: `linear-gradient(135deg, var(--navy) 0%, var(--navy-medium) 100%)`, color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>Hạng thành viên</div>
              <div style={{ fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{tierCfg.icon}</span> {loyalty?.membershipTier}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, opacity: 0.7 }}>Tổng điểm</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent-light)' }}>{loyalty?.totalPoints || 0}</div>
            </div>
          </div>

          {loyalty?.discountPercent > 0 && (
            <Tag color="blue" style={{ marginBottom: 16, fontSize: 14, padding: '4px 12px' }}>
              🎁 Giảm {loyalty.discountPercent}% mỗi đơn hàng
            </Tag>
          )}

          {nextTier && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                <span>{loyalty?.membershipTier}</span>
                <span>{nextTier} ({loyalty?.pointsToNextTier} điểm nữa)</span>
              </div>
              <Progress percent={Math.min(progress, 100)} showInfo={false} strokeColor="var(--accent-light)" trailColor="rgba(255,255,255,0.15)" />
            </div>
          )}

          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 13 }}>
            <div style={{ opacity: 0.7, marginBottom: 4 }}>Cách tính điểm</div>
            <div>Mỗi 100,000₫ = 1 điểm • Bronze→Silver: 500đ • Gold: 2000đ • Diamond: 5000đ</div>
          </div>
        </Card>
      </div>

      {/* History */}
      <div style={{ marginTop: 32 }}>
        <h2 className="section-title">📊 Lịch sử điểm thưởng</h2>
        {history.length === 0 ? (
          <Empty description="Chưa có lịch sử điểm" />
        ) : (
          <Card style={{ borderRadius: 'var(--radius)' }}>
            <Timeline items={history.map(h => ({
              color: h.type === 'Earned' ? 'green' : 'red',
              children: (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ color: h.type === 'Earned' ? 'var(--green)' : 'var(--red)' }}>
                      {h.type === 'Earned' ? '+' : ''}{h.points} điểm
                    </strong>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{h.description}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-300)' }}>{new Date(h.createdAt).toLocaleDateString('vi-VN')}</div>
                </div>
              )
            }))} />
          </Card>
        )}
      </div>
    </div>
  );
}
