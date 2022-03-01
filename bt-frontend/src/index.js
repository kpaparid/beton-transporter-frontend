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

// vendor styles
import "@fortawesome/fontawesome-free/css/all.css";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/home/HomePage";
import { createReduxStore } from "./pages/reducers/redux";
import "./scss/volt.scss";

ReactDOM.render(
  <Provider store={createReduxStore()}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <HashRouter>
        <RecoilRoot>
          <ScrollToTop />
          <HomePage />
        </RecoilRoot>
      </HashRouter>
    </LocalizationProvider>
  </Provider>,
  document.getElementById("root")
);
