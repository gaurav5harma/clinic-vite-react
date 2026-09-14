import React, { useState, useEffect, useRef } from "react";
import PageWrapper from "../../hoc/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { Icons, toast } from "react-toastify";
import Colors from "../../assets/theme/Colors";
import {
  Checkbox,
  DateInput,
  NumInput,
  Select,
  TextInput,
} from "../Shared/Elements";
import {
  addNewAgentService,
  addNewEntryService,
  getActiveAgentsListByCenterService,
  getActiveCentersListService,
  getActiveSalesPersonList,
  getActivKAMsListService,
  getEntryDetailsService,
  uploadAttachmentService,
} from "../../services/HTTPService";
import { getCurrentSession, getUserData } from "../../services/AuthService";
import { Modal } from "react-bootstrap";
import { FaPlus, FaTimesCircle } from "react-icons/fa";
const NewEntry = (props) => {
  // const key = useParams().ref;
  const componentRef = useRef();
  const navigate = useNavigate();
  var current = new Date();
  current.setDate(current.getDate());
  var date = current.toISOString().substring(0, 10);

  // calculate min date = 3 days before this date
  var selectedDate = new Date(date);
  selectedDate.setDate(selectedDate.getDate() - 3);
  var minDate = selectedDate.toISOString().substring(0, 10);

  const defaultPayload = {
    date: date,
    vehicle: "",
    center: "",
    agent: "",
    category: "",
    salesPerson: "",
    bookingByAgent: "no",
    bookingId: "",
    bookingDate: date,
    kam: getUserData().id,
    bookingAmount: "",
  };

  const defaultFormsData = {
    updateKey: "",
    name: "",
    kam: "",
    address: "",
    salesPerson: "",
    mobile: "",
    center: "",
    status: "",
    aadhar: "",
    pan: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [formsData, setFormsData] = useState(defaultFormsData);
  const [lastEntryId, setLastEntryId] = useState(null);
  const [showAttachmentModal, toggleAttachmentModal] = useState(
    lastEntryId !== null ? true : false,
  );
  const [showAgentModal, toggleAgentModal] = useState(false);
  const [kams, setKAMs] = useState([]);
  const [salesPerson, setSalesPerson] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [entryDetails, setEntryDetails] = useState({
    centers: [],
    agents: [],
    categories: [],
    kams: [],
  });
  const [updateVal, setUpdateVal] = useState(1);

  const [tableFont, setTableFont] = useState({
    data: "14px",
    head: "16px",
    title: "18px",
  });
  const [policies, setPolicies] = useState(null);

  const getDetails = () => {
    getEntryDetailsService().then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setEntryDetails({
            ...entryDetails,
            centers: res.data.centers,
            agents: res.data.agents,
            categories: res.data.categories,
            kams: res.data.kams,
            minDate: res.data.minDate,
          });
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
  };

  const getDetailsForNewAgent = () => {
    getActiveSalesPersonList().then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setSalesPerson(res.data.data);
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

  useEffect(() => {
    getDetails();
  }, []);

  const updateData = () => {
    let upd = updateVal;
    upd = upd + 1;
    setUpdateVal(upd);
  };

  const filesModal = () => {
    return (
      <Modal
        show={showAttachmentModal}
        // onHide={() => toggleAttachmentModal(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Body style={{ padding: "0px 8px" }}>
          <div className="row p-2 ">
            <h2>
              <span style={{ color: Colors.defaultThemeColor }}>
                {props.title}
              </span>{" "}
              Upload Visuals
            </h2>
            <hr className="mb-3" />
            <div className="col-12">
              <label className="form-label">Visual File (pdf, jpg, png)</label>
              {!attachment || !attachment.title || attachment.title === null ? (
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
                  {attachment ? attachment.title : ""}
                  <FaTimesCircle
                    style={{
                      float: "right",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setAttachment(null);
                    }}
                  />
                </h4>
              )}
            </div>
            <div className="col-md-12 mb-6 mt-3 text-center">
              {attachment === null ? (
                <button
                  className="btn btn-theme"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    setLastEntryId(null);
                    toggleAttachmentModal(false);
                  }}
                >
                  New Entry
                </button>
              ) : null}
              {attachment === null ? (
                <button
                  className="btn btn-theme"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    setLastEntryId(null);
                    navigate("/entries/view");
                  }}
                >
                  Continue
                </button>
              ) : null}
              {attachment !== null ? (
                <button
                  className="btn btn-theme"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    uploadAttachmentService({
                      attachment: attachment,
                      targetId: lastEntryId,
                      type: "visual",
                    }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          setAttachment(null);
                        } else {
                          toast.error(res.data.msg);
                          setAttachment(null);
                        }
                      } else {
                        toast.error("Something went wrong.");
                      }
                    });
                  }}
                >
                  Upload
                </button>
              ) : null}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const newAgentModal = () => {
    return (
      <Modal
        show={showAgentModal}
        onHide={() => toggleAgentModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Body style={{ padding: "0px 8px" }}>
          <div className="row p-2 ">
            <h2>
              <span style={{ color: Colors.defaultThemeColor }}>
                {"Add New Agent"}
              </span>{" "}
            </h2>
            <hr className="mb-3" />
            <div className="row">
              {getUserData().role === "admin" ? (
                <div className="col-md-6 col-12 mb-3">
                  <Select
                    label={"KAM"}
                    value={formsData.kam}
                    data={kams}
                    onChange={(val) => {
                      getActiveSalesPersonList({ kam: val }).then((res) => {
                        if (res.status === 200) {
                          if (res.data.status === "success") {
                            setSalesPerson(res.data.data);
                            setFormsData({ ...formsData, kam: val });
                          } else {
                            toast.error(res.data.msg);
                          }
                        } else {
                          toast.error("Something went wrong.");
                        }
                      });
                    }}
                  />
                </div>
              ) : null}
              <div className="col-md-6 col-12 mb-3">
                <Select
                  label={"Sales Person"}
                  value={formsData.salesPerson}
                  data={salesPerson}
                  onChange={(val) => {
                    setFormsData({ ...formsData, salesPerson: val });
                  }}
                />
              </div>
              <div className="col-md-6 col-12 mb-3">
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
                <NumInput
                  label={"Mobile"}
                  value={formsData.mobile}
                  onChange={(val) => {
                    if (val.length <= 10)
                      setFormsData({ ...formsData, mobile: val });
                  }}
                />
              </div>
              <div className="col-md-6 col-12 mb-3">
                <NumInput
                  label={"Aadhar"}
                  value={formsData.aadhar}
                  onChange={(val) => {
                    if (val.length <= 12)
                      setFormsData({ ...formsData, aadhar: val });
                  }}
                />
              </div>
              <div className="col-md-6 col-12 mb-3">
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
              <div className="col-12 text-center mt-2">
                <button
                  className="btn btn-theme"
                  onClick={() => {
                    submitHandler();
                  }}
                >
                  <FaPlus style={{ marginRight: "5px" }} />
                  {"Add Agent"}
                </button>
                <button
                  className="btn btn-theme"
                  style={{ marginLeft: "20px" }}
                  onClick={() => {
                    setFormsData(defaultFormsData);
                    toggleAgentModal(false);
                  }}
                >
                  {"Cancel"}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const submitHandler = () => {
    if (formsData.name === "") {
      toast.error("Please enter Agent Name!");
    } else if (formsData.mobile === "") {
      toast.error("Please enter Agent Mobile");
    } else {
      addActionHandler(formsData);
    }
  };
  const addActionHandler = (payload) => {
    addNewAgentService(payload)
      .then((response) => {
        if (response.data.status === "success") {
          getDetails();
          toggleAgentModal(false);
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
              response.data.status,
          );
        }
      })
      .catch((res) => {
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
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
          let att = data;

          // attachment[attachment.findIndex((ob) => ob.title === name)].value =
          //   dataUri;
          setAttachment(att);
        });
      } else {
        toast.error("File size should be less than 3 MB.");
      }
    } else {
      toast.error("Invalid file");
      setAttachment(null);
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

  return (
    <PageWrapper title={"New Entry"}>
      {filesModal()}
      {newAgentModal()}
      <div className="row card p-3">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-md-2 mb-3">
                <DateInput
                  label={"Date"}
                  value={payload.date}
                  // minDate={entryDetails.minDate}
                  keyDisable={true}
                  // minDate={
                  //   entryDetails.minDate &&
                  //   (getUserData().role === "admin" ||
                  //     getUserData().username === "kamrdr")
                  //     ? entryDetails.minDate
                  //     : payload.date
                  // }
                  maxDate={payload.date}
                  onChange={(v) => {
                    setPayload({ ...payload, date: v });
                  }}
                  // disabled={showEntries === true ? true : false}
                  disabled={true}
                />
              </div>
              <div className="col-12 col-md-2 mb-3">
                <TextInput
                  label={"Vehicle No."}
                  value={payload.vehicle}
                  onChange={(val) => {
                    if (val.length <= 11) {
                      setPayload({
                        ...payload,
                        vehicle: val.toUpperCase().trim(),
                      });
                    }
                  }}
                  autoFocus
                />
              </div>
              {payload.vehicle.length >= 8 ? (
                <div className="col-12 col-md-2 mb-3">
                  <Select
                    label={"Vehicle Category"}
                    data={entryDetails.categories}
                    value={payload.category}
                    onChange={(val) => {
                      setPayload({ ...payload, category: val });
                    }}
                  />
                </div>
              ) : null}
              {/* {stage === 1 &&  ? (
                <div className="col-12 col-md-3 mb-3 mt-4 text-center">
                  <button
                    className="btn btn-theme"
                    onClick={() => {
                      setStage(2);
                    }}
                  >
                    Proceed
                  </button>
                </div>
              ) : null} */}
              {payload.vehicle.length >= 8 && getUserData().cid === 1 ? (
                <div className="col-12 col-md-2 mb-3">
                  <Select
                    label={"Center"}
                    data={entryDetails.centers}
                    value={payload.center}
                    onChange={(val) => {
                      getActiveAgentsListByCenterService({
                        key: val,
                      }).then((res) => {
                        if (res.status === 200) {
                          setPayload({
                            ...payload,
                            center: val,
                          });
                          setEntryDetails({
                            ...entryDetails,
                            agents: res.data.data,
                          });
                        } else {
                          toast.error("Something went wrong.");
                        }
                      });
                    }}
                  />
                </div>
              ) : null}
              {/* {payload.vehicle.length >= 8 && getUserData().cid === 1 ? (
                <div className="col-12 col-md-3 mb-3">
                  <Select
                    label={"KAM"}
                    data={entryDetails.kams}
                    value={payload.kam}
                    onChange={(val) => {
                      setPayload({ ...payload, kam: val });
                    }}
                  />
                </div>
              ) : null} */}
              {payload.vehicle.length >= 8 ? (
                <div className="col-12 col-md-2 mb-3">
                  <Select
                    label={"Agent Name"}
                    data={entryDetails.agents}
                    value={payload.agent}
                    onChange={(val) => {
                      if (val === "") {
                        setPayload({ ...payload, agent: val, salesPerson: "" });
                      } else {
                        let idx = entryDetails.agents.findIndex(
                          (x) => Number(x.value) === Number(val),
                        );
                        let sp = entryDetails.agents[idx].salesPerson;
                        setPayload({ ...payload, agent: val, salesPerson: sp });
                      }
                    }}
                  />
                  <small
                    style={{ cursor: "pointer", color: "maroon" }}
                    onClick={() => {
                      getDetailsForNewAgent();
                      toggleAgentModal(true);
                    }}
                  >
                    Add Agent
                  </small>
                </div>
              ) : null}
              {/* {payload.vehicle.length >= 8 ? (
                <div className="col-12 col-md-3 mb-3">
                  <TextInput
                    label={"Sales Person"}
                    value={payload.salesPerson}
                    disabled
                  />
                </div>
              ) : null} */}
              {payload.vehicle.length >= 8 ? (
                <div className="col-12 col-md-2 mb-3">
                  <Select
                    label={"Admission By Agent"}
                    data={[
                      { name: "Yes", value: "yes" },
                      { name: "No", value: "no" },
                    ]}
                    value={payload.bookingByAgent}
                    onChange={(val) => {
                      setPayload({ ...payload, bookingByAgent: val });
                    }}
                  />
                </div>
              ) : null}
              {payload.vehicle.length >= 8 &&
              payload.bookingByAgent === "yes" ? (
                <div className="col-12 col-md-2 mb-3">
                  <TextInput
                    label={"Admission Id"}
                    value={payload.bookingId}
                    onChange={(val) => {
                      if (val.length <= 12)
                        setPayload({ ...payload, bookingId: val });
                      else {
                        toast.warning(
                          "Admission ID cannot exceed 12 characters",
                        );
                      }
                    }}
                  />
                </div>
              ) : null}
              {payload.vehicle.length >= 8 &&
              payload.bookingByAgent === "yes" ? (
                <div className="col-12 col-md-2 mb-3">
                  <DateInput
                    label={"Admission Date"}
                    value={payload.bookingDate}
                    // minDate={entryDetails.minDate}
                    maxDate={date}
                    onChange={(v) => {
                      setPayload({ ...payload, bookingDate: v });
                    }}
                    // disabled={showEntries === true ? true : false}
                    // disabled={true}
                  />
                </div>
              ) : null}
              {payload.vehicle.length >= 8 &&
              payload.bookingByAgent === "yes" ? (
                <div className="col-12 col-md-2 mb-3">
                  <NumInput
                    label={"Admission Amount"}
                    value={payload.bookingAmount}
                    onChange={(val) => {
                      if (Number(val) > 0 || val === "") {
                        setPayload({ ...payload, bookingAmount: val });
                      }
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
          {payload.vehicle != "" &&
          payload.agent != "" &&
          payload.category != "" ? (
            <div className="col-12 text-right mt-4">
              <button
                className="btn btn-theme"
                onClick={() => {
                  if (
                    payload.bookingByAgent === "yes" &&
                    (payload.bookingId.trim() === "" ||
                      payload.bookingId.length < 12 ||
                      payload.bookingAmount === "")
                  ) {
                    toast.warning("Please enter valid Admission Details");
                  } else {
                    addNewEntryService(payload).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          setPayload(defaultPayload);
                          setLastEntryId(res.data.data);
                          if (getUserData().cid === 1) {
                            toggleAttachmentModal(true);
                          }
                        } else {
                          toast.error(res.data.msg);
                        }
                      } else {
                        toast.error("Something went wrong.");
                      }
                    });
                  }
                }}
              >
                Save
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </PageWrapper>
  );
};

export default NewEntry;
