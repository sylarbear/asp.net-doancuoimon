import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await register(values);
      if (result.success) {
        message.success('Đăng ký thành công! Hãy đăng nhập.');
        navigate('/login');
      } else {
        message.error(result.message);
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Đăng ký thất bại');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in" style={{ maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🚀</div>
          <h2 style={{ margin: 0 }}>Tạo tài khoản</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Tham gia TechnoStore để nhận ưu đãi</p>
        </div>
        <Form onFinish={onFinish} layout="vertical" size="large">
          <Form.Item name="fullName" rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item name="phone" rules={[{ required: true, message: 'Nhập SĐT' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item name="address">
            <Input prefix={<HomeOutlined />} placeholder="Địa chỉ (tùy chọn)" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}
              style={{ height: 48, borderRadius: 10, fontWeight: 600, background: 'var(--accent)' }}>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', color: 'var(--gray-500)' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
