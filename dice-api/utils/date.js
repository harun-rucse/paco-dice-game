const currentDate = new Date();
currentDate.setHours(3, 0, 0, 0);

const previousDate = new Date();
previousDate.setDate(previousDate.getDate() - 1);
previousDate.setHours(3, 0, 0, 0);

const nextDate = new Date();
nextDate.setDate(nextDate.getDate() + 1);
nextDate.setHours(3, 0, 0, 0);

const date = {
  currentDateAt3AM: currentDate,
  previousDateAt3AM: previousDate,
  nextDateAt3AM: nextDate,
};

module.exports = { date };
