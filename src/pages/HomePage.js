import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";

// pages
import Presentation from "./Presentation";
import Upgrade from "./Upgrade";
import DashboardOverview from "./DashboardOverview";
import { Tours } from "./Tours";
import Arbeitszeiten from "./Arbeitszeiten";
import Nachrichten from "./Nachrichten";
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";

// documentation pages
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsLicense from "./documentation/DocsLicense";
import DocsFolderStructure from "./documentation/DocsFolderStructure";
import DocsBuild from "./documentation/DocsBuild";
import DocsChangelog from "./documentation/DocsChangelog";

// components
import Sidebar from "../components/Sidebar";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";
import { AuthProvider, useAuth } from "./../contexts/AuthContext";

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          <Preloader show={loaded ? false : true} /> <Component {...props} />
        </>
      )}
    />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem("settingsVisible") === "false" ? false : true;
  };

  const [showSettings, setShowSettings] = useState(
    localStorageIsSettingsVisible
  );

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem("settingsVisible", !showSettings);
  };

  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          <Preloader show={loaded ? false : true} />
          <Sidebar />

          <main className="content p-0 px-sm-2">
            <UserNavbar />
            <Component {...props} />
            <Footer
              toggleSettings={toggleSettings}
              showSettings={showSettings}
            />
          </main>
        </>
      )}
    />
  );
};
function PrivateRoute({
  component: Component,
  revert = false,
  route: CustomRoute,
  ...rest
}) {
  const { currentUser } = useAuth();
  const c = !revert && currentUser;
  return currentUser ? (
    <CustomRoute {...rest} component={Component}></CustomRoute>
  ) : (
    <Redirect to={Routes.Signin.path} />
  );
}
const HomePage = () => (
  <AuthProvider>
    <Switch>
      <PrivateRoute
        route={RouteWithLoader}
        exact
        path={Routes.Presentation.path}
        component={Presentation}
      />
      <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />
      <PrivateRoute
        route={RouteWithLoader}
        revert
        exact
        path={Routes.Signup.path}
        component={Signup}
      />
      <RouteWithLoader
        exact
        path={Routes.ForgotPassword.path}
        component={ForgotPassword}
      />
      <PrivateRoute
        route={RouteWithLoader}
        exact
        path={Routes.ResetPassword.path}
        component={ResetPassword}
      />
      <PrivateRoute
        route={RouteWithLoader}
        exact
        path={Routes.Lock.path}
        component={Lock}
      />
      <RouteWithLoader
        exact
        path={Routes.NotFound.path}
        component={NotFoundPage}
      />
      <RouteWithLoader
        exact
        path={Routes.ServerError.path}
        component={ServerError}
      />

      {/* pages */}
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.DashboardOverview.path}
        component={DashboardOverview}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Upgrade.path}
        component={Upgrade}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Tours.path}
        component={Tours}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Arbeitszeiten.path}
        component={Arbeitszeiten}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Nachrichten.path}
        component={Nachrichten}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Settings.path}
        component={Settings}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.BootstrapTables.path}
        component={BootstrapTables}
      />

      {/* components */}
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Accordions.path}
        component={Accordion}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Alerts.path}
        component={Alerts}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Badges.path}
        component={Badges}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Breadcrumbs.path}
        component={Breadcrumbs}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Buttons.path}
        component={Buttons}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Forms.path}
        component={Forms}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Modals.path}
        component={Modals}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Navs.path}
        component={Navs}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Navbars.path}
        component={Navbars}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Pagination.path}
        component={Pagination}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Popovers.path}
        component={Popovers}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Progress.path}
        component={Progress}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Tables.path}
        component={Tables}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Tabs.path}
        component={Tabs}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Tooltips.path}
        component={Tooltips}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.Toasts.path}
        component={Toasts}
      />

      {/* documentation */}
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.DocsOverview.path}
        component={DocsOverview}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.DocsDownload.path}
        component={DocsDownload}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.DocsQuickStart.path}
        component={DocsQuickStart}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.DocsLicense.path}
        component={DocsLicense}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.DocsFolderStructure.path}
        component={DocsFolderStructure}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.DocsBuild.path}
        component={DocsBuild}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={Routes.DocsChangelog.path}
        component={DocsChangelog}
      />

      <Redirect to={Routes.NotFound.path} />
    </Switch>
  </AuthProvider>
);
export default HomePage;
