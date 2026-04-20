import { Link } from 'react-router-dom';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

export default function NotFound() {
  return (
    <div className="auth-container" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="fade-in" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 120, fontWeight: 900, color: 'var(--accent)', lineHeight: 1, opacity: 0.15 }}>404</div>
        <h1 style={{ fontSize: 28, color: 'var(--navy)', marginTop: -20 }}>Không tìm thấy trang</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: 32, maxWidth: 400 }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/" className="btn-primary" style={{ padding: '12px 28px' }}>
            <HomeOutlined /> Về trang chủ
          </Link>
          <button onClick={() => window.history.back()} className="btn-outline" style={{ cursor: 'pointer' }}>
            <ArrowLeftOutlined /> Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
