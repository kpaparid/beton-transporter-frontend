import React from "react";
import { Image } from "@themesberg/react-bootstrap";

import ReactLogo from "../assets/img/technologies/react-logo-transparent.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngry,
  faSpinner,
  faTruckLoading,
} from "@fortawesome/free-solid-svg-icons";

export const ComponentPreLoader = ({ show, logo = true }) => {
  return (
    <div
      className={`component-preloader flex-column justify-content-center align-items-center ${
        show ? "" : "show"
      }`}
    >
      <div className="loader-element animate__animated animate__jackInTheBox">
        {logo ? (
          <Image
            className="loader-element animate__animated animate__jackInTheBox"
            src={ReactLogo}
            height={40}
          />
        ) : (
          <FontAwesomeIcon
            style={{ height: "20px", width: "20px" }}
            icon={faSpinner}
          />
        )}
      </div>
    </div>
  );
};
