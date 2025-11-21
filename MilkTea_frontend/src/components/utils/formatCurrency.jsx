export const formatCurrency = (value = 0) => {
  const number = Number(value) || 0;
  return number.toLocaleString('vi-VN') + 'đ';
};
