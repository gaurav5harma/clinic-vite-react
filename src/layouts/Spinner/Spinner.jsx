import React from "react";
import { getCompanyData } from "../../services/AuthService";
import "./spinner.css";
import * as appData from "../../config.json";

export default function Spinner() {
  return (
    <div className="backdrop">
      <div>
        <div className="main-container">
          <div className="flip-container floatL">
            <div className="flipper">
              <div className="front">
                <img src={appData.appLogo} height="100px" alt="logo" />
              </div>
              <div className="back">
                <img src={appData.appLogo} height="100px" alt="logo" />
              </div>
              <div className="clear" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
