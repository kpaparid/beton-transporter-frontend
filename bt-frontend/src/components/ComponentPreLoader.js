import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image } from "@themesberg/react-bootstrap";
import React from "react";
import ReactLogo from "../assets/img/technologies/react-logo-transparent.svg";

export const ComponentPreLoader = ({ show = true, logo = true }) => {
  return (
    <div
      className={`component-preloader h-100 flex-column justify-content-center align-items-center ${
        show ? "" : "show"
      }`}
    >
      <div className="loader-element animate__animated animate__jackInTheBox">
        {logo ? (
          <Image
            className="loader-element animate__animated animate__jackInTheBox"
            src={ReactLogo}
            height={400}
          />
        ) : (
          <FontAwesomeIcon
            className=" d-flex align-middle"
            style={{ height: "20px", width: "20px" }}
            icon={faSpinner}
          />
        )}
      </div>
    </div>
  );
};
