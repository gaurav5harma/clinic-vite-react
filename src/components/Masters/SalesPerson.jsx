import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addNewSalesPersonService,
  getActiveCentersListService,
  getActivKAMsListService,
  getAllSalesPersonService,
  updateSalesPersonService,
} from "../../services/HTTPService";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getUserData, logout } from "../../services/AuthService";
import PageWrapper from "../../hoc/PageWrapper";
import Icons from "../../assets/theme/Icons";
import Datatable from "../Shared/Datatable/Datatable";
import { NumInput, Select, TextInput } from "../Shared/Elements";
import { FaEdit } from "react-icons/fa";
import Colors from "../../assets/theme/Colors";

const SalesPerson = (props) => {
  const navigate = useNavigate();
  const componentRef = useRef();
  //
  const defaultPayload = {
    updateKey: "",
    kam: "",
    name: "",
    address: "",
    mobile: "",
    center: "",
    status: "",
    aadhar: "",
    pan: "",
  };
  const columns = [
    {
      name: "name",
      title: "Name",
      sorting: false,
    },
    {
      name: "mobile",
      title: "Mobile",
      sorting: true,
    },
    {
      name: "center",
      title: "Center",
      sorting: true,
    },
    {
      name: "address",
      title: "Address",
      sorting: true,
    },
    {
      name: "aadhar",
      title: "Aadhar",
      sorting: true,
    },
    {
      name: "pan",
      title: "Pan",
      sorting: true,
    },
    {
      name: "user",
      title: "KAM",
      sorting: true,
    },
    {
      name: "status",
      title: "Status",
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
    rows: [5, 10, 20, 50, 100, 200, 500],
    print: true,
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
  const [toggleAddNew, setAddNew] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filter, setFilter] = useState(cusFilter);
  const [userData, setUsersData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [kams, setKAMs] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [showDataTable, setShowDataTable] = useState(true);
  //
  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = () => {
    getActiveCentersListService().then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setCenters(res.data.data);
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
    getActivKAMsListService().then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setKAMs(res.data.data);
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
  };

  const editSelectHandler = (selData) => {
    setFormsData((payload) => ({
      ...payload,
      ["updateKey"]: selData.id,
      ["name"]: selData.name,
      ["kam"]: selData.kam,
      ["mobile"]: selData.mobile,
      ["center"]: selData.center,
      ["address"]: selData.address,
      ["status"]: selData.status2,
    }));
    // componentRef.current.focus();
    setAddNew(true);
    setEditMode(true);
  };
  const onLoad = (filterVal) => {
    getAllSalesPersonService(filterVal).then((res) => {
      if (res.data.response === "success") {
        let dta = res.data.data;
        let selectedData = dta;
        dta.map((el, key) => {
          dta[key].actionStatus = el.status;
          let status = (
            <div key={key} style={{ width: "20px", textAlign: "center" }}>
              {/* Select Action Status Start */}
              <OverlayTrigger
                placement="center"
                delay={{ show: 200, hide: 200 }}
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    {el.status}
                  </Tooltip>
                }
              >
                <div>
                  <span
                    className={`badge ${
                      el.status === "active" ? "bg-success" : "bg-danger"
                    } me-1`}
                    style={{ textTransform: "capitalize" }}
                  >
                    {el.status}
                  </span>
                </div>
              </OverlayTrigger>
              {/* Select Action Status End */}
            </div>
          );
          let action = (
            <div key={key} style={{}}>
              {/* Select Client ID Start */}
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
                    editSelectHandler(selectedData[key]);
                  }}
                >
                  <FaEdit />
                </span>
              </OverlayTrigger>
              {/* Select Client ID End */}
            </div>
          );
          dta[key].status = status;

          if (getUserData().role === "admin") {
            dta[key].action = action;
          }
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
    setEditMode(false);
  };
  const resetForm = () => {
    setFormsData(defaultPayload);
  };
  const submitHandler = () => {
    if (formsData.name === "") {
      toast.error("Please enter Sales Incharge Name!");
    } else if (formsData.mobile === "") {
      toast.error("Please enter Sales Incharge Mobile");
    } else {
      if (!editMode) {
        addActionHandler(formsData);
      } else {
        updateActionHandler(formsData);
      }
    }
  };
  const addActionHandler = (payload) => {
    addNewSalesPersonService(payload)
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg);
          resetForm();
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
        // navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
      });
    setShowDataTable(false);
  };
  const updateActionHandler = (payload) => {
    updateSalesPersonService(payload)
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg);
          resetForm();
          setEditMode(false);
          setAddNew(false);
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
        // navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
      });
    setShowDataTable(false);
  };
  // console.log("formsData:>>>", formsData);
  return (
    <PageWrapper title={"Sales Person"}>
      <div className="row card">
        {toggleAddNew === true ? (
          <div className="col-12 p-3" style={{ background: "lightblue" }}>
            <div className="row">
              <h3 style={{ color: "navy" }}>
                {editMode ? "Update Sales Person" : "Add New Sales Person"}
              </h3>
              {getUserData().role === "admin" ? (
                <div className="col-md-2 col-12 mb-3">
                  <Select
                    label={"KAM"}
                    value={formsData.kam}
                    data={kams}
                    onChange={(val) => {
                      if (val !== "") {
                        let idx = kams.findIndex(
                          (x) => Number(x.value) === Number(val)
                        );
                        let cid = kams[idx].center;
                        setFormsData({
                          ...formsData,
                          kam: val,
                          center: cid,
                        });
                      } else {
                        setFormsData({
                          ...formsData,
                          kam: val,
                          center: "",
                        });
                      }
                    }}
                  />
                </div>
              ) : null}

              {getUserData().role === "admin" ? (
                <div className="col-md-2 col-12 mb-3">
                  <TextInput
                    label={"Center"}
                    value={formsData.center}
                    // data={centers}
                    // onChange={(val) => {
                    //   setFormsData({ ...formsData, center: val });
                    // }}
                    disabled={true}
                    readOnly={true}
                  />
                </div>
              ) : null}
              <div className="col-md-2 col-12 mb-3">
                <TextInput
                  label={"Name"}
                  // ref={componentRef}
                  value={formsData.name}
                  onChange={(val) => {
                    setFormsData({ ...formsData, name: val });
                  }}
                  autoFocus
                  disabled={
                    editMode === true && getUserData().role !== "admin"
                      ? true
                      : false
                  }
                />
              </div>
              <div className="col-md-2 col-12 mb-3">
                <NumInput
                  label={"Mobile"}
                  value={formsData.mobile}
                  onChange={(val) => {
                    if (val.length <= 10)
                      setFormsData({ ...formsData, mobile: val });
                  }}
                  disabled={
                    editMode === true && getUserData().role !== "admin"
                      ? true
                      : false
                  }
                />
              </div>
              <div className="col-md-2 col-12 mb-3">
                <NumInput
                  label={"Aadhar"}
                  value={formsData.aadhar}
                  onChange={(val) => {
                    if (val.length <= 12)
                      setFormsData({ ...formsData, aadhar: val });
                  }}
                  disabled={
                    editMode === true && getUserData().role !== "admin"
                      ? true
                      : false
                  }
                />
              </div>
              <div className="col-md-2 col-12 mb-3">
                <TextInput
                  label={"PAN"}
                  value={formsData.pan}
                  onChange={(val) => {
                    if (val.length <= 10)
                      setFormsData({
                        ...formsData,
                        pan: val.toUpperCase(),
                      });
                  }}
                  disabled={
                    editMode === true && getUserData().role !== "admin"
                      ? true
                      : false
                  }
                />
              </div>
              <div className="col-md-4 col-12 mb-3">
                <TextInput
                  label={"Address"}
                  value={formsData.address}
                  onChange={(val) => {
                    setFormsData({ ...formsData, address: val });
                  }}
                  disabled={
                    editMode === true && getUserData().role !== "admin"
                      ? true
                      : false
                  }
                />
              </div>
              {editMode ? (
                <div className="col-md-3 col-12 mb-3">
                  <Select
                    label={"Status"}
                    value={formsData.status}
                    data={[
                      { name: "Active", value: "active" },
                      { name: "Inactive", value: "inactive" },
                    ]}
                    onChange={(val) => {
                      setFormsData({ ...formsData, status: val });
                    }}
                  />
                </div>
              ) : null}
              <div className="col-12 text-center mt-2">
                <button className="btn btn-theme" onClick={submitHandler}>
                  {editMode === true ? (
                    <Icons.BsCheck2Square style={{ marginRight: "5px" }} />
                  ) : (
                    <Icons.BsPlusCircle style={{ marginRight: "5px" }} />
                  )}
                  {editMode === true
                    ? "Update Sales Person"
                    : "Add Sales Person"}
                </button>
                <button
                  className="btn btn-theme"
                  style={{ marginLeft: "20px" }}
                  onClick={cancel}
                >
                  <Icons.BsReverseBackspaceReverse
                    style={{ marginRight: "5px" }}
                  />
                  {editMode === true ? "Cancel" : "Clear"}
                </button>
              </div>
            </div>
            {/* <hr className="mt-3 mb-2" /> */}
          </div>
        ) : null}
        <div className="col-12 text-right mt-2">
          <h5
            className="m-0"
            style={{ cursor: "pointer", color: Colors.defaultThemeColor }}
            onClick={() => {
              let status = toggleAddNew;
              status = !status;
              setAddNew(status);
            }}
          >
            + Add New
          </h5>
        </div>
        {showDataTable && (
          <div className="col-12">
            {toggleAddNew === true ? <h3>All Sales Person</h3> : null}
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

export default SalesPerson;
