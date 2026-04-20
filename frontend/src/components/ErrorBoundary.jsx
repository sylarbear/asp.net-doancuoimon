import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>😵</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0a1628', marginBottom: 8 }}>
            Oops! Có lỗi xảy ra
          </h2>
          <p style={{ color: '#64748b', marginBottom: 24, maxWidth: 400 }}>
            Đã xảy ra lỗi không mong muốn. Vui lòng tải lại trang hoặc quay về trang chủ.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#3b82f6', color: 'white', border: 'none',
                padding: '12px 28px', borderRadius: 10, fontWeight: 600,
                fontSize: 15, cursor: 'pointer',
              }}
            >
              🔄 Tải lại trang
            </button>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
              style={{
                background: 'transparent', color: '#3b82f6', border: '2px solid #3b82f6',
                padding: '10px 24px', borderRadius: 10, fontWeight: 600,
                fontSize: 15, cursor: 'pointer',
              }}
            >
              🏠 Về trang chủ
            </button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              marginTop: 24, padding: 16, background: '#fef2f2', borderRadius: 8,
              fontSize: 12, color: '#991b1b', maxWidth: 600, overflow: 'auto', textAlign: 'left',
            }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
