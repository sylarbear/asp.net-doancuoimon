import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Spin, Select, Input, Skeleton, Tag } from 'antd';
import { SearchOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { productAPI, categoryAPI } from '../api';
import { formatVND } from '../utils';
import { getProductImage } from '../productImages';

const PRICE_RANGES = [
  { label: 'Tất cả', value: '' },
  { label: 'Dưới 5 triệu', value: '0-5000000' },
  { label: '5 - 10 triệu', value: '5000000-10000000' },
  { label: '10 - 20 triệu', value: '10000000-20000000' },
  { label: '20 - 30 triệu', value: '20000000-30000000' },
  { label: 'Trên 30 triệu', value: '30000000-999999999' },
];

const SORT_OPTIONS = [
  { label: '🔥 Mặc định', value: '' },
  { label: '💰 Giá thấp → cao', value: 'price-asc' },
  { label: '💎 Giá cao → thấp', value: 'price-desc' },
  { label: '🆕 Mới nhất', value: 'newest' },
  { label: '⭐ Tên A → Z', value: 'name-asc' },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    categoryAPI.getAll().then(res => setCategories(res.data.data || []));
  }, []);

  // Sync search from URL params (for header search bar)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== search) {
      setSearch(urlSearch);
      setDebouncedSearch(urlSearch);
    }
  }, [searchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = { pageSize: 100 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (categoryId) params.categoryId = parseInt(categoryId);
    productAPI.getAll(params).then(res => {
      const pData = res.data.data;
      setProducts(Array.isArray(pData) ? pData : (pData?.data || pData?.items || []));
    }).finally(() => setLoading(false));
  }, [debouncedSearch, categoryId]);

  // Client-side price filter + sort
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Price filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); break;
      case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    return filtered;
  };

  const filtered = getFilteredProducts();

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
          style={{ maxWidth: 280, borderRadius: 10 }}
          size="large"
          allowClear
        />
        <Select
          placeholder="Danh mục"
          value={categoryId || undefined}
          onChange={v => setCategoryId(v || '')}
          allowClear
          style={{ minWidth: 160 }}
          size="large"
          options={categories.map(c => ({ label: c.name, value: String(c.id) }))}
        />
        <Select
          placeholder="Khoảng giá"
          value={priceRange || undefined}
          onChange={v => setPriceRange(v || '')}
          allowClear
          style={{ minWidth: 170 }}
          size="large"
          suffixIcon={<FilterOutlined />}
          options={PRICE_RANGES}
        />
        <Select
          placeholder="Sắp xếp"
          value={sortBy || undefined}
          onChange={v => setSortBy(v || '')}
          allowClear
          style={{ minWidth: 180 }}
          size="large"
          suffixIcon={<SortAscendingOutlined />}
          options={SORT_OPTIONS}
        />
      </div>

      {/* Active filters summary */}
      {(priceRange || sortBy) && (
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>{filtered.length} sản phẩm</span>
          {priceRange && <Tag closable onClose={() => setPriceRange('')} color="blue">{PRICE_RANGES.find(r => r.value === priceRange)?.label}</Tag>}
          {sortBy && <Tag closable onClose={() => setSortBy('')} color="purple">{SORT_OPTIONS.find(s => s.value === sortBy)?.label}</Tag>}
        </div>
      )}

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
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--gray-500)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map(p => {
            const imgUrl = getProductImage(p);
            return (
              <Link to={`/products/${p.id}`} key={p.id} className="product-card fade-in" style={{ textDecoration: 'none' }}>
                <div className="card-img">
                  {imgUrl ? <img src={imgUrl} alt={p.name} loading="lazy" /> : <span className="card-img-fallback">{p.categoryId === 2 ? '💻' : '📱'}</span>}
                  {/* Badges */}
                  <div className="card-badges">
                    {p.stockQuantity === 0 && <span className="badge badge-out">Hết hàng</span>}
                    {p.stockQuantity > 0 && p.stockQuantity <= 5 && <span className="badge badge-hot">Sắp hết</span>}
                    {p.price >= 20000000 && <span className="badge badge-premium">Premium</span>}
                  </div>
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
