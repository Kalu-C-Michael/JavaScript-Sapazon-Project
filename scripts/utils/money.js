export function formatCurrency(priceCents) {
  return (Math.round(priceCents * 1500) / 100).toFixed(2);
}

export default formatCurrency;