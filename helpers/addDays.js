module.exports = function addDays(date, days) {
  date.setDate(date.getDate() + days);
  return date;
};
