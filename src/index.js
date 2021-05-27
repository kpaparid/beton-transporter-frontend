// =========================================================
// * Volt React Dashboard
// =========================================================

// * Product Page: https://themesberg.com/product/dashboard/volt-react
// * Copyright 2021 Themesberg (https://www.themesberg.com)
// * Official Repository: https://github.com/themesberg/volt-react-dashboard
// * License: MIT License (https://themesberg.com/licensing)

// * Designed and coded by https://themesberg.com

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. Please contact us to request a removal.

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux"


// core styles
import "./scss/volt.scss";


// vendor styles
import "@fortawesome/fontawesome-free/css/all.css";
import "react-datetime/css/react-datetime.css";

// import "./scss/kpaparid/components/mycalendarstyles.css";

import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";
import { createReduxStore } from './pages/reducers/redux';

// import "react-dates/initialize";
// import "react-dates/lib/css/_datepicker.css";




ReactDOM.render(

  <Provider store={createReduxStore()}>
    <HashRouter>
      <ScrollToTop />
      <HomePage />
    </HashRouter>

  </Provider>
  ,
  document.getElementById("root")
);
