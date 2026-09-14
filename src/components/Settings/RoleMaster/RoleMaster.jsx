import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icons from "../../../assets/theme/Icons";
import PageWrapper from "../../../hoc/PageWrapper";
import { toast } from "react-toastify";
import { logout } from "../../../services/AuthService";
import {
  getRolesServices,
  getRoutesServices,
  getActionServices,
  getRouteAndActions,
  addRemoveRolesRoutes,
  addRemoveRolesActions,
  addNewRoleServices,
} from "../../../services/HTTPService";
import DialogAddRole from "../../Shared/DialogBoxes/DialogAddRole";

const RoleMaster = (props) => {
  // const defaultfields = {
  //   rolesId: [],
  //   actionId: [],
  //   routesId: [],
  // };
  // const [formsData, setFormsData] = useState(defaultfields);
  const navigate = useNavigate();
  const defaultPyaload = {
    userId: "",
    roleId: "",
  };
  const [formsData, setFormsData] = useState(defaultPyaload);
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false);
  const [roles, setRoles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [actions, setActions] = useState([]);
  //
  const [assignedRoutes, setAssignedRoutes] = useState([]);
  const [assignedActions, setAssignedActions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(0);
  //
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
    getRoles();
    getRoutes();
    getActions();
  }, []);
  //
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
  //.
  const roleSelectHandler = (roleId) => {
    // setSelectedRole(roleId);
    setFormsData({ ...formsData, ["roleId"]: roleId });
    // setFormsData({ ...formsData, [`routesId${roleId}`]: [] });
  };
  //
  const handleRoutesChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      routesCheckBoxClick(formsData.roleId, value, 1);
    } else {
      routesCheckBoxClick(formsData.roleId, value, 0);
    }
  };
  const handleActionsChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      actionsChecksBoxClicks(formsData.roleId, value, 1);
    } else {
      actionsChecksBoxClicks(formsData.roleId, value, 0);
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
  const routesCheckBoxClick = (roleId, value, checked) => {
    addRemoveRolesRoutes({
      roleId: roleId,
      value: value,
      checked: checked,
    })
      .then((response) => {
        // console.log("response.data:>>", response.data);
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
  const actionsChecksBoxClicks = (roleId, value, checked) => {
    addRemoveRolesActions({
      roleId: roleId,
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
  const toggleDialog = () => {
    setShowAddRoleDialog(!showAddRoleDialog);
  };
  const addRoleHandler = () => {
    toggleDialog();
  };
  const submitHandler = (payL) => {
    if (payL.name === "") {
      toast("Role Name is Required");
    } else {
      addNewRole(payL);
      toggleDialog();
    }
  };
  const addNewRole = (payL) => {
    addNewRoleServices(payL)
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg);
          getRoles();
        } else if (response.data.status === "warning") {
          toast.warning(response.data.msg);
        } else if (response.data.status === "error") {
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

  // commeted code for assign checkbox value like a string and store in def payload with dynamic payload generated
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
  // routesId: [...formsData.routesId.sort((a, b) => a - b), value],
  //
  console.log("formsData", formsData);
  return (
    <PageWrapper title="Role Master">
      <div className="row card p-3">
        <DialogAddRole
          isVisible={showAddRoleDialog}
          toggleVisible={toggleDialog}
          onSubmit={submitHandler}
        />
        <div className="col-md-12">
          <div className="col-md-2" style={{ float: "left" }}>
            <button className="btn btn-theme" onClick={addRoleHandler}>
              <Icons.BsFillPlusCircleFill style={{ marginRight: "5px" }} />{" "}
              Create New Role
            </button>
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
                            // id={`routesId${formsData.roleId}`}
                            // name={`routesId${formsData.roleId}`}
                            name="routesId"
                            value={el.id}
                            checked={assignedRoutes.some(
                              (val) => Number(val) == Number(el.id)
                            )}
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
                            // id={`routesId${formsData.roleId}`}
                            // name={`routesId${formsData.roleId}`}
                            name="actionsId"
                            value={el.id}
                            checked={assignedActions.some(
                              (val) => Number(val) == Number(el.id)
                            )}
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
