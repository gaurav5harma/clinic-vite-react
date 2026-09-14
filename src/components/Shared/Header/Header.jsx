import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildDynamicRoutes } from "../../../routes/Routes";
import {
  getCompanyData,
  getCurrentSession,
  getUserData,
  logout,
  setCurrentSession,
} from "../../../services/AuthService";
import {
  refreshChangesService,
  changePasswordService,
} from "../../../services/HTTPService";
import { setUserData } from "../../../services/AuthService";
import { Modal } from "react-bootstrap";
import Colors from "../../../assets/theme/Colors";
import { toast } from "react-toastify";
import * as appData from "../../../config.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Select } from "../Elements";

const Header = (props) => {
  const defaultPayload = {
    userid: getUserData().id ? getUserData().id : "",
    username: getUserData().username ? getUserData().username : "",
    currentPwd: "",
    newPwd: "",
    confirmPwd: "",
    session: getCurrentSession(),
  };
  const [formsData, setFormsData] = useState(defaultPayload);
  const [showPwdDialog, setShowPwdDialog] = useState(false);
  const [sessionDialog, toggleSessionDialog] = useState(
    getCurrentSession() ? false : false
  );
  const [isPwdVisible, setIsPwdVisible] = useState(true);
  // const [userData, updateUserData] = useState(getUserData());
  let navigate = useNavigate();

  const logoutNow = () => {
    logout();
    props.loginStatus(true);
    navigate("/login");
  };
  //
  const updateFormsData = (e) => {
    const { name, value } = e.target;
    setFormsData({ ...formsData, [name]: value });
  };
  const closeModal = () => {
    setShowPwdDialog(false);
    setFormsData(defaultPayload);
  };
  const handlePasswordSubmit = () => {
    if (formsData.username === "") {
      toast("Username Required");
    } else if (formsData.currentPwd === "") {
      toast("Current Password Required");
    } else if (formsData.newPwd === "" || formsData.newPwd.length < 6) {
      toast("Pl Check New Password it should not be less than 6 char.");
    } else if (
      formsData.confirmPwd === "" ||
      formsData.newPwd !== formsData.confirmPwd
    ) {
      toast("Confirm Password do not matched with New Entered Password.");
    } else {
      changePasswordService(formsData)
        .then((response) => {
          if (response.data.status === "success") {
            toast.success(response.data.msg);
            closeModal();
          } else if (response.data.status === "warning") {
            toast.warning("Warning: " + response.data.msg);
          } else if (response.data.status === "error") {
            toast.error("Error:" + response.data.msg);
          } else if (response.data.status === "logout") {
            logout();
            navigate("/login");
          } else {
            toast.error(
              "Error in Updating, Something went wrong. " + response.data.status
            );
          }
        })
        .catch((res) => {
          navigate("/dashboard");
          toast.error("Catch Error, Something went wrong");
        });
    }
  };

  const modalChangePassword = () => {
    return (
      <>
        <Modal
          show={showPwdDialog}
          onHide={() => closeModal()}
          size="xm"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {"Change Password"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className="form-label" htmlFor="">
                      Username <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formsData.username}
                      onChange={updateFormsData}
                      placeholder="Username"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label className="form-label" htmlFor="">
                      Current Password <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="input-group input-group-flat">
                      <input
                        type={isPwdVisible ? "text" : "password"}
                        className="form-control"
                        name="currentPwd"
                        value={formsData.currentPwd}
                        onChange={updateFormsData}
                        placeholder="Current Password"
                      />
                      <span
                        className="input-group-text"
                        onClick={() => {
                          setIsPwdVisible((prev) => !prev);
                        }}
                      >
                        {isPwdVisible ? (
                          <FaEye size={18} />
                        ) : (
                          <FaEyeSlash size={18} />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className="form-label" htmlFor="">
                      New Password <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="input-group input-group-flat">
                      <input
                        type={isPwdVisible ? "text" : "password"}
                        className="form-control"
                        name="newPwd"
                        value={formsData.newPwd}
                        onChange={updateFormsData}
                        placeholder="New Password"
                      />
                      <span
                        className="input-group-text"
                        onClick={() => {
                          setIsPwdVisible((prev) => !prev);
                        }}
                      >
                        {isPwdVisible ? (
                          <FaEye size={18} />
                        ) : (
                          <FaEyeSlash size={18} />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <label className="form-label" htmlFor="">
                      Confirm Password <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="input-group input-group-flat">
                      <input
                        type={isPwdVisible ? "text" : "password"}
                        className="form-control"
                        name="confirmPwd"
                        value={formsData.confirmPwd}
                        onChange={updateFormsData}
                        placeholder="Confirm Password"
                      />
                      <span
                        className="input-group-text"
                        onClick={() => {
                          setIsPwdVisible((prev) => !prev);
                        }}
                      >
                        {isPwdVisible ? (
                          <FaEye size={18} />
                        ) : (
                          <FaEyeSlash size={18} />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="row">
              <div className="col-md-12 mb-6">
                <button
                  className="btn btn-theme"
                  style={{
                    backgroundColor: Colors.defaultThemeColor,
                    marginRight: "10px",
                  }}
                  onClick={handlePasswordSubmit}
                >
                  Update
                </button>
                <button
                  className="btn btn-theme"
                  onClick={closeModal}
                  style={{ backgroundColor: Colors.black }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const modalChangeSession = () => {
    return (
      <>
        <Modal
          show={sessionDialog}
          onHide={() => toggleSessionDialog(false)}
          size="xs"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {"Select Session"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <Select
                  data={[
                    { name: "2024-2025", value: "2024-2025" },
                    { name: "2025-2026", value: "2025-2026" },
                  ]}
                  value={formsData.session}
                  onChange={(val) => {
                    setFormsData({ ...formsData, session: val });
                    setCurrentSession(val);
                    toggleSessionDialog(false);
                  }}
                />
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  };
  //
  return (
    <header
      className="navbar navbar-expand-md navbar-light d-print-none"
      style={{ background: "#eaaea" }}
    >
      {modalChangePassword()}
      {modalChangeSession()}
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-menu"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3 p-0">
          <a href=".">
            {/* <img
              src={appData.appLogo}
              width={110}
              height={52}
              alt="Gurunanak Hospital"
              className="navbar-brand-image"
            /> */}
            <h2 className="m-0">Gurunanak Hospital</h2>
          </a>
        </h1>
        <h2 className="m-0" style={{ color: "black" }}>
          {getCurrentSession()}
        </h2>

        <div className="navbar-nav flex-row order-md-last">
          <div className="d-none d-md-flex"></div>
          <div className="nav-item dropdown">
            <a
              href="#"
              className="nav-link d-flex lh-1 text-reset p-0"
              data-bs-toggle="dropdown"
              aria-label="Open user menu"
            >
              <span
                className="avatar avatar-sm"
                // style={{
                //   backgroundImage: "url(./static/avatars/000m.jpg)",
                // }}
              >
                <img
                  src={
                    getCompanyData().url +
                    "images/users/" +
                    getUserData().username +
                    ".png"
                  }
                  alt=""
                />
              </span>
              <div className="d-none d-xl-block ps-2">
                <div>{getUserData().name}</div>
                <div
                  className="mt-1 small text-muted"
                  style={{ textTransform: "capitalize" }}
                >
                  {getUserData().role}
                </div>
              </div>
            </a>
            <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <span
                onClick={() => {
                  refreshChangesService().then((res) => {
                    if (res.status === 200) {
                      if (res.data.status === "success") {
                        let userData = getUserData();
                        userData.actions = res.data.data.actions;
                        userData.routes = res.data.data.routes;
                        setUserData(JSON.stringify(userData));
                        buildDynamicRoutes();
                        window.location.reload();
                      }
                    }
                  });
                }}
                className="dropdown-item"
              >
                Sync Latest Changes
              </span>
              <div className="dropdown-divider" />
              <span
                className="dropdown-item"
                onClick={() => setShowPwdDialog(true)}
              >
                Change Password
              </span>
              <span onClick={logoutNow} className="dropdown-item">
                Logout
              </span>
              {/* <span
                style={{ padding: "0px 12px", color: "black" }}
                className="dropdown-item"
              >
                Version 1.0.6
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
