import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { MyRoutes } from "../routes";

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

const RouteWithLoader = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader show={loaded ? false : true} />
      {children}
    </>
  );
};
const RouteWithSidebar = ({ children }) => {
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
    <>
      <Preloader show={loaded ? false : true} />
      <Sidebar />

      <main className="content p-0 px-sm-2">
        <UserNavbar />
        {children}
        {/* <Footer toggleSettings={toggleSettings} showSettings={showSettings} /> */}
      </main>
    </>
  );
};

function PrivateOutlet() {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to={MyRoutes.Signin.path} />;
}
const HomePage = () => (
  <AuthProvider>
    <Routes>
      <Route path="*" element={<NotFoundPage />}></Route>
      <Route exact path={MyRoutes.Signin.path} element={<Signin />} />
      <Route exact path={MyRoutes.NotFound.path} element={<PrivateOutlet />}>
        <Route exact element={<NotFoundPage />} />
      </Route>
      <Route exact path={MyRoutes.ServerError.path} element={<PrivateOutlet />}>
        <Route exact element={<ServerError />} />
      </Route>
      <Route
        exact
        path={MyRoutes.NotFound.path}
        element={<NotFoundPage />}
      ></Route>
      <Route
        exact
        path={MyRoutes.DashboardOverview.path}
        element={<PrivateOutlet />}
      >
        <Route
          exact
          path={MyRoutes.DashboardOverview.path}
          element={
            <RouteWithSidebar>
              <DashboardOverview />
            </RouteWithSidebar>
          }
        />
      </Route>
      <Route exact path={MyRoutes.Tours.path} element={<PrivateOutlet />}>
        <Route
          exact
          path={MyRoutes.Tours.path}
          element={
            <RouteWithSidebar>
              <Tours />
            </RouteWithSidebar>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.Arbeitszeiten.path}
        element={<PrivateOutlet />}
      >
        <Route
          exact
          path={MyRoutes.Arbeitszeiten.path}
          element={
            <RouteWithSidebar>
              <Arbeitszeiten />
            </RouteWithSidebar>
          }
        />
      </Route>

      <Route exact path={MyRoutes.Nachrichten.path} element={<PrivateOutlet />}>
        <Route
          exact
          path={MyRoutes.Nachrichten.path}
          element={
            <RouteWithSidebar>
              <Nachrichten />
            </RouteWithSidebar>
          }
        />
      </Route>
      <Route exact path={MyRoutes.Settings.path} element={<PrivateOutlet />}>
        <Route
          exact
          path={MyRoutes.Settings.path}
          element={
            <RouteWithSidebar>
              <Settings />
            </RouteWithSidebar>
          }
        />
      </Route>

      {/* <PrivateRoute
        route={RouteWithLoader}
        exact
        path={MyRoutes.Presentation.path}
        component={Presentation}
      />
      <RouteWithLoader exact path={MyRoutes.Signin.path} component={Signin} />
      <PrivateRoute
        route={RouteWithLoader}
        revert
        exact
        path={MyRoutes.Signup.path}
        component={Signup}
      />
      <RouteWithLoader
        exact
        path={MyRoutes.ForgotPassword.path}
        component={ForgotPassword}
      />
      <PrivateRoute
        route={RouteWithLoader}
        exact
        path={MyRoutes.ResetPassword.path}
        component={ResetPassword}
      />
      <PrivateRoute
        route={RouteWithLoader}
        exact
        path={MyRoutes.Lock.path}
        component={Lock}
      />
      <RouteWithLoader
        exact
        path={MyRoutes.NotFound.path}
        component={NotFoundPage}
      />
      <RouteWithLoader
        exact
        path={MyRoutes.ServerError.path}
        component={ServerError}
      />

      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.DashboardOverview.path}
        component={DashboardOverview}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Upgrade.path}
        component={Upgrade}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Tours.path}
        component={Tours}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Arbeitszeiten.path}
        component={Arbeitszeiten}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Nachrichten.path}
        component={Nachrichten}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Settings.path}
        component={Settings}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.BootstrapTables.path}
        component={BootstrapTables}
      />

      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Accordions.path}
        component={Accordion}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Alerts.path}
        component={Alerts}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Badges.path}
        component={Badges}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Breadcrumbs.path}
        component={Breadcrumbs}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Buttons.path}
        component={Buttons}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Forms.path}
        component={Forms}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Modals.path}
        component={Modals}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Navs.path}
        component={Navs}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Navbars.path}
        component={Navbars}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Pagination.path}
        component={Pagination}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Popovers.path}
        component={Popovers}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Progress.path}
        component={Progress}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Tables.path}
        component={Tables}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Tabs.path}
        component={Tabs}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Tooltips.path}
        component={Tooltips}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.Toasts.path}
        component={Toasts}
      />

      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.DocsOverview.path}
        component={DocsOverview}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.DocsDownload.path}
        component={DocsDownload}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.DocsQuickStart.path}
        component={DocsQuickStart}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.DocsLicense.path}
        component={DocsLicense}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.DocsFolderStructure.path}
        component={DocsFolderStructure}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.DocsBuild.path}
        component={DocsBuild}
      />
      <PrivateRoute
        route={RouteWithSidebar}
        exact
        path={MyRoutes.DocsChangelog.path}
        component={DocsChangelog}
      />

      <Navigate to={MyRoutes.NotFound.path} /> */}
    </Routes>
  </AuthProvider>
);

export default HomePage;
