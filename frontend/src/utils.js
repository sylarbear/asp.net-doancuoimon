export const formatVND = (amount) => {
  if (amount == null) return '0₫';
  return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
};

export const getStatusColor = (status) => {
  const map = {
    Pending: 'orange', Confirmed: 'blue', Shipping: 'purple',
    Delivered: 'cyan', Completed: 'green', Cancelled: 'red',
  };
  return map[status] || 'default';
};

export const getStatusText = (status) => {
  const map = {
    Pending: 'Chờ xử lý', Confirmed: 'Đã xác nhận', Shipping: 'Đang giao',
    Delivered: 'Đã giao', Completed: 'Hoàn thành', Cancelled: 'Đã hủy',
  };
  return map[status] || status;
};

export const getTierConfig = (tier) => {
  const map = {
    Bronze: { color: '#92400e', bg: '#fef3c7', icon: '🥉' },
    Silver: { color: '#475569', bg: '#e2e8f0', icon: '🥈' },
    Gold: { color: '#b45309', bg: '#fef3c7', icon: '🥇' },
    Diamond: { color: '#6d28d9', bg: '#ede9fe', icon: '💎' },
  };
  return map[tier] || map.Bronze;
};
