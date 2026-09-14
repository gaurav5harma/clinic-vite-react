import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllUsersService,
  getRolesServices,
  addNewUserServices,
  updateUserServices,
  resetPasswordService,
  getDetailsByBadgeIdService,
  getSatsangGharsListService,
  getDepartmentsListService,
  getDesignationsListService,
  getActiveCentersListService,
} from "../../../../services/HTTPService";
import { Modal, OverlayTrigger, ToggleButton, Tooltip } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { logout } from "../../../../services/AuthService";
import Icons from "../../../../assets/theme/Icons";
import PageWrapper from "../../../../hoc/PageWrapper";
import Datatable from "../../../Shared/Datatable/Datatable";
import Colors from "../../../../assets/theme/Colors";
import MultiselectData from "../../../Shared/MultiselectData";
import { Select, TextInput } from "../../../Shared/Elements";

const AllUsers = (props) => {
  const navigate = useNavigate();
  const componentRef = useRef();
  //
  const defaultPayload = {
    id: "",
    name: "",
    user: "",
    pass: "",
    center: "",
    roleId: "",
  };

  const columns = [
    {
      name: "name",
      title: "Name",
      sorting: false,
    },
    {
      name: "username",
      title: "Username",
      sorting: true,
    },
    {
      name: "role",
      title: "Role",
      sorting: true,
    },
    {
      name: "center",
      title: "Center",
      sorting: false,
    },
    {
      name: "action",
      title: "Action",
      sorting: false,
    },
  ];
  const options = {
    theme: "",
    rows: [5, 10, 20, 50, 100],
    pagination: true,
    globalFilter: true,
    autoSearch: false,
  };
  const cusFilter = {
    page: 1,
    globalFilter: "",
    rows: 20,
    sortOrder: -1,
    sortField: "id",
  };
  const [formsData, setFormsData] = useState(defaultPayload);
  const [editMode, setEditMode] = useState(false);
  const [selection, setSelection] = useState("");
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [centers, setCenters] = useState([]);
  const [satsangGhars, setSatsangGhars] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filter, setFilter] = useState(cusFilter);
  const [userData, setUsersData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [isPwdVisible, setIsPwdVisible] = useState(false);
  const [showDataTable, setShowDataTable] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [showPwdDialog, setShowPwdDialog] = useState(false);
  const [showMultiselectModal, toggleMultiSelectModal] = useState(false);

  //
  const getRoles = () => {
    getRolesServices({ for: "users" }).then((response) => {
      if (response.status === 200) {
        setRoles(response.data);
      } else {
        console.log("error");
        navigate(`/dashboard`);
      }
    });
  };

  const getCenters = () => {
    getActiveCentersListService({ for: "users" }).then((response) => {
      if (response.status === 200) {
        setCenters(response.data.data);
      } else {
        console.log("error");
        navigate(`/dashboard`);
      }
    });
  };
  useEffect(() => {
    getRoles();
    getCenters();
  }, []);

  const selectUser = (selData) => {
    console.log(selData);
    setFormsData((payload) => ({
      ...payload,
      ["id"]: selData.id,
      ["name"]: selData.name,
      ["user"]: selData.user,
      ["center"]: selData.center,
      ["designation"]: selData.designation,
      ["roleId"]: selData.roleId,
      ["placeId"]: selData.placeId,
    }));
    // componentRef.current.focus();
    // setEditMode(true);
  };
  const selectPasswordChanger = (selData) => {
    setFormsData((payload) => ({
      ...payload,
      id: selData.id,
      user: selData.user,
    }));
    setShowPwdDialog(true);
  };
  const onLoad = (filterVal) => {
    getAllUsersService(filterVal).then((res) => {
      if (res.data.response === "success") {
        let dta = res.data.data;
        let selectedData = dta;
        dta.map((el, key) => {
          console.log("Data",el)
          let action = (
            <div key={key} style={{ width: "150px" }}>
              <OverlayTrigger
                placement="top"
                delay={{ show: 200, hide: 200 }}
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    Edit
                  </Tooltip>
                }
              >
                <span
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    // navigate(`/access-master`, { state: { id: 10 } });
                    selectUser(selectedData[key]);
                  }}
                >
                  <Icons.BsFillChatSquareDotsFill />
                </span>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                delay={{ show: 200, hide: 200 }}
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    Grant Access Permission
                  </Tooltip>
                }
              >
                <span
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(`/access-master`, { state: { userId: el.id } })
                  }
                >
                  <Icons.BsFillArrowUpRightSquareFill />
                </span>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                delay={{ show: 200, hide: 200 }}
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    Reset Password
                  </Tooltip>
                }
              >
                <span
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => selectPasswordChanger(el)}
                >
                  <Icons.BsExclude size={15} />
                </span>
              </OverlayTrigger>
            </div>
          );
          dta[key].action = action;
          // return 0;
        });
        setUsersData(dta);
        setTotalRows(res.data.total);
        setFilter(filterVal);
        // console.log(userData);
      } else {
        toast.error(res.data.msg);
        // navigate("/dashboard");
      }
    });
  };
  const cancel = () => {
    setFormsData(defaultPayload);
    // setEditMode(false);
  };
  const resetForm = () => {
    setFormsData(defaultPayload);
  };
  const formDataHandler = (e) => {
    const { name, value } = e.target;
    setFormsData({ ...formsData, [name]: value });
  };

  const multiSelectModal = () => {
    return (
      <Modal
        show={showMultiselectModal}
        onHide={() => toggleMultiSelectModal(false)}
        size="xs"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Body className="p-2">
          <div
            className="row"
            style={{ maxHeight: "600px", overflowY: "auto" }}
          >
            <div className="col-12">
              <MultiselectData
                title={selection === "centers" ? "Centers" : []}
                data={selection === "centers" ? centers : []}
                selected={selection === "centers" ? formsData.centers : []}
                setData={(e) => {
                  let data = [];
                  e.forEach((el) => {
                    if (el.selected === true) {
                      data.push(el.value);
                    }
                  });
                  if (selection === "centers") {
                    setFormsData({ ...formsData, centers: data });
                  }
                }}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };
  const submitHandler = () => {
    if (formsData.name === "") {
      toast.error("Name Required !");
    } else if (formsData.user === "") {
      toast.error("Username Required");
    } else if (
      formsData.id === "" &&
      (formsData.password === "" || formsData.password.length < 6)
    ) {
      toast.error("Password Could not be blank or less that 6 char.");
    } else if (formsData.roleId === "") {
      toast.error("Select a Role for this User.");
    } else {
      if (formsData.id === "") {
        addUserHandler(formsData);
      } else {
        updateUserHandler(formsData);
      }
    }
  };
  const addUserHandler = (payload) => {
    addNewUserServices(payload)
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg);
          resetForm();
          // getRoles();
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
        setShowDataTable(true);
      })
      .catch((res) => {
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
      });
    setShowDataTable(false);
  };
  const updateUserHandler = (payload) => {
    updateUserServices(payload)
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg);
          resetForm();
          setEditMode(false);
          // getRoles();
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
        setShowDataTable(true);
      })
      .catch((res) => {
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
      });
    setShowDataTable(false);
  };
  //
  const closeModal = () => {
    setShowPwdDialog(false);
    setFormsData(defaultPayload);
  };
  const handlePasswordReset = () => {
    if (formsData.id === "" || formsData.id === 0 || formsData.user === "") {
      toast("Select User ");
    } else {
      resetPasswordService(formsData)
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
            toast.error("Error, Something went wrong. " + response.data.status);
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
              {"Reset Password"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-md-12 mb-2">
                    <label className="form-label" htmlFor="">
                      Do You really want to reset password for this selected
                      User ..?
                    </label>
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
                  onClick={handlePasswordReset}
                >
                  Yes Reset
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
  // console.log("🚀 ~ AllUsers ~ formsData", formsData);
  //
  return (
    <PageWrapper title="User Master">
      {modalChangePassword()}
      {multiSelectModal()}
      <div className="row card p-3">
        <div className="col-12">
          <div className="row">
            <div className="col-md-3 col-12 mb-3">
              <TextInput
                label="Name"
                value={formsData.name}
                onChange={(val) => {
                  setFormsData({ ...formsData, name: val });
                }}
              />
            </div>
            <div className="col-md-3 col-12 mb-3">
              <TextInput
                label="User Name"
                value={formsData.user}
                onChange={(val) => {
                  setFormsData({ ...formsData, user: val });
                }}
              />
            </div>
            <div className="col-md-3 col-12 mb-3">
              <Select
                label="Center"
                value={formsData.center}
                data={centers}
                onChange={(val) => {
                  setFormsData({ ...formsData, center: val });
                }}
              />
            </div>
            {formsData.id === "" && (
              <div className="col-md-3 col-12 mb-3">
                <label htmlFor="" className="form-label">
                  Password
                </label>
                <div className="input-group input-group-flat">
                  <input
                    className="form-control"
                    type={isPwdVisible ? "text" : "password"}
                    name="password"
                    value={formsData.password}
                    placeholder="Password"
                    onChange={formDataHandler}
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
            )}
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                Role <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="form-select"
                name="roleId"
                value={formsData.roleId}
                onChange={formDataHandler}
              >
                <option value="">Select Role</option>
                {roles.map((role, key) => {
                  return (
                    <option value={role.id} key={key}>
                      {role.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-12 mb-3"></div>
            <div className="col-md-6 col-12 mb-3"></div>
          </div>
          <div className="row">
            <div className="col-12 text-right">
              <button className="btn btn-theme" onClick={submitHandler}>
                {formsData.id !== "" ? "Update User" : "Add User"}
              </button>
              {formsData.id !== "" ? (
                <button
                  className="btn btn-theme"
                  style={{ marginLeft: "20px" }}
                  onClick={cancel}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <hr className="mt-5 mb-4" />
        {showDataTable && (
          <div className="col-12 ">
            <h3>All Users</h3>
            <Datatable
              options={options}
              columns={columns}
              filter={filter}
              data={userData}
              totalRows={totalRows}
              lazyLoad={onLoad}
            ></Datatable>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default AllUsers;
