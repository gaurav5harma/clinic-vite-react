import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { Routes, Route, redirect } from "react-router-dom";
import { buildDynamicRoutes } from "./routes/Routes";
import Spinner from "./layouts/Spinner/Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Navigation from "./components/Shared/Navigation/Navigation";
import NotFound from "./components/NotFound/NotFound";
import Dashboard from "./components/Dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import { getUserData, logout } from "./services/AuthService";
import Wrapper from "./hoc/Wrapper";
import Header from "./components/Shared/Header/Header";
import SignUp from "./components/SignUp/SignUp";
import { getAppVersionService } from "./services/HTTPService";
import InstallPrompt from "./components/Shared/InstallPrompt";

export default function App(props) {
  const [userData, updateUserData] = useState(getUserData());
  const [loading, setLoading] = useState(false);
  const [showUpdateBar, toggleUpdateBar] = useState(false);
  const appVersion = { version: "0.0.1", build: 1 };
  // const navigate = useNavigate();

  axios.defaults.baseURL = "https://access.linesoflogic.com/clinic/api";
  // axios.defaults.baseURL = "https://atsops.com/api";
  // axios.defaults.baseURL = "http://localhost/ats/api";

  axios.interceptors.request.use(
    (request) => {
      if (Object.keys(getUserData()).length > 0) {
        const token = getUserData().authToken;
        request.headers.Authorization = `Bearer ${token}`;
      }

      const spinnerException = [
        "UploadItemAttachment",
        "GetAllMedicines",
        "GetAllModules",
        "GetAllShabds",
        "Check",
      ];
      const flag = spinnerException.every(
        (substring) => request.url.indexOf(substring) === -1,
      );
      // console.log(request.url.indexOf("GetAllClients"))
      if (flag) {
        setLoading(true);
      }
      return request;
    },
    (e) => {
      setLoading(false);
      toast.error("Please check network connection.");
    },
  );

  useEffect(() => {
    getAppVersion();
  }, []);

  // const navigate = useNavigate();

  axios.interceptors.response.use(
    (response) => {
      setLoading(false);
      if (
        response.data.status === "logout" ||
        response.data.response === "logout"
      ) {
        toast.info("Security token refreshed. Please login again.");
        logout();
        props.loginStatus(true);

        redirect("/login");
        location.reload();
        return null;
      } else {
        return response;
      }
    },
    (e) => {
      setLoading(false);
      toast.error("Please check network connection", e);
    },
  );

  let checkLoginStatus = () => {
    updateUserData(getUserData());
  };

  const getAppVersion = () => {
    getAppVersionService().then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          if (Number(appVersion.build) !== Number(res.data.version)) {
            toggleUpdateBar(true);
          }
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
  };

  const LoginComponent = React.lazy(() => import("./components/Login/Login"));

  return (
    <>
      {/* <InstallPrompt /> */}
      {Object.keys(getUserData()).length === 0 ? (
        <Suspense fallback={<Spinner></Spinner>}>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={true}
            theme="dark"
          />
          <Router>
            {loading ? <Spinner></Spinner> : null}
            <Routes>
              <Route
                path="/"
                element={<LoginComponent loginStatus={checkLoginStatus} />}
              />
              <Route
                path="/login"
                element={<LoginComponent loginStatus={checkLoginStatus} />}
              />
              <Route
                path="/sign-up"
                element={<SignUp loginStatus={checkLoginStatus} />}
              />
              <Route
                path="*"
                element={<LoginComponent loginStatus={checkLoginStatus} />}
              />
            </Routes>
          </Router>
        </Suspense>
      ) : (
        <Suspense fallback={<div></div>}>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={true}
            theme="dark"
          />
          <Router>
            <Wrapper>
              <Header loginStatus={checkLoginStatus} />
              {showUpdateBar === true ? (
                <div style={{ background: "yellow", color: "darkred" }}>
                  <h5 className="text-center m-0">
                    New version available --- {"> "}
                    <span
                      style={{
                        color: "navy",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      Load new Version
                    </span>
                  </h5>
                </div>
              ) : null}
              <Navigation loginStatus={checkLoginStatus} />
              {loading ? <Spinner></Spinner> : null}
              <Routes>
                {buildDynamicRoutes()}
                {/* <Route path="/" element={<Default />} /> */}
                <Route path="*" element={<Dashboard />} />
              </Routes>

              <div
                className="col-12 text-center mt-4"
                style={{
                  background: "grey",
                  color: "white",
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                }}
              >
                {/* <h2 className="m-0" style={{ background: "darkgreen" }}>
                  TESTING
                </h2> */}
                <p className="m-0" style={{ fontSize: "10px" }}>
                  {appVersion.version}
                </p>
              </div>
            </Wrapper>
          </Router>
        </Suspense>
      )}
    </>
  );
}
