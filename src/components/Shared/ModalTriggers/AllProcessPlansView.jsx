import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Icons from "../../../assets/theme/Icons";
import "react-confirm-alert/src/react-confirm-alert.css";
import { OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";
import PropTypes from "prop-types";
import {
  GetAllItems,
  getAllProcessPlansService,
  setProcessPlanAsDefaultService,
  updateFGDetailsService,
} from "../../../services/HTTPService";
import Datatable from "../../Shared/Datatable/Datatable";
import { Modal, Button } from "react-bootstrap";
import {
  FaBars,
  FaRupeeSign,
  FaUserEdit,
  FaPen,
  FaUserPlus,
  FaFileDownload,
  FaFolderPlus,
  FaFolderOpen,
  FaBuffer,
} from "react-icons/fa";
import Colors from "./../../../assets/theme/Colors";
import DialogDeleteData from "../../Shared/DialogBoxes/DialogDeleteData";
import myTable from "../../../assets/theme/Table";
import CreateProcessPlanView from "./CreateProcessPlanView";

const AllProcessPlansView = (props) => {
  const navigate = useNavigate();
  const [processPlans, setProcessPlans] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [selectedProcess, setProcess] = useState(null);
  // const [path, setPath] = useState(useLocation().pathname);
  const pathName = location.pathname;
  const customToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  ));

  useEffect(() => {
    // setPath(location.pathname)
    onLoad(filter);
  }, [pathName]);
  //
  const columns = [
    {
      name: "action",
      title: "Action",
      sorting: false,
      width: "10%",
    },
    {
      name: "ref",
      title: "ERP Code",
      sorting: true,
    },
    {
      name: "createdBy",
      title: "Created By",
      sorting: true,
    },
    {
      name: "createdAt",
      title: "Created At",
      sorting: true,
    },
    {
      name: "approvedBy",
      title: "Approved By",
      sorting: true,
    },
    {
      name: "approvedAt",
      title: "Approval Date",
      sorting: true,
    },
    {
      name: "status",
      title: "Status",
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
    rows: 50,
    sortOrder: -1,
    sortField: "id",
  };
  cusFilter.propTypes = {
    page: PropTypes.number,
    globalFilter: PropTypes.string,
    rows: PropTypes.number,
    sortOrder: PropTypes.number,
    sortField: PropTypes.string,
  };
  const [filter, setFilter] = useState(cusFilter);
  const [processPlanModal, toggleProcessPlanModal] = useState(false);
  const [processViewModal, toggleProcessViewModal] = useState(false);

  const editItems = (id) => {
    navigate(`/edit-item/${id}`);
  };

  const generateClientSpecs = (id) => {
    navigate(`/client-specs/${id}`);
  };

  const createProcessPlanModal = () => {
    return (
      <Modal
        show={processPlanModal}
        onHide={() => toggleProcessPlanModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Body style={{ padding: "0px 8px" }}>
          <CreateProcessPlanView
            item={props.item.id}
            plyData={props.item.plyData}
            visibility={(e) => {
              toggleProcessPlanModal(e);
              onLoad(filter);
            }}
          />
        </Modal.Body>
      </Modal>
    );
  };

  const viewProcessModal = () => {
    return (
      <Modal
        show={processViewModal}
        onHide={() => toggleProcessViewModal(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        style={{ background: "#fafafa99" }}
      >
        <Modal.Body
          style={{
            padding: "15px",
            background: "rgb(255 215 146)",
            marginTop: "50px",
          }}
        >
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ width: "25%" }}>SNo.</th>
                <th style={{ width: "25%" }}>Stage</th>
                <th style={{ width: "50%" }}>Process</th>
              </tr>
            </thead>
            <tbody>
              {selectedProcess &&
                JSON.parse(selectedProcess.process).map((dta, key) => {
                  return (
                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{dta.stage}</td>
                      <td>{dta.process}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    );
  };

  const onLoad = (filterVal) => {
    filterVal.addFilter = { item: props.item.id };
    getAllProcessPlansService(filterVal).then((res) => {
      let dta = res.data.data;
      dta.map((el, key) => {
        let action = (
          <div style={{ width: "50px" }}>
            <Dropdown style={{ width: "25px", float: "left" }}>
              <Dropdown.Toggle
                as={customToggle}
                id="dropdown-basic"
                size="10px"
              >
                <FaBars
                  size={16}
                  style={{ color: "#000" }}
                  id="dropdown-basic"
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setProcessPlanAsDefaultService({ key: el.id }).then(
                      (res) => {
                        if (res.status === 200) {
                          if (res.data.status === "success") {
                            toast.success(res.data.msg);
                            onLoad(filterVal);
                          } else {
                            toast.error(res.data.msg);
                          }
                        } else {
                          toast.error("Something went wrong.");
                        }
                      }
                    );
                  }}
                >
                  <FaPen style={{ color: "#000", marginRight: "16px" }} />
                  Set as Default
                </Dropdown.Item>
                {/* Delete Item */}
                <Dropdown.Item>
                  <DialogDeleteData
                    id={el.id}
                    filter={filter}
                    lazyLoad={onLoad}
                    whats={myTable.processPlan}
                    text={"Delete Process Plan"}
                  />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/*  */}
          </div>
        );
        let ref = (
          <div>
            {el.isDefault === true ? (
              <span style={{ color: "green" }}>{el.ref}</span>
            ) : (
              <span style={{ color: "black" }}>{el.ref}</span>
            )}
          </div>
        );
        dta[key].ref = ref;
        dta[key].action = action;
        return 0;
      });
      setProcessPlans(dta);
      setTotalRows(res.data.total);
      setFilter(filterVal);
    });
  };

  return (
    <>
      {createProcessPlanModal()}
      {viewProcessModal()}
      <div className="row card p-3">
        <div className="row">
          <div className="col-12 text-left">
            <span
              className=""
              style={{ color: Colors.defaultThemeColor, cursor: "pointer" }}
              onClick={() => toggleProcessPlanModal(true)}
            >
              + Create Process Plan
            </span>
          </div>
          <div className="col-12 app-card-settings app-card pt-1 pb-1">
            <Datatable
              options={options}
              columns={columns}
              filter={filter}
              data={processPlans}
              totalRows={totalRows}
              lazyLoad={onLoad}
              handleDoubleClick={(e) => {
                setProcess(e);
                console.log(JSON.parse(e.process));
                toggleProcessViewModal(true);
              }}
            ></Datatable>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProcessPlansView;
