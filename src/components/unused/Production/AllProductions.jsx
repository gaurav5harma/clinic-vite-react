import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getRolesServices,
  addNewUserServices,
  updateUserServices,
  getDetailsByBadgeIdService,
  getSatsangGharsListService,
  getDepartmentsListService,
  getAllProductionsService,
  deleteProductionService,
} from "../../../services/HTTPService";
import { Modal, OverlayTrigger, ToggleButton, Tooltip } from "react-bootstrap";
import {
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaFileUpload,
  FaPrint,
  FaTrash,
} from "react-icons/fa";
import {
  getCompanyData,
  hasAccess,
  logout,
} from "../../../services/AuthService";
import Icons from "../../../assets/theme/Icons";
import PageWrapper from "../../../hoc/PageWrapper";
import Colors from "../../../assets/theme/Colors";
import { Select, TextInput } from "../../Shared/Elements";
import MultiselectData from "../../Shared/MultiselectData";
import Datatable from "../../Shared/Datatable/Datatable";

const AllProductions = (props) => {
  const navigate = useNavigate();
  const searchRef = useRef();
  //
  const defaultPayload = {
    id: "",
    name: "",
    badgeId: "",
    username: "",
    password: "",
    modules: [],
    satsangGhars: [],
    departments: [],
    centerDepartments: [],
    access: "",
    visibility: false,
    roleId: "",
    role: "",
  };

  const columns = [
    {
      name: "ref",
      title: "ERP Code",
      sorting: false,
    },
    {
      name: "title",
      title: "Name",
      sorting: false,
    },
    {
      name: "type",
      title: "Type",
      sorting: false,
    },
    {
      name: "schoolId",
      title: "School Code",
      sorting: false,
    },
    {
      name: "templateId",
      title: "Template Code",
      sorting: false,
    },
    {
      name: "action",
      title: "",
      sorting: false,
    },
  ];
  const options = {
    theme: "",
    rows: [5, 10, 20, 50, 100, 500],
    pagination: true,
    globalFilter: true,
  };
  const cusFilter = {
    page: 1,
    globalFilter: "",
    rows: 20,
    search: true,
    sortOrder: -1,
    sortField: "name",
  };
  const [formsData, setFormsData] = useState(defaultPayload);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [selection, setSelection] = useState("");
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [centerDepartments, setCenterDepartments] = useState([]);
  const [satsangGhars, setSatsangGhars] = useState([]);
  const [filter, setFilter] = useState(cusFilter);
  const [userData, setUsersData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [isPwdVisible, setIsPwdVisible] = useState(false);
  const [showDataTable, setShowDataTable] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showTransferDepartmentModal, toggleTransferDepartmentModal] =
    useState(false);
  const [showMultiselectModal, toggleMultiSelectModal] = useState(false);

  //
  const getRoles = () => {
    getRolesServices().then((response) => {
      if (response.status === 200) {
        setRoles(response.data);
      } else {
        console.log("error");
        navigate(`/dashboard`);
      }
    });
  };
  const getDepartments = () => {
    getDepartmentsListService().then((response) => {
      if (response.status === 200) {
        setDepartments(response.data);
        setCenterDepartments(response.data);
      } else {
        console.log("error");
        navigate(`/dashboard`);
      }
    });
  };
  const getSatsangGhars = () => {
    getSatsangGharsListService().then((response) => {
      if (response.status === 200) {
        setSatsangGhars(response.data);
      } else {
        console.log("error");
        navigate(`/dashboard`);
      }
    });
  };
  useEffect(() => {
    // getRoles();
    // getDepartments();
    // getSatsangGhars();
    onLoad(filter);
  }, []);

  const selectUser = (selData) => {
    setFormsData((payload) => ({
      ...payload,
      ["id"]: selData.id,
      ["name"]: selData.name,
      ["username"]: selData.username,
      ["badgeId"]: selData.username,
      ["departments"]: selData.departments,
      ["centerDepartments"]: selData.centerDepartments,
      ["satsangGhars"]: selData.satsangGhars,
      ["roleId"]: selData.roleId,
    }));
    // componentRef.current.focus();
    // setEditMode(true);
  };
  const selectPasswordChanger = (selData) => {
    setFormsData((payload) => ({
      ...payload,
      id: selData.id,
      username: selData.username,
    }));
    showStatusDialog(true);
  };
  const onLoad = (filterVal) => {
    getAllProductionsService(filterVal).then((res) => {
      if (res.data.response === "success") {
        let dta = res.data.data;
        dta.map((el, key) => {
          let action = (
            <div key={key} style={{ width: "50px" }}>
              {/* {alert(hasAccess("update-badge-status"))} */}

              {el.type === "students" || el.type === "employees" ? (
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 200, hide: 200 }}
                  overlay={
                    <Tooltip id="button-tooltip" {...props}>
                      Print Acrylic
                    </Tooltip>
                  }
                >
                  <span
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(
                        `/production/print-sheet-acrylic/${el.ref.replaceAll(
                          "/",
                          "-"
                        )}`
                      );
                    }}
                  >
                    <FaPrint style={{ color: "maroon" }} />
                  </span>
                </OverlayTrigger>
              ) : null}

              <OverlayTrigger
                placement="top"
                delay={{ show: 200, hide: 200 }}
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    Print
                  </Tooltip>
                }
              >
                <span
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (
                      el.type === "students" ||
                      el.type === "employees" ||
                      el.type === "business-card"
                    ) {
                      navigate(
                        `/production/print-sheet/${el.ref.replaceAll("/", "-")}`
                      );
                    }
                    if (el.type === "sticker") {
                      navigate(
                        `/production/print-sticker/${el.ref.replaceAll(
                          "/",
                          "-"
                        )}`
                      );
                    }
                    if (
                      el.type === "16mm-lanyard" ||
                      el.type === "20mm-lanyard"
                    ) {
                      navigate(
                        `/production/print-lanyard/${el.ref.replaceAll(
                          "/",
                          "-"
                        )}`
                      );
                    }
                  }}
                >
                  <FaPrint style={{ color: "blue" }} />
                </span>
              </OverlayTrigger>
              {/* <OverlayTrigger
                placement="top"
                delay={{ show: 200, hide: 200 }}
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    Print
                  </Tooltip>
                }
              >
                <span
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(
                      `/payroll/generate-slip/${el.id.replaceAll("/", "-")}`
                    );
                  }}
                >
                  <FaEdit style={{ color: "black" }} />
                </span>
              </OverlayTrigger> */}
              <OverlayTrigger
                placement="top"
                delay={{ show: 200, hide: 200 }}
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    Delete Production
                  </Tooltip>
                }
              >
                <span
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedBadge(el);
                    toggleTransferDepartmentModal(true);
                  }}
                >
                  <FaTrash style={{ color: "darkred" }} />
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
    if (name === "badgeId") {
      if (value.length < 9) {
        setFormsData({ ...formsData, [name]: value });
      }
      if (value.length === 9) {
        getDetailsByBadgeIdService({ badgeId: value }).then((res) => {
          if (res.status === 200) {
            if (res.data.status === "success") {
              setFormsData({
                ...formsData,
                name: res.data.data.name,
                badgeId: value,
                username: value,
                password: res.data.data.mobile,
              });
            } else {
              toast.error(res.data.msg);
            }
          } else {
            toast.error("Something went wrong.");
          }
        });
      }
    } else {
      setFormsData({ ...formsData, [name]: value });
    }
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
                title={
                  selection === "departments"
                    ? "Department"
                    : selection === "satsangGhars"
                    ? "Satsang Ghar"
                    : selection === "centerDepartments"
                    ? "Center Departments"
                    : []
                }
                data={
                  selection === "departments"
                    ? departments
                    : selection === "centerDepartments"
                    ? centerDepartments
                    : selection === "satsangGhars"
                    ? satsangGhars
                    : []
                }
                selected={
                  selection === "departments"
                    ? formsData.departments
                    : selection === "centerDepartments"
                    ? formsData.centerDepartments
                    : selection === "satsangGhars"
                    ? formsData.satsangGhars
                    : []
                }
                setData={(e) => {
                  let data = [];
                  e.forEach((el) => {
                    if (el.selected === true) {
                      data.push(el.value);
                    }
                  });
                  if (selection === "departments") {
                    setFormsData({ ...formsData, departments: data });
                  }
                  if (selection === "centerDepartments") {
                    setFormsData({ ...formsData, centerDepartments: data });
                  }
                  if (selection === "satsangGhars") {
                    setFormsData({ ...formsData, satsangGhars: data });
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
    } else if (formsData.username === "") {
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

  const modalChangeStatus = () => {
    return (
      <>
        <Modal
          show={showStatusDialog}
          onHide={() => setShowStatusDialog(false)}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {"Assign Ref. No."}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-md-12 mb-2">
                    <TextInput
                      label="Ref No."
                      value={
                        selectedBadge && selectedBadge.ref_id
                          ? selectedBadge.ref_id
                          : ""
                      }
                      onChange={(val) => {
                        setSelectedBadge({ ...selectedBadge, ref_id: val });
                      }}
                    />
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
                    marginRight: "10px",
                  }}
                  onClick={() => {}}
                >
                  Update
                </button>
                <button
                  className="btn btn-theme"
                  onClick={() => setShowStatusDialog(false)}
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

  const modalDelete = () => {
    return (
      <>
        <Modal
          show={showTransferDepartmentModal}
          onHide={() => toggleTransferDepartmentModal(false)}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {"Delete Production"}
              {selectedBadge && selectedBadge.nid}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-md-12 mb-2">
                    <h4>Are you sure, you want to delete this production?</h4>
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
                    marginRight: "10px",
                  }}
                  onClick={() => {
                    deleteProductionService({
                      id: selectedBadge.ref,
                    }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          onLoad(filter);
                          toggleTransferDepartmentModal(false);
                          toast.success(res.data.msg);
                        } else {
                          toast.error(res.data.msg);
                        }
                      } else {
                        toast.error("Something went wrong.");
                      }
                    });
                  }}
                >
                  Delete
                </button>
                <button
                  className="btn btn-theme"
                  onClick={() => toggleTransferDepartmentModal(false)}
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

  return (
    <PageWrapper title="All Productions">
      {modalChangeStatus()}
      {modalDelete()}
      {multiSelectModal()}
      <div className="row card p-3">
        <div className="col-12 ">
          <div className="col-12">
            <Datatable
              options={options}
              columns={columns}
              filter={filter}
              data={userData}
              totalRows={totalRows}
              lazyLoad={onLoad}
            ></Datatable>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AllProductions;
