export function formatPrice(price: number) {
  return price.toLocaleString("en-AU", { style: "currency", currency: "AUD" });
}
