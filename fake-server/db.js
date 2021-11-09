var tours = require("./data/tours.json");
var values = require("./data/values.json");
var users = require("./data/users.json");
var workHours = require("./data/workHours.json");
var absent = require("./data/absent.json");
var workHoursBank = require("./data/workHoursBank.json");
var vacations = require("./data/vacations.json");
var vacationsOverview = require("./data/vacationsOverview.json");
// and so on

module.exports = function () {
  return {
    tours,
    users,
    workHours,
    absent,
    values,
    "workHours-bank": workHoursBank,
    vacations,
    "vacations-overview": vacationsOverview,
    // and so on
  };
};
