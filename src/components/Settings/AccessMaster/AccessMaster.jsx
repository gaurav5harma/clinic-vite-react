import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../../services/AuthService";
import {
  getRolesServices,
  getRoutesServices,
  getActionServices,
  getRouteAndActions,
  getUsersService,
  addRemoveAccessRoutes,
  addRemoveAccessActions,
  getDataByUserIdService,
} from "../../../services/HTTPService";
import PageWrapper from "../../../hoc/PageWrapper";
//
const AccessMaster = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultPyaload = {
    // userId: location.state ? location.state.userId : 0,
    roleId: "",
  };

  const [formsData, setFormsData] = useState(defaultPyaload);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [actions, setActions] = useState([]);
  const [childAction, setChildAction] = useState("selected-route");
  //
  const [assignedRoutes, setAssignedRoutes] = useState([]);
  const [assignedActions, setAssignedActions] = useState([]);
  const [role, setRole] = useState(0);
  //
  const getUsers = () => {
    getUsersService({}).then((response) => {
      if (response.status === 200) {
        setUsers(response.data);
      } else {
        toast.error(response.data.msg);
        if (response.data.status === "logout") {
          logout();
        }
        window.history.back();
      }
    });
  };
  const getRoles = () => {
    getRolesServices().then((response) => {
      if (response.status === 200) {
        setRoles(response.data);
      } else {
        toast.error(response.data.msg);
        if (response.data.status === "logout") {
          logout();
        }
        window.history.back();
      }
    });
  };
  const getRoutes = () => {
    getRoutesServices().then((response) => {
      if (response.status === 200) {
        setRoutes(response.data);
      } else {
        toast.error(response.data.msg);
        if (response.data.status === "logout") {
          logout();
        }
        window.history.back();
      }
    });
  };
  const getActions = () => {
    getActionServices().then((response) => {
      if (response.status === 200) {
        setActions(response.data);
      } else {
        toast.error(response.data.msg);
        if (response.data.status === "logout") {
          logout();
        }
        window.history.back();
      }
    });
  };
  useEffect(() => {
    getUsers();
    // getRoles();
    getRoutes();
    getActions();
  }, []);
  //
  useEffect(() => {
    if (formsData.userId) {
      getUserDataByUserId(formsData.userId);
    }
  }, [formsData]);
  const getUserDataByUserId = (userId) => {
    getDataByUserIdService({ userId: userId })
      .then((response) => {
        if (response.data.status === "success") {
          setRole(response.data.data.roleId);
        } else if (response.data.status === "error") {
          // toast.error(response.data.msg);
        } else if (response.data.status === "logout") {
          logout();
          navigate("/login");
        } else {
          toast.error(
            "Error in Registering, Something went wrong. " +
              response.data.status
          );
        }
      })
      .catch((res) => {
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong" + res);
      });
  };
  const getRAndA = (payload) => {
    getRouteAndActions(payload)
      .then((response) => {
        if (response.data.status === "success") {
          setAssignedRoutes(response.data.routes.split(","));
          setAssignedActions(response.data.actions.split(","));
        } else if (response.data.status === "error") {
          // toast.error(response.data.msg);
        } else if (response.data.status === "logout") {
          logout();
          navigate("/login");
        } else {
          toast.error(
            "Error in Registering, Something went wrong. " +
              response.data.status
          );
        }
      })
      .catch((res) => {
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong" + res);
      });
  };
  useEffect(() => {
    getRAndA(formsData);
  }, [formsData]);
  //
  const handleRoutesChange = (e) => {
    const { name, value, checked } = e.target;
    console.log(e.target);
    if (checked) {
      routesCheckBoxClick(formsData.userId, value, 1);
    } else {
      routesCheckBoxClick(formsData.userId, value, 0);
    }
  };
  const handleActionsChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      actionsChecksBoxClicks(formsData.userId, value, 1);
    } else {
      actionsChecksBoxClicks(formsData.userId, value, 0);
    }
  };
  const routesCheckBoxClick = (userId, value, checked) => {
    addRemoveAccessRoutes({
      userId: userId,
      value: value,
      checked: checked,
      action: childAction,
    })
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg);
          getRAndA(formsData);
        } else if (response.data.status === "error") {
          console.log(response.data);
          toast.error(response.data.msg);
        } else if (response.data.status === "logout") {
          logout();
          navigate("/login");
        } else {
          toast.error(
            "Error in Registering, Something went wrong. " +
              response.data.status
          );
        }
      })
      .catch((res) => {
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
      });
  };
  const actionsChecksBoxClicks = (userId, value, checked) => {
    addRemoveAccessActions({
      userId: userId,
      value: value,
      checked: checked,
    })
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg);
          getRAndA(formsData);
        } else if (response.data.status === "error") {
          console.log(response.data);
          toast.error(response.data.msg);
        } else if (response.data.status === "logout") {
          logout();
          navigate("/login");
        } else {
          toast.error(
            "Error in Registering, Something went wrong. " +
              response.data.status
          );
        }
      })
      .catch((res) => {
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
      });
  };
  //
  const formsDataHandler = (e) => {
    const { name, value } = e.target;
    setFormsData({ ...formsData, [name]: value });
    getUserDataByUserId(value);
  };
  // routesId: [...formsData.routesId.sort((a, b) => a - b), value],
  //

  const createRouteChain = (element) => {
    let chain = "";
    let first = element.name;
    let chainArr = [];
    let el = element;
    console.log(el);
    while (el.parent && el.parent !== 0) {
      let ele = routes.filter((x) => x.id === el.parent)[0];
      // console.log(ele.name);
      // chainArr.push(ele.name);
      el = ele;
    }
    chainArr.reverse().forEach((x) => {
      chain += x + " -> ";
    });
    chain += first;
    return chain;
  };

  return (
    <PageWrapper title="Access Master">
      <div className="row card p-3">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-2">
              <label className="form-label" htmlFor="">
                Users <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="form-select"
                name="userId"
                value={formsData.userId}
                onChange={formsDataHandler}
              >
                <option value="">Select User</option>
                {users.map((val, key) => {
                  return (
                    <option key={key} value={val.id}>
                      {val.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label" htmlFor="">
                Route Change Effect <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="form-select"
                value={childAction}
                onChange={(val) => {
                  setChildAction(val.target.value);
                }}
              >
                <option value="selected-route">Only Selected Route</option>
                <option value="all-childs">All Childs of Selected Route</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="row" style={{ height: "10px" }}></div>
      <div className="row ">
        <div className="col-md-12 card">
          <div className="row">
            <div className="col md-4 m-2">
              <div className="row card p-3">
                <div className="form-label">Roles List</div>
                {roles.map((el, key) => {
                  return (
                    <span key={key}>
                      <label className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="rolesId"
                          value={el.id}
                          checked={
                            Number(el.id) === Number(role) ? true : false
                          }
                          readOnly
                          disabled
                        />
                        <span className="form-check-label">{el.name}</span>
                      </label>
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="col md-4 m-2">
              <div className="row card p-3">
                <div className="form-label">Routes / Modules</div>
                {routes.map((el, key) => {
                  return (
                    <span key={key}>
                      <label className="form-check mb-0 mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          // id={`routesId${formsData.userId}`}
                          // name={`routesId${formsData.userId}`}
                          name="routesId"
                          value={el.id}
                          checked={assignedRoutes.some(
                            (val) => Number(val) === Number(el.id)
                          )}
                          onChange={handleRoutesChange}
                        />
                        <span
                          className="form-check-label"
                          style={{
                            fontWeight: "bold",
                            color:
                              el.isParent === "1"
                                ? "maroon"
                                : el.hasChild === "1"
                                ? "navy"
                                : "orange",
                          }}
                        >
                          {el.name}{" "}
                          {el.isParent === "1"
                            ? " (Main)"
                            : el.hasChild === "1"
                            ? " (Route)"
                            : " (Page)"}
                        </span>
                      </label>
                      <small>
                        <i>{/* (#{el.id}) {createRouteChain(el)} */}</i>
                      </small>
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="col md-4 m-2">
              <div className="row card p-3">
                <div className="form-label">Actions</div>
                {actions.map((el, key) => {
                  return (
                    <span key={key}>
                      <label className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          // id={`actions${formsData.userId}`}
                          // name={`actions${formsData.userId}`}
                          name="actionsId"
                          value={el.id}
                          checked={assignedActions.some(
                            (val) => Number(val) === Number(el.id)
                          )}
                          onChange={handleActionsChange}
                        />
                        <span className="form-check-label">{el.name}</span>
                      </label>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AccessMaster;
