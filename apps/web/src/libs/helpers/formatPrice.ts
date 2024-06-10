export function formatPrice(number: number) {
  return Number(number).toLocaleString('en-US', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
  });
}

export function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number
) {
  // Calculate the difference between original and discounted price
  const discountAmount = originalPrice - discountedPrice;

  // Calculate the percentage discount
  const discountPercentage = (discountAmount / originalPrice) * 100;

  // Return the percentage discount
  return discountPercentage;
}
