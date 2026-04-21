// Product image system - generates brand-colored product cards with icons
// This approach is 100% reliable (no external CDN dependencies)

const brandThemes = {
  'Samsung': { bg: '#1428a0', accent: '#4d8af0', icon: '📱' },
  'Apple':   { bg: '#1d1d1f', accent: '#a1a1a6', icon: '🍎' },
  'Xiaomi':  { bg: '#ff6900', accent: '#ffaa5c', icon: '📱' },
  'OPPO':    { bg: '#1a8a3e', accent: '#4dd97c', icon: '📱' },
  'ASUS':    { bg: '#00539b', accent: '#3da5f5', icon: '💻' },
  'Dell':    { bg: '#007db8', accent: '#5bc0f5', icon: '💻' },
  'Lenovo':  { bg: '#e1251b', accent: '#ff7b73', icon: '💻' },
  'HP':      { bg: '#0096d6', accent: '#66c8f0', icon: '💻' },
};

// Category icons for SVG
const categoryIcons = {
  1: { // Smartphone
    path: `<rect x="85" y="40" width="70" height="130" rx="12" fill="white" opacity="0.15"/>
           <rect x="90" y="50" width="60" height="100" rx="4" fill="white" opacity="0.1"/>
           <circle cx="120" cy="160" r="5" fill="white" opacity="0.2"/>
           <rect x="105" y="44" width="30" height="4" rx="2" fill="white" opacity="0.15"/>`,
  },
  2: { // Laptop
    path: `<rect x="60" y="55" width="120" height="80" rx="6" fill="white" opacity="0.15"/>
           <rect x="65" y="60" width="110" height="65" rx="2" fill="white" opacity="0.1"/>
           <path d="M45 140 L195 140 L185 150 L55 150 Z" fill="white" opacity="0.15"/>`,
  },
};

/**
 * Generate an SVG data URI for a product card image
 */
function generateProductSVG(product) {
  const brand = product.brand || 'Unknown';
  const theme = brandThemes[brand] || { bg: '#6366f1', accent: '#a5b4fc', icon: '📦' };
  const catId = product.categoryId || (product.categoryName === 'Laptop' ? 2 : 1);
  const iconSVG = categoryIcons[catId]?.path || categoryIcons[1].path;
  
  // Shorten product name for display
  const displayName = product.name || 'Product';
  const lines = displayName.length > 18 
    ? [displayName.substring(0, 18), displayName.substring(18).trim()]
    : [displayName];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="200" viewBox="0 0 240 200">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bg}"/>
        <stop offset="100%" stop-color="${adjustColor(theme.bg, 30)}"/>
      </linearGradient>
      <radialGradient id="glow" cx="70%" cy="30%" r="60%">
        <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="240" height="200" fill="url(#bg)"/>
    <rect width="240" height="200" fill="url(#glow)"/>
    <circle cx="200" cy="30" r="50" fill="white" opacity="0.04"/>
    <circle cx="30" cy="180" r="40" fill="white" opacity="0.03"/>
    ${iconSVG}
    <text x="120" y="${lines.length > 1 ? 185 : 190}" text-anchor="middle" fill="white" opacity="0.5" font-family="Inter,Arial,sans-serif" font-size="10" font-weight="600" letter-spacing="1">${brand.toUpperCase()}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Lighten/darken a hex color
 */
function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

/**
 * Get a product image URL.
 * Always returns a valid image (SVG fallback)
 */
export function getProductImage(product) {
  if (!product) return null;
  
  // If backend provides a valid full URL, use it
  if (product.imageUrl && product.imageUrl.startsWith('http')) {
    return product.imageUrl;
  }
  
  // If backend provides a local path (e.g. /images/products/xxx.jpg), use it
  if (product.imageUrl && product.imageUrl.startsWith('/images/')) {
    return product.imageUrl;
  }
  
  // Generate brand-styled SVG image
  return generateProductSVG(product);
}

export { brandThemes };
