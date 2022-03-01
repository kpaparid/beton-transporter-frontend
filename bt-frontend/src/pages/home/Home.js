import React, { useEffect, useState } from "react";

import { Navigate } from "react-router";
import Preloader from "../../components/Preloader";
import { useAuth } from "../../contexts/AuthContext";
import { MyRoutes } from "../../routes";

const Home = () => {
  const { currentUser, currentRole, findConnection } = useAuth();
  const [role, setRole] = useState("pending");
  useEffect(() => {
    findConnection()
      .then(() =>
        currentRole.then((r) => {
          r.includes("ROLE_SUPER")
            ? setRole("ROLE_SUPER")
            : r.includes("ROLE_ADMIN")
            ? setRole("ROLE_ADMIN")
            : r.includes("ROLE_USER")
            ? setRole("ROLE_USER")
            : setRole("error");
        })
      )
      .catch((er) => {
        currentUser ? setRole("error") : setRole("noUser-error");
      });
  }, [currentRole, role, findConnection]);
  return (
    <>
      {role === "pending" ? (
        <Preloader show={true} />
      ) : role === "ROLE_ADMIN" || role === "ROLE_SUPER" ? (
        <Navigate to={MyRoutes.DashboardOverview.path} />
      ) : role === "ROLE_USER" ? (
        <Navigate to={MyRoutes.UserHome.path} />
      ) : role === "noUser-error" ? (
        <Navigate to={MyRoutes.Signin.path} />
      ) : (
        <Navigate to={MyRoutes.ServerError.path} />
      )}
    </>
  );
};
export default Home;
