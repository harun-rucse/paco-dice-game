const { addHours, startOfDay, isAfter, addDays, subDays } = require("date-fns");

const currentDate = new Date();
const currentDateAt3AM = isAfter(
  currentDate,
  addHours(startOfDay(currentDate), 3)
)
  ? subDays(startOfDay(currentDate), 1)
  : startOfDay(currentDate);
const nextDateAt3AM = addHours(startOfDay(addDays(currentDateAt3AM, 1)), 3);

// const currentDateAt3AM = new Date();
// currentDateAt3AM.setHours(3, 0, 0, 0);

const currentDateAt1159PM = new Date();
currentDateAt1159PM.setHours(23, 59, 59);

const previousDateAt3AM = new Date();
previousDateAt3AM.setDate(previousDateAt3AM.getDate() - 1);
previousDateAt3AM.setHours(3, 0, 0, 0);

const previousDateAt1159PM = new Date();
previousDateAt1159PM.setDate(previousDateAt1159PM.getDate() - 1);
previousDateAt1159PM.setHours(23, 59, 59);

// const nextDateAt3AM = new Date();
// nextDateAt3AM.setDate(nextDateAt3AM.getDate() + 1);
// nextDateAt3AM.setHours(3, 0, 0, 0);

const date = {
  currentDateAt3AM,
  previousDateAt3AM,
  nextDateAt3AM,
  currentDateAt1159PM,
  previousDateAt1159PM,
};

module.exports = { date };
