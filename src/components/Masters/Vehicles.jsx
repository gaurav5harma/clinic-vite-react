import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  updateActionsServices,
  getAllCentersService,
  addNewCenterService,
  updateCenterService,
  getActiveCentersListService,
  getAllAgentsServices,
  addNewAgentService,
  updateAgentService,
  getAllVehiclesServices,
} from "../../services/HTTPService";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { logout } from "../../services/AuthService";
import PageWrapper from "../../hoc/PageWrapper";
import Icons from "../../assets/theme/Icons";
import Datatable from "../Shared/Datatable/Datatable";
import { NumInput, Select, TextInput } from "../Shared/Elements";
import { FaEdit } from "react-icons/fa";
import Colors from "../../assets/theme/Colors";

const Vehicles = (props) => {
  const navigate = useNavigate();
  const componentRef = useRef();
  //
  const defaultPayload = {
    updateKey: "",
    registration: "",
    agent: "",
    category: "",
    status: "",
  };
  const columns = [
    {
      name: "registration",
      title: "Vehicle No.",
      sorting: false,
    },
    {
      name: "category",
      title: "Category",
      sorting: true,
    },
    {
      name: "agent",
      title: "Agent",
      sorting: true,
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
  const [totalRows, setTotalRows] = useState(0);
  const [showDataTable, setShowDataTable] = useState(true);
  //
  // useEffect(() => {
  //   getDetails();
  // }, []);

  // const getDetails = () => {
  //   getActiveCentersListService().then((res) => {
  //     if (res.status === 200) {
  //       if (res.data.status === "success") {
  //         setCenters(res.data.data);
  //       } else {
  //         toast.error(res.data.msg);
  //       }
  //     } else {
  //       toast.error("Something went wrong.");
  //     }
  //   });
  // };

  // const editSelectHandler = (selData) => {
  //   setFormsData((payload) => ({
  //     ...payload,
  //     ["updateKey"]: selData.id,
  //     ["name"]: selData.name,
  //     ["mobile"]: selData.mobile,
  //     ["center"]: selData.center,
  //     ["address"]: selData.address,
  //     ["status"]: selData.status2,
  //   }));
  //   // componentRef.current.focus();
  //   setAddNew(true);
  //   setEditMode(true);
  // };
  const onLoad = (filterVal) => {
    getAllVehiclesServices(filterVal).then((res) => {
      if (res.data.response === "success") {
        let dta = res.data.data;
        let selectedData = dta;
        // dta.map((el, key) => {
        // dta[key].actionStatus = el.status;
        // let status = (
        //   <div key={key} style={{ width: "20px", textAlign: "center" }}>
        //     {/* Select Action Status Start */}
        //     <OverlayTrigger
        //       placement="center"
        //       delay={{ show: 200, hide: 200 }}
        //       overlay={
        //         <Tooltip id="button-tooltip" {...props}>
        //           {el.status}
        //         </Tooltip>
        //       }
        //     >
        //       <div>
        //         <span
        //           className={`badge ${
        //             el.status === "active" ? "bg-success" : "bg-danger"
        //           } me-1`}
        //           style={{ textTransform: "capitalize" }}
        //         >
        //           {el.status}
        //         </span>
        //       </div>
        //     </OverlayTrigger>
        //     {/* Select Action Status End */}
        //   </div>
        // );
        // let action = (
        //   <div key={key} style={{ width: "70px" }}>
        //     {/* Select Client ID Start */}
        //     <OverlayTrigger
        //       placement="top"
        //       delay={{ show: 200, hide: 200 }}
        //       overlay={
        //         <Tooltip id="button-tooltip" {...props}>
        //           Edit
        //         </Tooltip>
        //       }
        //     >
        //       <span
        //         style={{
        //           marginRight: "10px",
        //           cursor: "pointer",
        //         }}
        //         onClick={() => {
        //           // navigate(`/access-master`, { state: { id: 10 } });
        //           editSelectHandler(selectedData[key]);
        //         }}
        //       >
        //         <FaEdit />
        //       </span>
        //     </OverlayTrigger>
        //     {/* Select Client ID End */}
        //   </div>
        // );
        // dta[key].status = status;
        // dta[key].action = action;
        // });
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
  // const submitHandler = () => {
  //   if (formsData.name === "") {
  //     toast.error("Please enter Agent Name!");
  //   } else if (formsData.mobile === "") {
  //     toast.error("Please enter Agent Mobile");
  //   } else {
  //     if (!editMode) {
  //       addActionHandler(formsData);
  //     } else {
  //       updateActionHandler(formsData);
  //     }
  //   }
  // };
  // const addActionHandler = (payload) => {
  //   addNewAgentService(payload)
  //     .then((response) => {
  //       if (response.data.status === "success") {
  //         toast.success(response.data.msg);
  //         resetForm();
  //       } else if (response.data.status === "warning") {
  //         toast.warning(response.data.msg);
  //       } else if (response.data.status === "error") {
  //         toast.error(response.data.msg);
  //       } else if (response.data.status === "logout") {
  //         logout();
  //         navigate("/login");
  //       } else {
  //         toast.error(
  //           "Error in Registering, Something went wrong. " +
  //             response.data.status
  //         );
  //       }
  //       setShowDataTable(true);
  //     })
  //     .catch((res) => {
  //       navigate("/dashboard");
  //       toast.error("Catch Error, Something went wrong");
  //     });
  //   setShowDataTable(false);
  // };
  // const updateActionHandler = (payload) => {
  //   updateAgentService(payload)
  //     .then((response) => {
  //       if (response.data.status === "success") {
  //         toast.success(response.data.msg);
  //         resetForm();
  //         setEditMode(false);
  //         setAddNew(false);
  //       } else if (response.data.status === "warning") {
  //         toast.warning(response.data.msg);
  //       } else if (response.data.status === "error") {
  //         toast.error(response.data.msg);
  //       } else if (response.data.status === "logout") {
  //         logout();
  //         navigate("/login");
  //       } else {
  //         toast.error(
  //           "Error in Registering, Something went wrong. " +
  //             response.data.status
  //         );
  //       }
  //       setShowDataTable(true);
  //     })
  //     .catch((res) => {
  //       navigate("/dashboard");
  //       toast.error("Catch Error, Something went wrong");
  //     });
  //   setShowDataTable(false);
  // };
  // console.log("formsData:>>>", formsData);
  return (
    <PageWrapper title={"Vehicles"}>
      <div className="row card">
        {toggleAddNew === true ? (
          <div className="col-12 p-3" style={{ background: "lightblue" }}>
            <div className="row">
              <h3 style={{ color: "navy" }}>
                {editMode ? "Update Agent" : "Add New Agent"}
              </h3>
              <div className="col-md-2 col-12 mb-3">
                <TextInput
                  label={"Name"}
                  // ref={componentRef}
                  value={formsData.name}
                  onChange={(val) => {
                    setFormsData({ ...formsData, name: val });
                  }}
                  autoFocus
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
                />
              </div>
              <div className="col-md-2 col-12 mb-3">
                <Select
                  label={"Center"}
                  value={formsData.center}
                  data={centers}
                  onChange={(val) => {
                    setFormsData({ ...formsData, center: val });
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
                  {editMode === true ? "Update Agent" : "Add Agent"}
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
        {/* <div className="col-12 text-right mt-2">
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
        </div> */}
        {showDataTable && (
          <div className="col-12">
            {toggleAddNew === true ? <h3>All Vehicles</h3> : null}
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

export default Vehicles;
