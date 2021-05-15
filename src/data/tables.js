
import { faGoogle, faTwitter, faYahoo, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGlobeEurope, } from '@fortawesome/free-solid-svg-icons';

import USAFlag from '../assets/img/flags/united-states-of-america.svg';
import CanadaFlag from '../assets/img/flags/canada.svg';
import GermanyFlag from '../assets/img/flags/germany.svg';
import FranceFlag from '../assets/img/flags/france.svg';
import JapanFlag from '../assets/img/flags/japan.svg';
import ItalyFlag from '../assets/img/flags/italy.svg';
import moment from "moment-timezone";

const messages = [
    { id: 1, from: "Uwe Schwill", to: "Maik Kyriakos", title: "Merry Christmas Merry Christmas Merry Christmas Merry Christmas Merry Christmas ", mail: "bla bla bla bla bla bla" , date: moment().format("DD.MM.YY"), status: "sent"},
    { id: 2, from: "Kyriakos Pap", to: "Tsafas Litt", title: "Merry Christmas1", mail: "bla 2" , date: moment().format("DD.MM.YY"), status: "received"},
    { id: 3, from: "Tsafas Dimitr", to: "Kyriakos Litt", title: "Merry Christmas2", mail: "bla 3" , date: moment().format("DD.MM.YY"), status: "received"},
    { id: 4, from: "Maik Litt", to: "Maik Pap", title: "Merry Christmas3", mail: "bla 4" , date: moment().format("DD.MM.YY"), status: "received"},
];

const pageVisits = [
    { id: 1, views: 4.525, returnValue: 255, bounceRate: 42.55, pageName: "/demo/admin/index.html" },
    { id: 2, views: 2.987, returnValue: 139, bounceRate: -43.52, pageName: "/demo/admin/forms.html" },
    { id: 3, views: 2.844, returnValue: 124, bounceRate: -32.35, pageName: "/demo/admin/util.html" },
    { id: 4, views: 1.220, returnValue: 55, bounceRate: 15.78, pageName: "/demo/admin/validation.html" },
    { id: 5, views: 505, returnValue: 3, bounceRate: -75.12, pageName: "/demo/admin/modals.html" }
];
const absentTable = [
    { id:1, workerName: "Uwe Schwill", from: 1, to: 2, days: 2, reason:"krank"},
    { id:2, workerName: "Uwe Schwill", from: 2, to: 3, days: 2, reason:"krank mit AU"}
];
const workersTotalHours = [
    { id: 1, hours: 120, workerID: 1, workerName: "Uwe Schwill" },
    { id: 2, hours: 120, workerID: 2, workerName: "Christoph Hoffmann"},
    { id: 3, hours: 120, workerID: 3, workerName: "Maik Litt" },
    { id: 4, hours: 120, workerID: 4, workerName: "Paparidis Kyriakos" }
    
];
const workHours = [
    { id: 1, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "1 May 2021"  },
    { id: 2, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "2 May 2021"},
    { id: 3, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "3 May 2021"},
    { id: 4, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "4 May 2021"},
    { id: 5, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "5 May 2021"},
    { id: 6, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "6 May 2021"},
    { id: 7, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "7 May 2021"},
    { id: 8, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "8 May 2021"},
    { id: 9, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "9 May 2021"},
    { id: 10, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "10 May 2021"},
    { id: 11, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "11 May 2021"},
    { id: 12, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "12 May 2021"},
    { id: 13, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "13 May 2021"},
    { id: 14, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "14 May 2021"},
    { id: 15, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "15 May 2021"},
    { id: 16, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "16 May 2021"},
    { id: 17, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "17 May 2021"},
    { id: 18, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "18 May 2021"},
    { id: 19, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "19 May 2021"},
    { id: 20, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "20 May 2021"},
    { id: 21, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "21 May 2021"},
    { id: 22, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "22 May 2021"},
    { id: 23, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "23 May 2021"},
    { id: 24, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "24 May 2021"},
    { id: 25, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "25 May 2021"},
    { id: 26, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "26 May 2021"},
    { id: 27, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "27 May 2021"},
    { id: 28, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "28 May 2021"},
    { id: 29, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "29 May 2021"},
    { id: 30, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "30 May 2021"},
    { id: 31, workerName: "Uwe Schwill", duration: 9,  start: 8, end: 17, pause: 0.30, day: "Montag", date : "31 May 2021"}
];
const vacationsClaim = [
    { id: 1, workerName: "Uwe Schwill", taken: 22, rest: 4},
    { id: 2, workerName: "Uwe Schwill", taken: 22, rest: 4} ,
    { id: 3, workerName: "Uwe Schwill", taken: 22, rest: 4} ,
    { id: 4, workerName: "Uwe Schwill", taken: 22, rest: 4} ,
    { id: 5, workerName: "Uwe Schwill", taken: 22, rest: 4} ,
    { id: 6, workerName: "Uwe Schwill", taken: 22, rest: 4} 
];
const vacationsOverview = [
    { id: 1, workerName: "Uwe Schwill", from: 22, to: 4, days: 10},
    { id: 2, workerName: "Uwe Schwill", from: 22, to: 4, days: 10},
    { id: 3, workerName: "Uwe Schwill", from: 22, to: 4, days: 10},
    { id: 4, workerName: "Uwe Schwill", from: 22, to: 4, days: 10},
    { id: 5, workerName: "Uwe Schwill", from: 22, to: 4, days: 10},
    { id: 6, workerName: "Uwe Schwill", from: 22, to: 4, days: 10}
];

const workHoursKonto = [
    { id: 1, workerName: "Uwe Schwill", "datum" : "Januar 2021", hours: 5},
    { id: 2, workerName: "Uwe Schwill", "datum" : "Februar 2021", hours: -5},
    { id: 3, workerName: "Uwe Schwill", "datum" : "März 2021", hours: -6},
    { id: 5, workerName: "Uwe Schwill", "datum" : "April 2021", hours: 9},
    { id: 6, workerName: "Uwe Schwill", "datum" : "April 2021", hours: 9},
    { id: 7, workerName: "Uwe Schwill", "datum" : "April 2021", hours: 9},
    { id: 8, workerName: "Uwe Schwill", "datum" : "April 2021", hours: 9},
    { id: 9, workerName: "Uwe Schwill", "datum" : "April 2021", hours: 9},
    { id: 10, workerName: "Uwe Schwill", "datum" : "April 2021", hours: 9},
    { id: 11, workerName: "Uwe Schwill", "datum" : "April 2021", hours: 9},
    { id: 12, workerName: "Uwe Schwill", "datum" : "April 2021", hours: 9}
    
];
const vacation = [
    { id: 1, vacationStart: "10.03.2021", vacationEnd: "10.04.2021", workerName: "Uwe Schwill" },
    { id: 2, vacationStart: "10.04.2021", vacationEnd: "10.05.2021", workerName: "Christoph Hoffmann" },
    { id: 3, vacationStart: "10.05.2021", vacationEnd: "10.06.2021", workerName: "Artur Schipp" },
    { id: 4, vacationStart: "10.06.2021", vacationEnd: "10.07.2021", workerName: "Tsafas Dimitrios" },
    { id: 5, vacationStart: "10.07.2021", vacationEnd: "10.08.2021", workerName: "Maik Litt" },
    { id: 6, vacationStart: "10.08.2021", vacationEnd: "10.09.2021", workerName: "Paparidis Kyriakos" },
    
];

const pageTraffic = [
    { id: 1, source: "Direct", sourceType: "Direct", trafficShare: 51, change: 2.45, sourceIcon: faGlobeEurope, sourceIconColor: "gray" },
    { id: 2, source: "Google Search", sourceType: "Search / Organic", trafficShare: 18, change: 17.67, sourceIcon: faGoogle, sourceIconColor: "info" },
    { id: 3, source: "youtube.com", sourceType: "Social", category: "Arts and Entertainment", rank: 2, trafficShare: 27, sourceIcon: faYoutube, sourceIconColor: "danger" },
    { id: 4, source: "yahoo.com", sourceType: "Referral", category: "News and Media", rank: 11, trafficShare: 8, change: -9.30, sourceIcon: faYahoo, sourceIconColor: "purple" },
    { id: 5, source: "twitter.com", sourceType: "Social", category: "Social Networks", rank: 4, trafficShare: 4, sourceIcon: faTwitter, sourceIconColor: "info" }
];

const pageRanking = [
    { id: 1, country: "United States", countryImage: USAFlag, overallRank: 76, overallRankChange: -5, travelRank: 3, widgetsRank: 32, widgetsRankChange: 3 },
    { id: 2, country: "Canada", countryImage: CanadaFlag, overallRank: 106, overallRankChange: 17, travelRank: 4, widgetsRank: 30, widgetsRankChange: 3 },
    { id: 4, country: "France", countryImage: FranceFlag, overallRank: 112, overallRankChange: 10, travelRank: 5, widgetsRank: 34, widgetsRankChange: 7 },
    { id: 5, country: "Japan", countryImage: JapanFlag, overallRank: 115, overallRankChange: 3, travelRank: 7, travelRankChange: 1, widgetsRank: 39, widgetsRankChange: -2 },
    { id: 3, country: "Germany", countryImage: GermanyFlag, overallRank: 147, overallRankChange: -12, travelRank: 10, travelRankChange: -1, widgetsRank: 12, widgetsRankChange: -5 },
    { id: 6, country: "Italy", countryImage: ItalyFlag, overallRank: 220, overallRankChange: -56, travelRank: 11, travelRankChange: -3, widgetsRank: 89, widgetsRankChange: 2 }
];

const invoiceItems = [
    { id: 1, item: "Origin License", description: "Extended License", price: "999,00", quantity: 1 },
    { id: 2, item: "Custom Services", description: "Instalation and Customization (cost per hour)", price: "150,00", quantity: 20 },
    { id: 3, item: "Hosting", description: "1 year subcription", price: "499,00", quantity: 1 },
    { id: 4, item: "Platinum Support", description: "1 year subcription 24/7", price: "3999,00", quantity: 1 },
];

export {
    pageVisits,
    pageTraffic,
    pageRanking,
    invoiceItems,
    workersTotalHours,
    vacation,
    workHours,
    workHoursKonto,
    vacationsClaim,
    vacationsOverview,
    absentTable,
    messages,
};