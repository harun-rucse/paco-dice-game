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
  if (number === 0) return 0;

  const abbreviations = ["", "k", "M", "B", "T", "Q", "Qu", "S", "Sp", "O"];
  const tier = Math.floor(Math.log10(Math.abs(number)) / 3);
  const scaled = number / Math.pow(10, tier * 3);
  return scaled.toFixed(precession).replace(/\.0$/, "") + abbreviations[tier];
};

export const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  }
};

export const truncateToDecimals = (val, digit = 8) => {
  let str = val;
  if (typeof val === "number") str = val.toString();

  // Find the index of the decimal point
  let decimalIndex = str.indexOf(".");
  // If there is no decimal point or less than 9 characters after it, return the string as is
  if (decimalIndex === -1 || decimalIndex + digit + 1 > str.length) return str;
  // Truncate the string to 8 decimal places
  return str.slice(0, decimalIndex + digit + 1);
};
