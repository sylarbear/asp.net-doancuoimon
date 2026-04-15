import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Spin, Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { productAPI, categoryAPI } from '../api';
import { formatVND } from '../utils';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');

  useEffect(() => {
    categoryAPI.getAll().then(res => setCategories(res.data.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    productAPI.getAll(params).then(res => {
      const pData = res.data.data;
      setProducts(Array.isArray(pData) ? pData : (pData?.data || pData?.items || []));
    }).finally(() => setLoading(false));
  }, [search, categoryId]);

  return (
    <div className="app-content">
      <h1 className="section-title">📱 Tất cả sản phẩm</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 320, borderRadius: 10 }}
          size="large"
          allowClear
        />
        <Select
          placeholder="Danh mục"
          value={categoryId || undefined}
          onChange={v => setCategoryId(v || '')}
          allowClear
          style={{ minWidth: 180 }}
          size="large"
          options={categories.map(c => ({ label: c.name, value: c.id }))}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--gray-500)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(p => (
            <Link to={`/products/${p.id}`} key={p.id} className="product-card fade-in" style={{ textDecoration: 'none' }}>
              <div className="card-img">
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} /> : '📦'}
              </div>
              <div className="card-body">
                <div className="card-brand">{p.brand}</div>
                <div className="card-name">{p.name}</div>
                <div className="card-price">{formatVND(p.price)}</div>
                <div className="card-stock">
                  {p.stockQuantity > 0 ? `Còn ${p.stockQuantity}` : <span style={{ color: 'var(--red)' }}>Hết hàng</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
