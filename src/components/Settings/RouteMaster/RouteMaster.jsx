import React, { useState, useEffect, setTitle, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageWrapper from "../../../hoc/PageWrapper";
import {
  addNewModuleService,
  getAllModulesService,
  getAppModulesService,
  updateModuleService,
} from "../../../services/HTTPService";
import Datatable from "../../Shared/Datatable/Datatable";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Icons from "../../../assets/theme/Icons";
import QuickLinks from "../../Shared/QuickLinks/QuickLinks";

const RouteMaster = (props) => {
  const navigate = useNavigate();
  const componentRef = useRef();

  const defaultPayload = {
    id: "",
    name: "",
    path: "",
    icon: "",
    isParent: false,
    hasChild: false,
    parentId: "",
    component: "",
    priority: "0",
    visibility: false,
  };

  const qLinks = [
    {
      title: "Access Master",
      route: "/access-master",
    },
    {
      title: "Action Master",
      route: "/action-master",
    },
  ];

  const columns = [
    {
      name: "name",
      title: "Module Name",
      sorting: false,
    },
    {
      name: "path",
      title: "Path",
      sorting: true,
    },
    // {
    //   name: "icon",
    //   title: "Icon",
    //   sorting: true,
    // },
    {
      name: "parentModule",
      title: "Parent Module",
      sorting: false,
    },
    {
      name: "isParent",
      title: "Is Parent",
      sorting: true,
    },
    {
      name: "hasChild",
      title: "Children",
      sorting: true,
    },
    {
      name: "visibility",
      title: "Visible",
      sorting: true,
    },
    {
      name: "priority",
      title: "Priority",
      sorting: true,
    },
    {
      name: "action",
      title: "Action",
      sorting: false,
    },
  ];
  const options = {
    theme: "",
    rows: [50, 100, 200, 500],
    pagination: true,
    globalFilter: true,
  };

  const cusFilter = {
    page: 1,
    globalFilter: "",
    rows: 50,
    sortOrder: -1,
    sortField: "id",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [editMode, setEditMode] = useState(false);
  const [modules, setModules] = useState([]);
  const [filter, setFilter] = useState(cusFilter);
  const [modulesData, setModulesData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const getModules = () => {
    getAppModulesService().then((response) => {
      if (response.status === 200) {
        setModules(response.data);
      } else {
        console.log("error");
        navigate(`/dashboard`);
      }
    });
  };
  useEffect(() => {
    getModules();
  }, []);
  const selectModule = (module) => {
    setPayload((payload) => ({
      ...payload,
      id: module.id,
      name: module.name,
      path: module.path,
      parentId: module.parent,
      visibility: module.vis,
      component: module.component,
      isParent: module.par,
      priority: module.priority,
      hasChild: module.cld,
    }));
    componentRef.current.focus();
    setEditMode(true);
  };

  const onLoad = (filterVal) => {
    getAllModulesService(filterVal).then((res) => {
      let dta = res.data.data;
      let modules = dta;
      dta.map((el, key) => {
        dta[key].vis = el.visibility;
        dta[key].par = el.isParent;
        dta[key].cld = el.hasChild;
        let action = (
          <div key={key} style={{ width: "20px" }}>
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
              <div className="col-md-2 col-sm-4 ">
                <span
                  className="btn btn-outline-theme btn-pill btn-icon"
                  onClick={() => {
                    selectModule(modules[key]);
                  }}
                >
                  <Icons.BsPencilSquare />
                </span>
              </div>
            </OverlayTrigger>
            {/* Select Client ID End */}
          </div>
        );
        dta[key].action = action;
        if (el.visibility) {
          dta[key].visibility = (
            <span style={{ color: "green" }}>
              <Icons.BsFillCheckCircleFill />
            </span>
          );
        } else {
          dta[key].visibility = (
            <span style={{ color: "red" }}>
              <Icons.BsFillXCircleFill />
            </span>
          );
        }
        if (el.isParent) {
          dta[key].isParent = (
            <span style={{ color: "green" }}>
              <Icons.BsFillCheckCircleFill />
            </span>
          );
        } else {
          dta[key].isParent = (
            <span style={{ color: "red" }}>
              <Icons.BsFillXCircleFill />
            </span>
          );
        }
        if (el.hasChild) {
          dta[key].hasChild = (
            <span style={{ color: "green" }}>
              <Icons.BsFillCheckCircleFill />
            </span>
          );
        } else {
          dta[key].hasChild = (
            <span style={{ color: "red" }}>
              <Icons.BsFillXCircleFill />
            </span>
          );
        }
        // return 0;
      });
      setModulesData(dta);
      setTotalRows(res.data.total);
      setFilter(filterVal);
    });
  };

  const cancel = () => {
    setPayload(defaultPayload);
    setEditMode(false);
  };

  const validate = () => {
    if (payload.name === "") {
      toast.error("Please enter Module Name");
    } else if (payload.path === "" && !payload.hasChild) {
      toast.error("Please enter Path");
    } else if (payload.component === "" && !payload.hasChild) {
      toast.error("Please enter Component Name");
    } else {
      if (editMode === true) {
        updateModuleService(payload).then((res) => {
          if (res.status === 200) {
            if (res.data.status === "success") {
              toast.success(res.data.msg);
              setPayload(defaultPayload);
              getModules();
              onLoad(filter);
              setEditMode(false);
            } else {
              toast.error(res.data.msg);
            }
          }
        });
      } else {
        addNewModuleService(payload).then((res) => {
          if (res.status === 200) {
            if (res.data.status === "success") {
              toast.success(res.data.msg);
              setPayload(defaultPayload);
              getModules();
              onLoad(filter);
            } else {
              toast.error(res.data.msg);
            }
          }
        });
      }
    }
  };

  return (
    <PageWrapper title="Route Master">
      <div className="row card p-3">
        <div className="col-12">
          <QuickLinks data={qLinks} />
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                Route Name
              </label>
              <input
                type="text"
                ref={componentRef}
                className="form-control"
                value={payload.name}
                placeholder="Route Name"
                onChange={(e) => {
                  setPayload({ ...payload, ["name"]: e.target.value });
                }}
              />
            </div>
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                Path
              </label>
              <input
                type="text"
                className="form-control"
                value={payload.path}
                placeholder="Path"
                onChange={(e) => {
                  setPayload({ ...payload, ["path"]: e.target.value });
                }}
              />
            </div>
            {/* <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                Icon
              </label>
              <input
                type="text"
                className="form-control"
                value={payload.icon}
                placeholder="Icon"
                onChange={(e) => {
                  setPayload({ ...payload, ["icon"]: e.target.value });
                }}
              />
            </div> */}
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                Component
              </label>
              <input
                type="text"
                ref={componentRef}
                className="form-control"
                value={payload.component}
                placeholder="Component Name"
                onChange={(e) => {
                  setPayload({ ...payload, ["component"]: e.target.value });
                }}
              />
            </div>
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                Priority
              </label>
              <select
                className="form-select"
                value={payload.priority}
                onChange={(e) => {
                  setPayload({ ...payload, ["priority"]: e.target.value });
                }}
              >
                <option value="0">Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                Under
              </label>
              <select
                className="form-select"
                value={payload.parentId}
                onChange={(e) => {
                  setPayload({ ...payload, ["parentId"]: e.target.value });
                }}
              >
                <option value="0">Independent Module</option>
                {modules &&
                  modules.map((module, key) => {
                    return (
                      <option value={module.value} key={key}>
                        {module.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                &nbsp;
              </label>
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={payload.isParent}
                  onChange={(e) => {
                    setPayload({ ...payload, ["isParent"]: e.target.checked });
                  }}
                />
                <span className="form-check-label">Parent Module</span>
              </label>
            </div>
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                &nbsp;
              </label>
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={payload.hasChild}
                  onChange={(e) => {
                    setPayload({ ...payload, ["hasChild"]: e.target.checked });
                  }}
                />
                <span className="form-check-label">Has Child Modules</span>
              </label>
            </div>
            <div className="col-md-3 col-12 mb-3">
              <label htmlFor="" className="form-label">
                &nbsp;
              </label>
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={payload.visibility}
                  onChange={(e) => {
                    setPayload({
                      ...payload,
                      ["visibility"]: e.target.checked,
                    });
                  }}
                />
                <span className="form-check-label">Visible on Navigation</span>
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-right">
              <button className="btn btn-theme" onClick={validate}>
                {editMode === true ? "Update Module" : "Add Module"}
              </button>
              {editMode === true ? (
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
        <div className="col-12 ">
          <h3>All Modules</h3>
          <Datatable
            options={options}
            columns={columns}
            filter={filter}
            data={modulesData}
            totalRows={totalRows}
            lazyLoad={onLoad}
          ></Datatable>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RouteMaster;
