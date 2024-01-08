const Decimal = require("decimal.js");

// Addition
function addition(...values) {
  const resultAddition = values.reduce((accumulator, currentValue) => {
    const num = new Decimal(currentValue);
    return accumulator.plus(num);
  }, new Decimal(0));

  return resultAddition.toString();
}

// Subtraction
function subtract(value1, value2) {
  const num1 = new Decimal(value1);
  const num2 = new Decimal(value2);
  const resultSubtraction = num1.minus(num2);

  return resultSubtraction.toString();
}

// Multiplication
function multiply(value1, value2) {
  const num1 = new Decimal(value1);
  const num2 = new Decimal(value2);
  const resultMultiplication = num1.times(num2);

  return resultMultiplication.toString();
}

// Division
function divide(value1, value2) {
  const num1 = new Decimal(value1);
  const num2 = new Decimal(value2);
  const resultDivision = num1.dividedBy(num2);

  return resultDivision.toString();
}

// Compare
function compare(value1, value2, type) {
  const num1 = new Decimal(value1);
  const num2 = new Decimal(value2);

  return type === "gt" ? num1.gt(num2) : num1.lt(num2);
}

module.exports = {
  addition,
  subtract,
  multiply,
  divide,
  compare,
};
