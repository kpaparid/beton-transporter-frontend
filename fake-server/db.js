var tours = require("./data/tours.json");
var users = require("./data/users.json");
var workHours = require("./data/workHours.json");
var absent = require("./data/absent.json");
var workHoursBank = require("./data/workHoursBank.json");
var vacationsOverview = require("./data/vacationsOverview.json");
// and so on

module.exports = function () {
  return {
    tours,
    users,
    workHours,
    absent,
    "workHours-bank": workHoursBank,
    "vacations-overview": vacationsOverview,
    // and so on
  };
};
