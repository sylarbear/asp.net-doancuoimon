import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Spin, Select, Input, Skeleton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { productAPI, categoryAPI } from '../api';
import { formatVND } from '../utils';
import { getProductImage } from '../productImages';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');

  useEffect(() => {
    categoryAPI.getAll().then(res => setCategories(res.data.data || []));
  }, []);

  // Debounce search input - wait 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (categoryId) params.categoryId = parseInt(categoryId);
    productAPI.getAll(params).then(res => {
      const pData = res.data.data;
      setProducts(Array.isArray(pData) ? pData : (pData?.data || pData?.items || []));
    }).finally(() => setLoading(false));
  }, [debouncedSearch, categoryId]);

  return (
    <div className="app-content">
      <h1 className="section-title">📱 Tất cả sản phẩm</h1>

      {/* Filters */}
      <div className="filter-bar">
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
          options={categories.map(c => ({ label: c.name, value: String(c.id) }))}
        />
      </div>

      {loading ? (
        <div className="product-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="product-card">
              <Skeleton.Image active style={{ width: '100%', height: 200 }} />
              <div style={{ padding: 16 }}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--gray-500)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(p => {
            const imgUrl = getProductImage(p);
            return (
              <Link to={`/products/${p.id}`} key={p.id} className="product-card fade-in" style={{ textDecoration: 'none' }}>
                <div className="card-img">
                  {imgUrl ? <img src={imgUrl} alt={p.name} loading="lazy" /> : <span className="card-img-fallback">{p.categoryId === 2 ? '💻' : '📱'}</span>}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
