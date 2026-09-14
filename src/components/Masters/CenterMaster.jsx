import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  updateActionsServices,
  getAllCentersService,
  addNewCenterService,
  updateCenterService,
} from "../../services/HTTPService";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { logout } from "../../services/AuthService";
import PageWrapper from "../../hoc/PageWrapper";
import Icons from "../../assets/theme/Icons";
import Datatable from "../../components/Shared/Datatable/Datatable";
import { Select, TextInput } from "../Shared/Elements";
import { FaEdit } from "react-icons/fa";
import Colors from "../../assets/theme/Colors";

const CenterMaster = (props) => {
  const navigate = useNavigate();
  const componentRef = useRef();
  //
  const defaultPayload = {
    updateKey: "",
    name: "",
    address: "",
    status: "",
  };
  const columns = [
    {
      name: "name",
      title: "Name",
      sorting: false,
    },
    {
      name: "address",
      title: "Address",
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
  const [toggleAddNew, setAddNew] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filter, setFilter] = useState(cusFilter);
  const [userData, setUsersData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [showDataTable, setShowDataTable] = useState(true);
  //
  const editSelectHandler = (selData) => {
    setFormsData((payload) => ({
      ...payload,
      ["updateKey"]: selData.id,
      ["name"]: selData.name,
      ["address"]: selData.address,
      ["status"]: selData.status2,
    }));
    // componentRef.current.focus();
    setAddNew(true);
    setEditMode(true);
  };
  const onLoad = (filterVal) => {
    getAllCentersService(filterVal).then((res) => {
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
            <div key={key} style={{ width: "70px" }}>
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
          dta[key].action = action;
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
      toast.error("Please enter Center Name!");
    } else if (formsData.address === "") {
      toast.error("Please enter Center Address");
    } else {
      if (!editMode) {
        addActionHandler(formsData);
      } else {
        updateActionHandler(formsData);
      }
    }
  };
  const addActionHandler = (payload) => {
    addNewCenterService(payload)
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
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
      });
    setShowDataTable(false);
  };
  const updateActionHandler = (payload) => {
    updateCenterService(payload)
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
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
      });
    setShowDataTable(false);
  };
  // console.log("formsData:>>>", formsData);
  return (
    <PageWrapper title={"Center Master"}>
      <div className="row card">
        {toggleAddNew === true ? (
          <div className="col-12 p-3" style={{ background: "lightblue" }}>
            <div className="row">
              <h3 style={{ color: "navy" }}>
                {editMode ? "Update Center" : "Add New Center"}
              </h3>
              <div className="col-md-3 col-12 mb-3">
                <TextInput
                  label={"Name"}
                  // ref={componentRef}
                  value={formsData.name}
                  onChange={(val) => {
                    setFormsData({ ...formsData, name: val });
                  }}
                />
              </div>
              <div className="col-md-6 col-12 mb-3">
                <TextInput
                  label={"Address"}
                  value={formsData.address}
                  onChange={(val) => {
                    setFormsData({ ...formsData, address: val });
                  }}
                />
              </div>
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
              <div className="col-12 text-center mt-2">
                <button className="btn btn-theme" onClick={submitHandler}>
                  {editMode === true ? (
                    <Icons.BsCheck2Square style={{ marginRight: "5px" }} />
                  ) : (
                    <Icons.BsPlusCircle style={{ marginRight: "5px" }} />
                  )}
                  {editMode === true ? "Update Center" : "Add Center"}
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
            {toggleAddNew === true ? <h3>All Centers</h3> : null}
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

export default CenterMaster;
