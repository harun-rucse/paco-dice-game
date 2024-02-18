export const numberFormat = (val) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
    minimumIntegerDigits: 1,
  }).format(val);
};

export const currencyFormat = (val) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val);
};

export const padNumber = (number, digit) => {
  return String(number).padStart(digit, "0");
};
