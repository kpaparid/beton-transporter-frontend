import React, { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Preloader from "../../components/Preloader";
import Sidebar from "../../components/Sidebar";
import {
  default as Sidebar2,
  default as Sidebar3,
} from "../../components/Sidebar2";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { MyRoutes } from "../../routes";
import AddUser from "../authentication/AddUser";
import NotFound from "../authentication/NotFound";
import ServerError from "../authentication/ServerError";
import Signin from "../authentication/Signin";
import Chat from "../messages/Chat";
import UserChat from "../messages/UserChat";
import UserMessenger from "../messages/UserMessenger";
import DashboardOverview from "../overview/DashboardOverview";
import UserOverview from "../overview/UserOverview";
import Settings from "../settings/Settings";
import Users from "../settings/Users";
import UserSettings from "../settings/UserSettings";
import UserVacations from "../vacations/UserVacations";
import DashboardWorkHours from "../workHours/DashboardWorkHours";
import UserWorkHours from "../workHours/UserWorkHours";
import AddTours from "./../tours/AddTours";
import DashboardTours from "./../tours/DashboardTours";
import UserTours from "./../tours/UserTours";
import AddWorkHour from "./../workHours/AddWorkHours";
import Home from "./Home";
import UserHome from "./UserHome";

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

      <main
        className="content p-0 h-100 d-flex"
        style={{ flexDirection: "column" }}
      >
        <Sidebar />
        <div className="d-flex h-100 justify-content-center p-1 p-sm-3">
          {children}
        </div>

        {/* <Footer toggleSettings={toggleSettings} showSettings={showSettings} /> */}
      </main>
    </>
  );
};

const RouteWithSidebarPhone = ({ children }) => {
  return (
    <>
      <main
        className="p-0 h-100 d-flex overflow-auto bg-darker-nonary"
        style={{ flexDirection: "column" }}
      >
        <div className="w-100">
          <Sidebar3 />
        </div>
        <div style={{ flex: "1 1" }}>{children}</div>
        {/* <div>{children}</div> */}
      </main>
    </>
  );
};
const RouteWithoutSiderBar = ({ children }) => {
  return (
    <>
      <main
        className="p-0 h-100 d-flex overflow-auto bg-darker-nonary"
        style={{ flexDirection: "column" }}
      >
        <div className="h-100">{children}</div>
      </main>
    </>
  );
};

function PrivateOutlet({ role = [] }) {
  const { currentUser, currentRole, findConnection } = useAuth();
  const [backendConnection, setBackendConnection] = useState("pending");
  useEffect(() => {
    findConnection()
      .then((res) => {
        currentRole.then((r) => {
          const auth = r.reduce(
            (a, b) => a || role.includes(b) || b === "ROLE_SUPER",
            false
          );
          auth ? setBackendConnection("loaded") : setBackendConnection("error");
        });
      })
      .catch((er) => {
        setBackendConnection("error");
      });
  }, [currentRole, role, findConnection]);

  return currentUser ? (
    backendConnection === "pending" ? (
      <Preloader show={true} />
    ) : backendConnection === "loaded" ? (
      <Outlet />
    ) : (
      <Navigate to={MyRoutes.ServerError.path} />
    )
  ) : (
    <Navigate to={MyRoutes.Signin.path} />
  );
}
const HomePage = () => (
  <AuthProvider>
    <Routes>
      {/* <Route path="*" element={<NotFound />}></Route> */}
      <Route exact path={MyRoutes.Home.path} element={<Home />} />
      <Route exact path={MyRoutes.Signin.path} element={<Signin />} />
      <Route exact path={MyRoutes.ServerError.path} element={<ServerError />} />
      <Route exact path={MyRoutes.NotFound.path} element={<NotFound />}>
        <Route exact element={<NotFound />} />
      </Route>
      <Route
        exact
        path={MyRoutes.DashboardOverview.path}
        element={<PrivateOutlet role={["ROLE_ADMIN"]} />}
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
      <Route
        exact
        path={MyRoutes.UserHome.path}
        element={<PrivateOutlet role={["ROLE_ADMIN", "ROLE_DRIVER"]} />}
      >
        <Route
          exact
          path={MyRoutes.UserHome.path}
          element={
            <RouteWithoutSiderBar>
              <UserHome />
            </RouteWithoutSiderBar>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.UserTours.path}
        element={<PrivateOutlet role={["ROLE_ADMIN", "ROLE_DRIVER"]} />}
      >
        <Route
          exact
          path={MyRoutes.UserTours.path}
          element={
            <RouteWithSidebarPhone>
              <UserTours />
            </RouteWithSidebarPhone>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.UserOverview.path}
        element={<PrivateOutlet role={["ROLE_ADMIN", "ROLE_DRIVER"]} />}
      >
        <Route
          exact
          path={MyRoutes.UserOverview.path}
          element={
            <RouteWithSidebarPhone>
              <UserOverview />
            </RouteWithSidebarPhone>
          }
        />
      </Route>

      <Route
        exact
        path={MyRoutes.UserSettings.path}
        element={<PrivateOutlet role={["ROLE_ADMIN", "ROLE_DRIVER"]} />}
      >
        <Route
          exact
          path={MyRoutes.UserSettings.path}
          element={
            <RouteWithSidebarPhone>
              <UserSettings />
            </RouteWithSidebarPhone>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.AddTour.path}
        element={<PrivateOutlet role={["ROLE_ADMIN", "ROLE_DRIVER"]} />}
      >
        <Route
          exact
          path={MyRoutes.AddTour.path}
          element={
            <RouteWithSidebarPhone>
              <AddTours />
            </RouteWithSidebarPhone>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.AddWorkHours.path}
        element={<PrivateOutlet role={["ROLE_ADMIN", "ROLE_DRIVER"]} />}
      >
        <Route
          exact
          path={MyRoutes.AddWorkHours.path}
          element={
            <RouteWithSidebarPhone>
              <AddWorkHour />
            </RouteWithSidebarPhone>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.UserVacations.path}
        element={<PrivateOutlet role={["ROLE_ADMIN", "ROLE_DRIVER"]} />}
      >
        <Route
          exact
          path={MyRoutes.UserVacations.path}
          element={
            <RouteWithSidebarPhone>
              <UserVacations />
            </RouteWithSidebarPhone>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.UserWorkHours.path}
        element={<PrivateOutlet role={["ROLE_ADMIN", "ROLE_DRIVER"]} />}
      >
        <Route
          exact
          path={MyRoutes.UserWorkHours.path}
          element={
            <RouteWithSidebarPhone>
              <UserWorkHours />
            </RouteWithSidebarPhone>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.DashboardTours.path}
        element={<PrivateOutlet role={["ROLE_ADMIN"]} />}
      >
        <Route
          exact
          path={MyRoutes.DashboardTours.path}
          element={
            <RouteWithSidebar>
              <DashboardTours />
            </RouteWithSidebar>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.Users.path}
        element={<PrivateOutlet role={["ROLE_ADMIN"]} />}
      >
        <Route
          exact
          path={MyRoutes.Users.path}
          element={
            <RouteWithSidebar>
              <Users />
            </RouteWithSidebar>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.DashboardWorkHours.path}
        element={<PrivateOutlet role={["ROLE_ADMIN"]} />}
      >
        <Route
          exact
          path={MyRoutes.DashboardWorkHours.path}
          element={
            <RouteWithSidebar>
              <DashboardWorkHours />
            </RouteWithSidebar>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.Chat.path}
        element={<PrivateOutlet role={["ROLE_ADMIN"]} />}
      >
        <Route
          exact
          path={MyRoutes.Chat.path}
          element={
            <RouteWithSidebar>
              <Chat />
            </RouteWithSidebar>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.UserMessenger.path}
        element={<PrivateOutlet role={["ROLE_ADMIN", "ROLE_USER"]} />}
      >
        <Route
          exact
          path={MyRoutes.UserMessenger.path}
          element={
            <RouteWithSidebarPhone>
              <UserMessenger />
            </RouteWithSidebarPhone>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.UserChat.path}
        element={<PrivateOutlet role={["ROLE_ADMIN", "ROLE_USER"]} />}
      >
        <Route
          exact
          path={MyRoutes.UserChat.path}
          element={
            <RouteWithoutSiderBar>
              <UserChat />
            </RouteWithoutSiderBar>
          }
        />
      </Route>
      <Route
        exact
        path={MyRoutes.AddUser.path}
        element={<PrivateOutlet role={["ROLE_ADMIN"]} />}
      >
        <Route
          exact
          path={MyRoutes.AddUser.path}
          element={<RouteWithSidebar>{<AddUser />}</RouteWithSidebar>}
        />
      </Route>
      <Route
        exact
        path={MyRoutes.Settings.path}
        element={<PrivateOutlet role={["ROLE_ADMIN"]} />}
      >
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
    </Routes>
  </AuthProvider>
);

export default HomePage;
