import Decimal from "decimal.js";

// Addition
export function addition(...values) {
  const resultAddition = values.reduce((accumulator, currentValue) => {
    const num = new Decimal(currentValue);
    return accumulator.plus(num);
  }, new Decimal(0));

  return resultAddition.toString();
}

// Subtraction
export function subtract(value1, value2) {
  const num1 = new Decimal(value1);
  const num2 = new Decimal(value2);
  const resultSubtraction = num1.minus(num2);

  return resultSubtraction.toString();
}

// Multiplication
export function multiply(value1, value2) {
  const num1 = new Decimal(value1);
  const num2 = new Decimal(value2);
  const resultMultiplication = num1.times(num2);

  return resultMultiplication.toString();
}

// Division
export function divide(value1, value2) {
  const num1 = new Decimal(value1);
  const num2 = new Decimal(value2);
  const resultDivision = num1.dividedBy(num2);

  return resultDivision.toString();
}
