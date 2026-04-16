import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { user, login, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Already logged in? Redirect away
  if (user) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  }

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        message.success('Đăng nhập thành công!');
        // Role-based redirect
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        navigate(userData.role === 'Admin' ? '/admin' : '/');
      } else {
        message.error(result.message || 'Sai email hoặc mật khẩu');
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Đăng nhập thất bại');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔐</div>
          <h2 style={{ margin: 0 }}>Đăng nhập</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Chào mừng bạn quay lại TechnoStore</p>
        </div>
        <Form onFinish={onFinish} layout="vertical" size="large">
          <Form.Item name="email" rules={[{ required: true, message: 'Nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}
              style={{ height: 48, borderRadius: 10, fontWeight: 600, background: 'var(--accent)' }}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', color: 'var(--gray-500)' }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}
