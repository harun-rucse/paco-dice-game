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

export const abbreviateNumber = (number, precession = 1) => {
  const abbreviations = ["", "k", "M", "B", "T", "Q", "Qu", "S", "Sp", "O"];
  const tier = Math.floor(Math.log10(Math.abs(number)) / 3);
  const scaled = number / Math.pow(10, tier * 3);
  return scaled.toFixed(precession).replace(/\.0$/, "") + abbreviations[tier];
};
