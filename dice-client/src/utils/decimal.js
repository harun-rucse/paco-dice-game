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
export function subtract(...values) {
  const resultSubtraction = values.reduce((accumulator, currentValue) => {
    const num = new Decimal(currentValue);
    return accumulator.minus(num);
  }, new Decimal(0));

  return resultSubtraction.toString();
}

// Multiplication
export function multiply(...values) {
  const resultMultiplication = values.reduce((accumulator, currentValue) => {
    const num = new Decimal(currentValue);
    return accumulator.times(num);
  }, new Decimal(1)); // Start with 1 for multiplication

  return resultMultiplication.toString();
}

// Division
export function divide(...values) {
  const resultDivision = values.reduce((accumulator, currentValue) => {
    const num = new Decimal(currentValue);
    return accumulator.dividedBy(num);
  }, new Decimal(1)); // Start with 1 for division

  return resultDivision.toString();
}
