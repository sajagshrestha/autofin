const NPR_LOCALE = "en";
const DEFAULT_CURRENCY = "NPR";
const nprFormatter = new Intl.NumberFormat(NPR_LOCALE, {
  style: "currency",
  currency: DEFAULT_CURRENCY
});
function formatCurrency(value, currency = DEFAULT_CURRENCY) {
  if (currency !== DEFAULT_CURRENCY) {
    return new Intl.NumberFormat(NPR_LOCALE, {
      style: "currency",
      currency
    }).format(value);
  }
  return nprFormatter.format(value);
}
function formatCurrencyShort(value) {
  const k = value / 1e3;
  const label = k >= 1 ? `${k}k` : value.toString();
  return `${label}`;
}
export {
  formatCurrencyShort as a,
  formatCurrency as f
};
