import React, { useState, useEffect } from "react";
import {
  setUserData,
  getUserData,
  setCompanyData,
  logout,
  setIdValidation,
} from "../../services/AuthService";
import { authenticateService } from "../../services/HTTPService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as appData from "../../config.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login(props) {
  const navigate = useNavigate();
  const [loginParams, setLoginParams] = useState({
    username: "",
    password: "",
  });
  const [isPwdVisible, setIsPwdVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    if (loading === true) {
      setLoading(false);
      if (Object.keys(getUserData()).length > 0) {
        navigate(`/dashboard`);
      }
    }
  };

  useEffect(() => {
    checkAuth();
  });

  const usernameChanged = (event) => {
    let params = loginParams;
    params = {
      username: event.target.value,
      password: loginParams.password,
    };
    setLoginParams(params);
  };

  const passwordChanged = (event) => {
    let params = loginParams;
    params = {
      username: loginParams.username,
      password: event.target.value,
    };
    setLoginParams(params);
  };

  const clickedBtn = () => {
    authenticateService(loginParams).then((response) => {
      if (response !== undefined) {
        if (response.data.response === "success") {
          let userData = response.data.data;
          setUserData(JSON.stringify(userData));
          setCompanyData(JSON.stringify(response.data.company));
          setIdValidation(true);
          // toast.success(response.data.msg);
          props.loginStatus(true);
          navigate("/dashboard");
        } else {
          toast.error(response.data.msg);
          if (response.data.status === "logout") {
            logout();
          }
        }
      } else {
        logout();
        navigate("/login");
      }
    });
  };

  return (
    <div className="border-top-wide border-primary d-flex flex-column">
      {/* <img
        src="https://access.linesoflogic.com/payroll/resources/images/bg.jpg"
        width="100%"
        height="100%"
        style={{ position: "absolute", opacity: "20%" }}
        alt=""
      /> */}
      <div className="page page-center" style={{ marginTop: "0px" }}>
        <div className="container-tight" style={{ maxWidth: "30rem" }}>
          <div className="text-center mb-4">
            <a href="." className="navbar-brand navbar-brand-autodark">
              <img src={appData.appLogo} alt={appData.appTitle} height={115} />
            </a>
            <h1>Shri Gurunanak Hospital</h1>
          </div>
          <div className="card card-md">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                Login to your account
              </h2>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter username"
                  autoComplete="off"
                  value={loginParams.username}
                  onChange={usernameChanged}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      clickedBtn();
                    }
                  }}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Password</label>
                <div className="input-group input-group-flat">
                  <input
                    type={isPwdVisible ? "password" : "text"}
                    className="form-control"
                    placeholder="Password"
                    autoComplete="off"
                    value={loginParams.password}
                    onChange={passwordChanged}
                    onKeyDown={(e) => {
                      if (e.code === "Enter") {
                        console.log("Pressed");
                        clickedBtn();
                      }
                    }}
                  />
                  <span
                    className="input-group-text"
                    onClick={() => {
                      setIsPwdVisible((prev) => !prev);
                    }}
                  >
                    {isPwdVisible ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </span>
                </div>
              </div>
              <div className="form-footer">
                <div className="row">
                  <div className="col-12 mb-4">
                    <button
                      type="submit"
                      className="btn btn-theme w-100"
                      onClick={clickedBtn}
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
