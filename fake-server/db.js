var tours = require("./data/tours.json");
var values = require("./data/values.json");
var users = require("./data/users.json");
var workHours = require("./data/workHours.json");
var absent = require("./data/absent.json");
var workHoursBank = require("./data/workHoursBank.json");
var vacations = require("./data/vacations.json");
var vacationsOverview = require("./data/vacationsOverview.json");
var workHoursByDate = require("./data/workHoursByDate.json");
var sales = require("./data/sales.json");
var cbm = require("./data/cbm.json");
// and so on

module.exports = function () {
  return {
    tours,
    users,
    workHours,
    absent,
    values,
    "workhours-bank": workHoursBank,
    vacations,
    "vacations-overview": vacationsOverview,
    "workhours-byDate": workHoursByDate,
    cbm,
    sales,
    // and so on
  };
};
