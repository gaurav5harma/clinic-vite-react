import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllActionsServices,
  addNewActionsServices,
  updateActionsServices,
} from "../../../services/HTTPService";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { logout } from "../../../services/AuthService";
import PageWrapper from "../../../hoc/PageWrapper";
import Icons from "../../../assets/theme/Icons";
import Datatable from "../../../components/Shared/Datatable/Datatable";

const ActionMaster = (props) => {
  const navigate = useNavigate();
  const componentRef = useRef();
  //
  const defaultPayload = {
    updateKey: "",
    name: "",
    slug: "",
    title: "",
    actionStatus: 1,
  };
  const columns = [
    {
      name: "name",
      title: "Name",
      sorting: false,
    },
    {
      name: "slug",
      title: "Slug",
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
      ["slug"]: selData.slug,
      ["title"]: selData.title,
      ["actionStatus"]: selData.actionStatus,
    }));
    componentRef.current.focus();
    setEditMode(true);
  };
  const onLoad = (filterVal) => {
    getAllActionsServices(filterVal).then((res) => {
      if (res.data.response === "success") {
        let dta = res.data.data;
        let selectedData = dta;
        dta.map((el, key) => {
          dta[key].actionStatus = el.status;
          let status = (
            <div key={key} style={{ width: "20px" }}>
              {/* Select Action Status Start */}
              <OverlayTrigger
                placement="right"
                delay={{ show: 200, hide: 200 }}
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    {el.status === 1 ? "Active" : "Not Active"}
                  </Tooltip>
                }
              >
                <div>
                  <span
                    className={`badge ${
                      el.status === 1 ? "bg-success" : "bg-danger"
                    } me-1`}
                  ></span>
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
                  <Icons.BsFillChatSquareDotsFill />
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
  const formDataHandler = (e) => {
    const { name, value } = e.target;
    setFormsData({ ...formsData, [name]: value });
  };
  const submitHandler = () => {
    if (formsData.name === "") {
      toast.error("Action Name Required !");
    } else if (formsData.slug === "") {
      toast.error("Action Slug Description Required");
    } else {
      if (!editMode) {
        addActionHandler(formsData);
      } else {
        updateActionHandler(formsData);
      }
    }
  };
  const addActionHandler = (payload) => {
    addNewActionsServices(payload)
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
    updateActionsServices(payload)
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg);
          resetForm();
          setEditMode(false);
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
    <PageWrapper title="User Master">
      <div className="row card p-3">
        <div className="col-12">
          <div className="row">
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="form-control"
                type="text"
                ref={componentRef}
                name="name"
                value={formsData.name}
                placeholder="Name"
                onChange={formDataHandler}
              />
            </div>
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                Slug <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="form-control"
                type="text"
                name="slug"
                value={formsData.slug}
                placeholder="Slug"
                onChange={formDataHandler}
              />
            </div>
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                Title
              </label>
              <input
                className="form-control"
                type="text"
                name="title"
                value={formsData.title}
                placeholder="Title"
                onChange={formDataHandler}
              />
            </div>
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                Actions Status
              </label>
              <select
                className="form-select"
                name="actionStatus"
                value={formsData.actionStatus}
                onChange={formDataHandler}
              >
                <option value={1}>Active</option>
                <option value={0}>Not</option>
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
                {editMode === true ? (
                  <Icons.BsCheck2Square style={{ marginRight: "5px" }} />
                ) : (
                  <Icons.BsPlusCircle style={{ marginRight: "5px" }} />
                )}
                {editMode === true ? "Update Action" : "Add Action"}
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

export default ActionMaster;
