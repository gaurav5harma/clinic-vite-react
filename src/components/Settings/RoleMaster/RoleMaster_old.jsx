import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icons from "../../../assets/theme/Icons";
import PageWrapper from "../../../hoc/PageWrapper";
import { toast } from "react-toastify";
import { logout } from "../../../services/AuthService";
import {
  getRolesList,
  getRoutesList,
  getActionsList,
  getRouteAndActions,
  addRemoveRolesRoutes,
  addRemoveRolesActions,
} from "../../../services/HTTPService";

const RoleMaster = (props) => {
  const navigate = useNavigate();
  const defaultfields = {
    rolesId: [],
    actionId: [],
    routesId: [],
  };
  const [formsData, setFormsData] = useState(defaultfields);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [actions, setActions] = useState([]);
  //
  const [rolesRoute, setRolesRoute] = useState([]);
  const [rolesAction, setRolesAction] = useState([]);
  //
  const [selectedRole, setSelectedRole] = useState(0);
  // const [count, setCount] = useState(0);
  //

  const getRoles = () => {
    if (loading === true) {
      setLoading(false);
      getRolesList().then((response) => {
        console.log("response.data", response.data[5].routes);
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
    }
  };
  const getRoutes = () => {
    getRoutesList().then((response) => {
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
    if (loading === true) {
      setLoading(false);
      getActionsList().then((response) => {
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
    }
  };
  useEffect(() => {
    getRoles();
    getRoutes();
    getActions();
  }, []);
  //
  const getRAndA = (role) => {
    console.log("role executed :>>>>>", role);
    getRouteAndActions({ roleId: role })
      .then((response) => {
        if (response.data.status === "success") {
          setRolesRoute(response.data.routes.split(","));
          setRolesAction(response.data.actions.split(","));
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
    getRAndA(selectedRole);
  }, [selectedRole]);
  //.
  const roleSelectHandler = (roleId) => {
    setSelectedRole(roleId);
    // setFormsData({ ...formsData, [`routesId${roleId}`]: [] });
  };
  //
  const handleRoutesChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      rolesRouteService(selectedRole, value, 1);
    } else {
      rolesRouteService(selectedRole, value, 0);
    }
  };
  const handleActionsChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      rolesActionSerives(selectedRole, value, 1);
    } else {
      rolesActionSerives(selectedRole, value, 0);
    }
    // const { rolesId, actionId, routesId } = formsData;
    // if (checked) {
    //   setFormsData((prevState) => ({
    //     ...prevState,
    //     [name]: [...value, value],
    //     // [name]: [...value, value],
    //   }));
    // setFormsData((prevState) => ({
    //   ...prevState,
    //   routesId: { ...formsData.routesId, value },
    // }));
    // } else {
    //   setFormsData({
    //     routesId: formsData.routesId.filter((e) => e !== value),
    //   });
    // }
  };
  const rolesRouteService = (selectedRole, value, checked) => {
    addRemoveRolesRoutes({
      selectedRole: selectedRole,
      value: value,
      checked: checked,
    })
      .then((response) => {
        // console.log("response.data:>>", response.data);
        if (response.data.status === "success") {
          toast.success(response.data.msg);
          getRAndA(selectedRole);
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
  const rolesActionSerives = (selectedRole, value, checked) => {
    addRemoveRolesActions({
      selectedRole: selectedRole,
      value: value,
      checked: checked,
    })
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg);
          getRAndA(selectedRole);
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
  // routesId: [...formsData.routesId.sort((a, b) => a - b), value],
  //
  return (
    <PageWrapper title="Role Master">
      <div className="row card p-3">
        <div className="col-md-12">
          <div className="col-md-2" style={{ float: "left" }}></div>
        </div>
      </div>
      <div className="row" style={{ height: "10px" }}></div>
      <div className="row ">
        <div className="col-md-12 card">
          <div className="row">
            <div className="col md-4 m-2">
              <div className="row card p-3">
                <div className="form-label">Roles List</div>
                {/* <div> */}
                {roles.map((el, key) => {
                  return (
                    <span key={key}>
                      <label className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="rolesId"
                          value={el.id}
                          onChange={() => roleSelectHandler(el.id)}
                        />
                        <span className="form-check-label">{el.name}</span>
                      </label>
                    </span>
                  );
                })}

                {/* </div> */}
              </div>
            </div>
            <div className="col md-4 m-2">
              <div className="row card p-3">
                <div className="form-label">Routes</div>
                {routes.map((el, key) => {
                  return (
                    <>
                      <span key={key}>
                        <label className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`routesId${selectedRole}`}
                            name={`routesId${selectedRole}`}
                            value={el.id}
                            checked={rolesRoute.some((val) => val == el.id)}
                            onChange={handleRoutesChange}
                          />
                          <span className="form-check-label">{el.name}</span>
                        </label>
                      </span>
                    </>
                  );
                })}
              </div>
            </div>
            <div className="col md-4 m-2">
              <div className="row card p-3">
                <div className="form-label">Routes</div>
                {actions.map((el, key) => {
                  return (
                    <>
                      <span key={key}>
                        <label className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`routesId${selectedRole}`}
                            name={`routesId${selectedRole}`}
                            value={el.id}
                            checked={rolesAction.some((val) => val == el.id)}
                            onChange={handleActionsChange}
                          />
                          <span className="form-check-label">{el.name}</span>
                        </label>
                      </span>
                    </>
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

export default RoleMaster;
