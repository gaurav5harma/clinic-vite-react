import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteEntryService,
  getActiveStatusListService,
  getAllEntriesService,
  getEntryDetailsService,
  updateEntryStatusService,
} from "../../services/HTTPService";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  getCompanyData,
  getUserData,
  hasAccess,
  logout,
} from "../../services/AuthService";
import PageWrapper from "../../hoc/PageWrapper";
import Icons from "../../assets/theme/Icons";
import Datatable from "../Shared/Datatable/Datatable";
import { DateInput, NumInput, Select, TextInput } from "../Shared/Elements";
import {
  FaBars,
  FaCertificate,
  FaEdit,
  FaEvernote,
  FaFolderOpen,
  FaInfo,
  FaInfoCircle,
  FaReceipt,
  FaStickyNote,
  FaTimes,
  FaTimesCircle,
  FaTrash,
  FaTruck,
} from "react-icons/fa";
import Colors from "../../assets/theme/Colors";

const ViewEntries = (props) => {
  const key = useParams().ref;

  const navigate = useNavigate();
  const componentRef = useRef();
  //
  var current = new Date();
  current.setDate(current.getDate());
  var date = current.toISOString().substring(0, 10);
  const defaultPayload = {
    bookingDate: date,
    minBookingDate: date,
    checkupDate: date,
    updateKey: "",
    registration: "",
    agent: "",
    category: "",
    status: "",
  };
  const columns = [
    {
      name: "id",
      title: "#",
      sorting: false,
    },
    {
      name: "date",
      title: "Date",
      sorting: false,
    },
    {
      name: "vehicle",
      title: "Vehicle No.",
      sorting: false,
    },
    {
      name: "category",
      title: "Category",
      sorting: true,
    },
    {
      name: "center",
      title: "Center",
      sorting: true,
    },
    {
      name: "agent",
      title: "Agent",
      sorting: true,
    },
    {
      name: "salesPerson",
      title: "Sales Inc.",
      sorting: true,
    },
    {
      name: "user",
      title: "KAM",
      sorting: true,
    },
    {
      name: "remarks",
      title: "Remarks",
      sorting: true,
    },
    {
      name: "status",
      title: "Status",
      sorting: true,
    },
    {
      name: "action",
      title: "Action",
      sorting: true,
    },
  ];
  const columns2 = [
    {
      name: "id",
      title: "#",
      sorting: false,
    },
    {
      name: "date",
      title: "Date",
      sorting: false,
    },
    {
      name: "vehicle",
      title: "Vehicle No.",
      sorting: false,
    },
    {
      name: "category",
      title: "Category",
      sorting: true,
    },
    {
      name: "center",
      title: "Center",
      sorting: true,
    },
    {
      name: "salesPerson",
      title: "Sales Inc.",
      sorting: true,
    },
    {
      name: "user",
      title: "KAM",
      sorting: true,
    },
    {
      name: "remarks",
      title: "Remarks",
      sorting: true,
    },
    {
      name: "status",
      title: "Status",
      sorting: true,
    },
    {
      name: "action",
      title: "Action",
      sorting: true,
    },
  ];
  const options = {
    theme: "",
    rows: [5, 10, 20, 50, 100],
    pagination: true,
    print: true,
    globalFilter: true,
    autoSearch: false,
  };
  const cusFilter = {
    page: 1,
    globalFilter: "",
    rows: 50,
    sortOrder: -1,
    sortField: "id",
  };

  const [formsData, setFormsData] = useState(defaultPayload);
  const [upd, setUpd] = useState(0);
  const [toggleAddNew, setAddNew] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filter, setFilter] = useState(cusFilter);
  const [userData, setUsersData] = useState([]);
  const [activeStatus, setActiveStatus] = useState([]);
  const [centers, setCenters] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [showDataTable, setShowDataTable] = useState(true);
  const [showActionModal, toggleActionModal] = useState(false);
  const [showDeleteModal, toggleDeleteModal] = useState(false);
  const [showVisualModal, toggleVisualModal] = useState(false);
  const [showInfoModal, toggleInfoModal] = useState(false);

  const updateVal = () => {
    let u = upd;
    u = u + 1;
    setUpd(u);
  };

  const getDetails = () => {
    getActiveStatusListService({ type: "entries" }).then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setActiveStatus(res.data.data);
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
    getEntryDetailsService().then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setFormsData({ ...formsData, minBookingDate: res.data.minDate });
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
  };

  useEffect(() => {
    onLoad(filter);
    getDetails();
  }, [key]);

  const editSelectHandler = (selData) => {
    setFormsData((payload) => ({
      ...payload,
      ["updateKey"]: selData.id,
      ["nextLevels"]: selData.nextLevels,
      v1: selData.v1,
      v2: selData.v2,
      v3: selData.v3,
      v4: selData.v4,
      v5: selData.v5,
      v6: selData.v6,
      bookingAmount: selData.bookingAmount,
      bookingBy: selData.bookingBy,
      id: selData.id,
      vehicle: selData.vehicle,
    }));
  };
  const onLoad = (filterVal) => {
    filterVal.status = key;
    getAllEntriesService(filterVal).then((res) => {
      if (res.data.response === "success") {
        let dta = res.data.data;
        let selectedData = dta;
        dta.map((el, key) => {
          dta[key].actionStatus = el.status;
          let status = (
            <div key={key} style={{ maxWidth: "100px", textAlign: "center" }}>
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
                    className={`badge me-1`}
                    style={{
                      textTransform: "capitalize",
                      background: dta[key].background
                        ? dta[key].background
                        : Colors.defaultThemeColor,
                      color: dta[key].color ? dta[key].color : "white",
                      fontSize: "9px",
                    }}
                  >
                    {el.status}
                  </span>
                </div>
              </OverlayTrigger>
              {/* Select Action Status End */}
            </div>
          );
          let action = (
            <div key={key}>
              {/* Select Client ID Start */}
              <OverlayTrigger
                placement="top"
                delay={{ show: 200, hide: 200 }}
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    Info
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
                    setFormsData(dta[key]);
                    toggleInfoModal(true);
                  }}
                >
                  <FaInfoCircle />
                </span>
              </OverlayTrigger>
              {dta[key].nextLevels.length > 0 ? (
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 200, hide: 200 }}
                  overlay={
                    <Tooltip id="button-tooltip" {...props}>
                      Show Actions
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
                      toggleActionModal(true);
                    }}
                  >
                    <FaBars />
                  </span>
                </OverlayTrigger>
              ) : null}
              {dta[key].receiptExt !== "" ? (
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 200, hide: 200 }}
                  overlay={
                    <Tooltip id="button-tooltip" {...props}>
                      Admission Receipt
                    </Tooltip>
                  }
                >
                  <a
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    href={
                      getCompanyData().url +
                      "admission-receipts/" +
                      dta[key].id +
                      "." +
                      dta[key].receiptExt
                    }
                    target="_blank"
                  >
                    <FaReceipt />
                  </a>
                </OverlayTrigger>
              ) : null}

              {dta[key].fitnessExt !== "" ? (
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 200, hide: 200 }}
                  overlay={
                    <Tooltip id="button-tooltip" {...props}>
                      Checkup Certificate
                    </Tooltip>
                  }
                >
                  <a
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      color: "navy",
                    }}
                    href={
                      getCompanyData().url +
                      "checkup-certificates/" +
                      dta[key].id +
                      "." +
                      dta[key].fitnessExt
                    }
                    target="_blank"
                  >
                    <FaStickyNote />
                  </a>
                </OverlayTrigger>
              ) : null}
              {dta[key].v1 !== "" ? (
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 200, hide: 200 }}
                  overlay={
                    <Tooltip id="button-tooltip" {...props}>
                      Visuals
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
                      toggleVisualModal(true);
                    }}
                  >
                    <FaTruck />
                  </span>
                </OverlayTrigger>
              ) : null}

              {hasAccess("can-delete-entries") === true ? (
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 200, hide: 200 }}
                  overlay={
                    <Tooltip id="button-tooltip" {...props}>
                      Delete Entry
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
                      toggleDeleteModal(true);
                    }}
                  >
                    <FaTrash style={{ color: "maroon" }} />
                  </span>
                </OverlayTrigger>
              ) : null}
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

  const getNextActions = () => {
    let data = formsData.nextLevels;
    let finalData = [];
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      let row = (
        <div
          key={i}
          className="mt-2"
          style={{
            color:
              formsData.selectedAction && formsData.selectedAction === el.value
                ? "yellow"
                : "white",
            background: Colors.defaultThemeColor,
            cursor: "pointer",
            borderRadius: "7px",
            padding: "10px",
            border:
              formsData.selectedAction && formsData.selectedAction === el.value
                ? "2px solid yellow"
                : "",
          }}
          onClick={() => {
            let d = formsData;
            d.selectedAction = el.value;
            setFormsData({
              ...formsData,
              selectedAction: el.value,
              selectedActionName: el.name,
            });
            // updateVal();
          }}
        >
          <h4 className="text-center m-0">{el.name}</h4>
        </div>
      );
      finalData.push(row);
    }
    return finalData;
  };

  const actionModal = () => {
    return (
      <>
        <Modal
          show={showActionModal}
          onHide={() => {
            toggleActionModal(false);
            setFormsData(defaultPayload);
          }}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                {formsData && formsData.nextLevels && getNextActions()}
              </div>
              {formsData.selectedActionName === "ADMISSION DONE" ? (
                <div className="col-12 mt-3">
                  <div className="col-12 mb-2">
                    <DateInput
                      label="Admission Date"
                      value={formsData.bookingDate ? formsData.bookingDate : ""}
                      // minDate={
                      //   formsData.minBookingDate
                      //     ? formsData.minBookingDate
                      //     : date
                      // }
                      maxDate={date}
                      onChange={(val) => {
                        setFormsData({
                          ...formsData,
                          bookingDate: val,
                        });
                      }}
                    />
                  </div>
                  <div className="col-12 mb-2">
                    <TextInput
                      label="Admission ID"
                      value={formsData.bookingId ? formsData.bookingId : ""}
                      onChange={(val) => {
                        if (val.length <= 12)
                          setFormsData({
                            ...formsData,
                            bookingId: val.toUpperCase(),
                          });
                        else {
                          toast.warning(
                            "Admission ID cannot exceed 12 characters",
                          );
                        }
                      }}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <NumInput
                      label="Admission Amount"
                      value={
                        formsData.bookingAmount ? formsData.bookingAmount : ""
                      }
                      onChange={(val) => {
                        if (Number(val) > 0) {
                          setFormsData({
                            ...formsData,
                            bookingAmount: val,
                          });
                        }
                      }}
                    />
                  </div>
                  <label className="form-label">
                    Admission Receipt (pdf, jpg, png)
                  </label>
                  {!formsData.attachment ||
                  !formsData.attachment.title ||
                  formsData.attachment.title === null ? (
                    <input
                      type="file"
                      className="form-control"
                      value={""}
                      accept=".pdf,.png,.jpg"
                      onChange={(e) => {
                        browseAttachment(e);
                      }}
                      placeholder="Browse"
                    />
                  ) : (
                    <h4 style={{ color: "darkred" }} className="mt-3 mb-3">
                      {formsData.attachment ? formsData.attachment.title : ""}
                      <FaTimesCircle
                        style={{
                          float: "right",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setFormsData({ ...formsData, attachment: null });
                        }}
                      />
                    </h4>
                  )}
                </div>
              ) : null}

              {formsData.selectedActionName === "CHECKUP PASSED" ||
              formsData.selectedActionName === "CHECKUP FAILED" ? (
                <div className="col-12 mt-3 mb-3">
                  <DateInput
                    label="Checkup Date"
                    value={formsData.checkupDate ? formsData.checkupDate : date}
                    // minDate={
                    //   formsData.minBookingDate ? formsData.minBookingDate : date
                    // }
                    maxDate={date}
                    onChange={(val) => {
                      setFormsData({
                        ...formsData,
                        checkupDate: val,
                      });
                    }}
                  />
                </div>
              ) : null}
              {formsData.selectedActionName === "CHECKUP PASSED" ? (
                <div className="col-12">
                  <div className="col-12 mb-3">
                    <DateInput
                      label="Checkup Valid Till"
                      value={formsData.fitnessTill ? formsData.fitnessTill : ""}
                      onChange={(val) => {
                        setFormsData({
                          ...formsData,
                          fitnessTill: val,
                        });
                      }}
                    />
                  </div>
                  <label className="form-label">
                    Checkup Certificate (pdf, jpg, png)
                  </label>
                  {!formsData.attachment ||
                  !formsData.attachment.title ||
                  formsData.attachment.title === null ? (
                    <input
                      type="file"
                      className="form-control"
                      value={""}
                      accept=".pdf,.png,.jpg"
                      onChange={(e) => {
                        browseAttachment(e);
                      }}
                      placeholder="Browse"
                    />
                  ) : (
                    <h4 style={{ color: "darkred" }} className="mt-3 mb-3">
                      {formsData.attachment ? formsData.attachment.title : ""}
                      <FaTimesCircle
                        style={{
                          float: "right",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setFormsData({ ...formsData, attachment: null });
                        }}
                      />
                    </h4>
                  )}
                </div>
              ) : null}

              {formsData.selectedActionName === "CHECKUP PASSED" ||
              formsData.selectedActionName === "CHECKUP FAILED" ? (
                <div className="col-12 mt-4">
                  <h3>Admission Amount: {formsData.bookingAmount}</h3>
                  <div className="col-12 mb-3">
                    <NumInput
                      label="Our Share"
                      value={formsData.ourShare ? formsData.ourShare : ""}
                      onChange={(val) => {
                        let bAmt = Number(formsData.bookingAmount);
                        val = Number(val);
                        if (val <= bAmt) {
                          setFormsData({
                            ...formsData,
                            ourShare: val,
                            govtShare: bAmt - val,
                          });
                        }
                      }}
                    />
                  </div>
                  <h4>Govt. Share: {formsData.govtShare}</h4>
                </div>
              ) : null}
              {formsData.selectedActionName === "CERTIFICATE ISSUED" ? (
                <div className="col-12 mt-3">
                  <div className="col-12 mb-3">
                    <NumInput
                      label="Points Earned"
                      value={
                        formsData.pointsEarned ? formsData.pointsEarned : ""
                      }
                      onChange={(val) => {
                        setFormsData({
                          ...formsData,
                          pointsEarned: val,
                        });
                      }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
            {formsData && formsData.selectedAction ? (
              <div className="row text-center mt-4">
                <h3>Admission Amount: {formsData.bookingAmount}</h3>
                <h3>Admission By: {formsData.bookingBy}</h3>

                <div className="col-12 mb-3">
                  <TextInput
                    label="Remarks"
                    value={formsData.remarks ? formsData.remarks : ""}
                    onChange={(val) => {
                      setFormsData({ ...formsData, remarks: val });
                    }}
                  />
                </div>
                <div className="col-md-12 mb-6 text-center">
                  <button
                    className="btn btn-theme"
                    onClick={() => {
                      if (formsData.selectedActionName === "ADMISSION DONE") {
                        if (
                          !formsData.bookingId ||
                          formsData.bookingId === ""
                        ) {
                          toast.warning("Please enter Admission ID!");
                        } else if (
                          !formsData.bookingAmount ||
                          formsData.bookingAmount === "" ||
                          Number(formsData.bookingAmount) === 0
                        ) {
                          toast.warning("Please enter Admission Amount!");
                          // } else if (
                          //   !formsData.attachment ||
                          //   formsData.attachment.title === ""
                          // ) {
                          //   toast.warning("Please select Booking Receipt!");
                        } else {
                          updateStatus();
                        }
                      } else if (
                        formsData.selectedActionName === "CHECKUP PASSED"
                      ) {
                        if (
                          !formsData.fitnessTill ||
                          formsData.fitnessTill === ""
                        ) {
                          toast.warning("Please enter Checkup Till Date!");
                        } else if (
                          !formsData.attachment ||
                          formsData.attachment.title === ""
                        ) {
                          toast.warning("Please select Checkup Certificate!");
                        } else if (
                          !formsData.ourShare ||
                          formsData.ourShare === ""
                        ) {
                          toast.warning("Please enter our Share!");
                        } else {
                          updateStatus();
                        }
                      } else if (
                        formsData.selectedActionName === "CERTIFICATE ISSUED"
                      ) {
                        if (
                          !formsData.pointsEarned ||
                          formsData.pointsEarned === ""
                        ) {
                          toast.warning("Please enter Points Earned!");
                        } else {
                          updateStatus();
                        }
                      } else {
                        updateStatus();
                      }
                    }}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            ) : null}
          </Modal.Body>
        </Modal>
      </>
    );
  };

  const modalDelete = () => {
    return (
      <>
        <Modal
          show={showDeleteModal}
          onHide={() => toggleDeleteModal(false)}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {"Delete Entry "}
              {formsData && formsData.vehicle + " #" + formsData.id}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-md-12 mb-2">
                    <h4>Are you sure, you want to delete this entry?</h4>
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
                    deleteEntryService({
                      key: formsData.id,
                    }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          onLoad(filter);
                          toggleDeleteModal(false);
                          toast.success(res.data.msg);
                        } else {
                          toggleDeleteModal(false);
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
                  onClick={() => toggleDeleteModal(false)}
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

  const updateStatus = () => {
    updateEntryStatusService({
      status: formsData.selectedAction,
      updateKey: formsData.updateKey,
      attachment: formsData.attachment ? formsData.attachment : null,
      bookingId: formsData.bookingId ? formsData.bookingId : null,
      bookingAmount: formsData.bookingAmount ? formsData.bookingAmount : null,
      fitnessTill: formsData.fitnessTill ? formsData.fitnessTill : null,
      pointsEarned: formsData.pointsEarned,
      ourShare: formsData.ourShare,
      bookingDate: formsData.bookingDate,
      checkupDate: formsData.checkupDate,
      govtShare: formsData.govtShare,
      remarks: formsData.remarks ? formsData.remarks : null,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          toast.success(res.data.msg);
          setFormsData(defaultPayload);
          toggleActionModal(false);
          onLoad(filter);
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
  };

  const browseAttachment = (event) => {
    let fileinfo = event.target.files[0];
    let name = event.target.name;
    if (
      fileinfo.type === "application/pdf" ||
      fileinfo.type === "image/jpeg" ||
      fileinfo.type === "image/png"
    ) {
      if (fileinfo && fileinfo.size / 2024 <= 3072) {
        fileToDataUri(fileinfo).then((dataUri) => {
          let data = {
            title: fileinfo.name,
            item: "",
            value: dataUri,
          };
          let attachment = data;

          // attachment[attachment.findIndex((ob) => ob.title === name)].value =
          //   dataUri;
          setFormsData({ ...formsData, attachment: attachment });
        });
      } else {
        toast.error("File size should be less than 3 MB.");
      }
    } else {
      toast.error("Invalid file");
      setFormsData({ ...formsData, attachment: null });
    }
  };

  const fileToDataUri = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        // console.log("event.target.result", event.target.result);
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });

  const visualModal = () => {
    return (
      <Modal
        show={showVisualModal}
        onHide={() => toggleVisualModal(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Body style={{ padding: "0px 8px" }}>
          <div className="row p-2 ">
            <h2>
              <span style={{ color: Colors.defaultThemeColor }}>
                {props.title}
              </span>{" "}
              Visuals
            </h2>
            <hr className="mb-3" />
            {formsData.v1 ? (
              <div className="col-12">
                <a
                  href={getCompanyData().url + "/attachments/" + formsData.v1}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFolderOpen
                    size={17}
                    style={{
                      color: "#F37121",
                      float: "left",
                      marginRight: "10px",
                      marginTop: "5px",
                    }}
                  />
                  <h3>Visual 1</h3>
                </a>
              </div>
            ) : null}
            {formsData.v2 ? (
              <div className="col-12">
                <a
                  href={getCompanyData().url + "/attachments/" + formsData.v2}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFolderOpen
                    size={17}
                    style={{
                      color: "#F37121",
                      float: "left",
                      marginRight: "10px",
                      marginTop: "5px",
                    }}
                  />
                  <h3> Visual 2</h3>
                </a>
              </div>
            ) : null}
            {formsData.v3 ? (
              <div className="col-12">
                <a
                  href={getCompanyData().url + "/attachments/" + formsData.v3}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFolderOpen
                    size={17}
                    style={{
                      color: "#F37121",
                      float: "left",
                      marginRight: "10px",
                      marginTop: "5px",
                    }}
                  />
                  <h3> Visual 3</h3>
                </a>
              </div>
            ) : null}
            {formsData.v4 ? (
              <div className="col-12">
                <a
                  href={getCompanyData().url + "/attachments/" + formsData.v4}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFolderOpen
                    size={17}
                    style={{
                      color: "#F37121",
                      float: "left",
                      marginRight: "10px",
                      marginTop: "5px",
                    }}
                  />
                  <h3> Visual 4</h3>
                </a>
              </div>
            ) : null}
            {formsData.v5 ? (
              <div className="col-12">
                <a
                  href={getCompanyData().url + "/attachments/" + formsData.v5}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFolderOpen
                    size={17}
                    style={{
                      color: "#F37121",
                      float: "left",
                      marginRight: "10px",
                      marginTop: "5px",
                    }}
                  />
                  <h3> Visual 5</h3>
                </a>
              </div>
            ) : null}
            {formsData.v6 ? (
              <div className="col-12">
                <a
                  href={getCompanyData().url + "/attachments/" + formsData.v6}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFolderOpen
                    size={17}
                    style={{
                      color: "#F37121",
                      float: "left",
                      marginRight: "10px",
                      marginTop: "5px",
                    }}
                  />
                  <h3> Visual 6</h3>
                </a>
              </div>
            ) : null}
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const infoModal = () => {
    return (
      <Modal
        show={showInfoModal}
        onHide={() => toggleInfoModal(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Body style={{ padding: "0px 8px" }}>
          <div className="row p-2 ">
            <h2>
              <span style={{ color: Colors.defaultThemeColor }}>
                {props.title}
              </span>{" "}
              <span style={{ fontWeight: "normal" }}>{formsData.status}</span>
            </h2>
            <div className="col-12 mt-2">
              <h4 className="m-0" style={{ color: Colors.defaultThemeColor }}>
                General Information
              </h4>
              <hr className="mb-0 mt-0" />
              <h5 className="m-0">
                Date :{" "}
                <span style={{ fontWeight: "normal" }}>{formsData.date}</span>
              </h5>
              <h5 className="m-0">
                KAM :{" "}
                <span style={{ fontWeight: "normal" }}>{formsData.user}</span>
              </h5>
              {getUserData().role === "checkup" ||
              getUserData().role === "admission" ? null : (
                <h5 className="m-0">
                  Sales Person :{" "}
                  <span style={{ fontWeight: "normal" }}>
                    {formsData.salesPerson}
                  </span>
                </h5>
              )}
              {getUserData().role === "checkup" ||
              getUserData().role === "admission" ? null : (
                <h5 className="m-0">
                  Agent :{" "}
                  <span style={{ fontWeight: "normal" }}>
                    {formsData.agent}
                  </span>
                </h5>
              )}
              <h5 className="m-0">
                Entry At :{" "}
                <span style={{ fontWeight: "normal" }}>
                  {formsData.entryAt}
                </span>
              </h5>
              <h4
                className="m-0 mt-3"
                style={{ color: Colors.defaultThemeColor }}
              >
                Admission Information
              </h4>
              <hr className="mb-0 mt-0" />
              <h5 className="m-0">
                Admission Date :{" "}
                <span style={{ fontWeight: "normal" }}>
                  {formsData.bookingDate}
                </span>
              </h5>
              <h5 className="m-0">
                Admission By :{" "}
                <span style={{ fontWeight: "normal" }}>
                  {formsData.bookingBy === null && formsData.bookingId !== ""
                    ? "By Agent"
                    : formsData.bookingBy}
                </span>
              </h5>
              <h5 className="m-0 ">
                Admission Id :{" "}
                <span style={{ fontWeight: "normal" }}>
                  {formsData.bookingId}
                </span>
              </h5>
              <h5 className="m-0">
                Admission At :{" "}
                <span style={{ fontWeight: "normal" }}>
                  {formsData.bookingAt}
                </span>
              </h5>
              <h4
                className="m-0 mt-3"
                style={{ color: Colors.defaultThemeColor }}
              >
                Checkup Information
              </h4>
              <hr className="mb-0 mt-0" />
              <h5 className="m-0">
                Checkup By :{" "}
                <span style={{ fontWeight: "normal" }}>
                  {formsData.checkupBy}
                </span>
              </h5>
              <h5 className="m-0">
                Checkup At :{" "}
                <span style={{ fontWeight: "normal" }}>
                  {formsData.checkupAt}
                </span>
              </h5>
              <h5 className="m-0">
                Checkup Date :{" "}
                <span style={{ fontWeight: "normal" }}>
                  {formsData.checkupDate}
                </span>
              </h5>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <PageWrapper
      title={key ? key.replaceAll("-", " ").toUpperCase() : "All Entries "}
      style={{ textTransform: "capitalize" }}
    >
      {actionModal()}
      {modalDelete()}
      {visualModal()}
      {infoModal()}
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
        <div className="col-12 col-md-2">
          <Select
            label="Status"
            data={activeStatus}
            value={key}
            onChange={(val) => {
              navigate("/entries/view/" + val);
            }}
          />
        </div>
        <hr className="mt-2 mb-2" />
        {showDataTable && (
          <div className="col-12">
            {toggleAddNew === true ? <h3>All Vehicles</h3> : null}
            <Datatable
              options={options}
              columns={
                getUserData().role === "checkup" ||
                getUserData().role === "admission"
                  ? columns2
                  : columns
              }
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

export default ViewEntries;
