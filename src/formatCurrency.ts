export function FormatCurrency(amount: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(amount).split(".")[0].replaceAll("$", "");
}
