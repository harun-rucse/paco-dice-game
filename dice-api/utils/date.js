const { addHours, startOfDay, isAfter, addDays, subDays } = require("date-fns");

const currentDate = new Date();
const todaysDate = isAfter(currentDate, addHours(startOfDay(currentDate), 3))
  ? addHours(startOfDay(currentDate), 3)
  : addHours(subDays(startOfDay(currentDate), 1), 3);
const nextDate = addHours(startOfDay(addDays(todaysDate, 1)), 3);
const previousDate = addHours(startOfDay(subDays(todaysDate, 1)), 3);

const date = {
  todaysDate,
  nextDate,
  previousDate,
};

module.exports = { date };
