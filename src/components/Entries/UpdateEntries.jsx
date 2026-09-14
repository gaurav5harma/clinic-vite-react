import React, { useState, useEffect, useRef } from "react";
import PageWrapper from "../../hoc/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Colors from "../../assets/theme/Colors";
import {
  Checkbox,
  DateInput,
  NumInput,
  Select,
  TextInput,
} from "../Shared/Elements";
import {
  addNewEntryService,
  getActivAgentsListBySPService,
  getEntriesByVehicle,
  getEntryDetailsByKeyService,
  getEntryDetailsService,
  updateEntryDetailsService,
  uploadAttachmentService,
} from "../../services/HTTPService";
import { getCurrentSession, getUserData } from "../../services/AuthService";
import { Modal } from "react-bootstrap";
import { FaEdit, FaTimesCircle } from "react-icons/fa";
const UpdateEntries = (props) => {
  const key = useParams().ref;
  const componentRef = useRef();
  const navigate = useNavigate();
  const defaultPayload = {
    vehicle: "",
    center: "",
    agent: "",
    category: "",
    salesPerson: "",
    bookingByAgent: "no",
    bookingId: "",
    kam: getUserData().id,
    bookingAmount: "",
    categories: [],
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [entries, setEntries] = useState([]);
  const [entry, setEntry] = useState([]);
  const [lastEntryId, setLastEntryId] = useState(null);
  const [showAttachmentModal, toggleAttachmentModal] = useState(
    lastEntryId !== null ? true : false
  );
  const [attachment, setAttachment] = useState(null);
  const [showEditModal, toggleEditModal] = useState(false);
  const [editField, setEditField] = useState({
    field: "",
    value: "",
    newValue: "",
    type: "",
    id: "",
    remarks: "",
  });
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
          });
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

  const getEntryDetails = (val) => {
    getEntryDetailsByKeyService({ key: val }).then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setEntry(res.data.data);
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
  };

  const modalEdit = () => {
    return (
      <>
        <Modal
          show={showEditModal}
          onHide={() => toggleEditModal(false)}
          size="xs"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit Entry - {editField.field}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                {editField.field ? (
                  <div className="row">
                    <div className="col-12 mb-3">
                      <h3>
                        Current Value:{" "}
                        <span style={{ color: Colors.dangerDark }}>
                          {editField.name ? editField.name : editField.value}
                        </span>
                      </h3>

                      {editField.type === "select" ? (
                        <Select
                          label={editField.field}
                          data={
                            editField.field.toLowerCase() === "category"
                              ? entryDetails.categories
                              : editField.field.toLowerCase() === "agent"
                              ? entry.otherAGs
                              : editField.field.toLowerCase() === "sales person"
                              ? entry.otherSPs
                              : []
                          }
                          value={
                            editField.newValue
                              ? editField.newValue
                              : editField.value
                          }
                          onChange={(val) => {
                            if (editField.field === "Sales Person") {
                              getActivAgentsListBySPService({ key: val }).then(
                                (res) => {
                                  if (res.status === 200) {
                                    setEditField({
                                      ...editField,
                                      otherAGs: res.data.data,
                                      newValue: val,
                                      agent: "",
                                    });
                                  } else {
                                    toast.error("Something went wrong.");
                                  }
                                }
                              );
                            } else {
                              setEditField({
                                ...editField,
                                newValue: val,
                              });
                            }
                          }}
                          autoFocus={true}
                        />
                      ) : null}

                      {editField.type === "number" ? (
                        <NumInput
                          label={editField.field}
                          value={
                            editField.newValue || editField.newValue === ""
                              ? editField.newValue
                              : editField.value
                          }
                          onChange={(val) => {
                            if (editField.field === "Booking Amount") {
                              setEditField({
                                ...editField,
                                newValue: val,
                                ourShare: 0,
                                govtShare: 0,
                              });
                            } else {
                              setEditField({
                                ...editField,
                                newValue: val,
                              });
                            }
                          }}
                          autoFocus={true}
                        />
                      ) : null}
                      {editField.type === "text" ? (
                        <TextInput
                          label={editField.field}
                          value={
                            editField.newValue || editField.newValue === ""
                              ? editField.newValue
                              : editField.value
                          }
                          onChange={(val) => {
                            setEditField({
                              ...editField,
                              newValue: val,
                              ourShare: 0,
                              govtShare: 0,
                            });
                          }}
                          autoFocus={true}
                        />
                      ) : null}
                    </div>
                    {editField.field === "Booking Amount" ? (
                      <div className="col-12 mb-3">
                        <NumInput
                          label={"Our Share"}
                          value={editField.ourShare}
                          onChange={(val) => {
                            let ba = Number(editField.newValue);
                            let os = Number(val);
                            let gs = Number(editField.govtShare);
                            if (os <= ba) {
                              setEditField({
                                ...editField,
                                ourShare: val,
                                govtShare: ba - os,
                              });
                            }
                          }}
                        />
                        <h4>Govt Share: {editField.govtShare}</h4>
                      </div>
                    ) : null}

                    {editField.field === "Sales Person" ? (
                      <div className="col-12 mb-3">
                        <Select
                          label={"Agent"}
                          value={editField.agent}
                          data={editField.otherAGs}
                          onChange={(val) => {
                            setEditField({
                              ...editField,
                              agent: val,
                            });
                          }}
                        />
                      </div>
                    ) : null}
                    <div className="col-12 mb-3">
                      <TextInput
                        label={"Remarks"}
                        value={editField.remarks}
                        onChange={(val) => {
                          setEditField({
                            ...editField,
                            remarks: val,
                          });
                        }}
                      />
                    </div>
                  </div>
                ) : null}
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
                    if (
                      editField.newValue === "" ||
                      editField.newValue === null
                    ) {
                      toast.error("Please enter new value.");
                      return;
                    } else if (editField.newValue === editField.value) {
                      toast.error("New value cannot be same as current value.");
                      return;
                    } else {
                      updateEntryDetailsService(editField).then((res) => {
                        if (res.status === 200) {
                          if (res.data.status === "success") {
                            toast.success(res.data.msg);
                            getEntryDetails(editField.id);
                            setEditField({
                              field: "",
                              value: "",
                              newValue: "",
                              type: "",
                              id: "",
                              remarks: "",
                            });
                            toggleEditModal(false);
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
                  Update
                </button>
                <button
                  className="btn btn-theme"
                  onClick={() => {
                    setEditField({
                      field: "",
                      value: "",
                      newValue: "",
                      type: "",
                      id: "",
                    });
                    toggleEditModal(false);
                  }}
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
    <PageWrapper title={key ? key : "Update / Modify Entry"}>
      {modalEdit()}
      <div className="row card p-3">
        <div className="row">
          <div className="col-12">
            <div className="row">
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
                  disabled={entries.length > 0 ? true : false}
                  autoFocus
                />
              </div>
              {entries.length > 0 ? (
                <div className="col-12 col-md-2 mb-3">
                  <Select
                    label={"Entries"}
                    value={payload.entry}
                    data={entries}
                    onChange={(val) => {
                      getEntryDetailsByKeyService({ key: val }).then((res) => {
                        if (res.status === 200) {
                          if (res.data.status === "success") {
                            setEntry(res.data.data);
                          } else {
                            toast.error(res.data.msg);
                          }
                        } else {
                          toast.error("Something went wrong.");
                        }
                      });
                    }}
                    autoFocus
                  />
                </div>
              ) : null}
              <div className="col-12 col-md-2 mb-3">
                {entries.length === 0 ? (
                  <button
                    className="btn btn-theme"
                    style={{ height: "30px", marginTop: "28px" }}
                    onClick={() => {
                      getEntriesByVehicle({ vehicle: payload.vehicle }).then(
                        (res) => {
                          if (res.status === 200) {
                            setEntries(res.data);
                          } else {
                            toast.error("Something went wrong.");
                          }
                        }
                      );
                    }}
                  >
                    Fetch Entries
                  </button>
                ) : (
                  <button
                    className="btn btn-theme"
                    style={{ height: "30px", marginTop: "28px" }}
                    onClick={() => {
                      setPayload(defaultPayload);
                      setEntries([]);
                      setEntry([]);
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {entry && entry.id ? (
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-12">
                      <h2
                        className="mt-4"
                        style={{ color: Colors.defaultThemeColor }}
                      >
                        {entry.vehicle}
                      </h2>
                    </div>
                    <h4
                      className="mt-4"
                      style={{ color: Colors.defaultThemeColor }}
                    >
                      Entry Details
                    </h4>
                    <hr />
                    <div className="col-12 col-md-4">
                      <div className="row">
                        <div className="col-4">
                          <h4>
                            Entry Date
                            <span style={{ float: "right" }}>:</span>
                          </h4>
                        </div>
                        <div className="col-8">{entry.entryDate}</div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="row">
                        <div className="col-4">
                          <h4>
                            Vehicle Category
                            <span style={{ float: "right" }}>:</span>
                          </h4>
                        </div>
                        <div className="col-8">
                          {entry.category}{" "}
                          <FaEdit
                            style={{
                              color: Colors.primaryDark,
                              cursor: "pointer",
                              marginLeft: "10px",
                            }}
                            onClick={() => {
                              setEditField({
                                field: "Category",
                                type: "select",
                                value: entry.category,
                                newValue: entry.category,
                                id: entry.id,
                              });
                              toggleEditModal(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="row">
                        <div className="col-4">
                          <h4>
                            Center
                            <span style={{ float: "right" }}>:</span>
                          </h4>
                        </div>
                        <div className="col-8">{entry.center}</div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="row">
                        <div className="col-4">
                          <h4>
                            Agent
                            <span style={{ float: "right" }}>:</span>
                          </h4>
                        </div>
                        <div className="col-8">
                          {entry.agent}
                          <FaEdit
                            style={{
                              color: Colors.primaryDark,
                              cursor: "pointer",
                              marginLeft: "10px",
                            }}
                            onClick={() => {
                              let valIdx = entry.otherAGs.findIndex(
                                (ob) => ob.value === entry.aId
                              );
                              setEditField({
                                field: "Agent",
                                type: "select",
                                name:
                                  valIdx !== -1
                                    ? entry.otherAGs[valIdx].name
                                    : "",
                                value: entry.aId,
                                newValue: entry.aId,
                                id: entry.id,
                              });
                              toggleEditModal(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="row">
                        <div className="col-4">
                          <h4>
                            Sales Person
                            <span style={{ float: "right" }}>:</span>
                          </h4>
                        </div>
                        <div className="col-8">
                          {entry.salesPerson}{" "}
                          <FaEdit
                            style={{
                              color: Colors.primaryDark,
                              cursor: "pointer",
                              marginLeft: "10px",
                            }}
                            onClick={() => {
                              let valIdx = entry.otherSPs.findIndex(
                                (ob) => ob.value === entry.spId
                              );
                              console.log(valIdx);
                              setEditField({
                                field: "Sales Person",
                                type: "select",
                                name:
                                  valIdx !== -1
                                    ? entry.otherSPs[valIdx].name
                                    : "",
                                value: entry.spId,
                                newValue: entry.spId,
                                agent: entry.aId,
                                otherAGs: entry.otherAGs,
                                id: entry.id,
                              });
                              toggleEditModal(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="row">
                        <div className="col-4">
                          <h4>
                            KAM
                            <span style={{ float: "right" }}>:</span>
                          </h4>
                        </div>
                        <div className="col-8">{entry.user}</div>
                      </div>
                    </div>

                    <h4
                      className="mt-4"
                      style={{ color: Colors.defaultThemeColor }}
                    >
                      Booking & Checkup Details
                    </h4>
                    <hr />
                    <div className="col-12 col-md-4">
                      <div className="row">
                        <div className="col-4">
                          <h4>
                            Booking By
                            <span style={{ float: "right" }}>:</span>
                          </h4>
                        </div>
                        <div className="col-8">{entry.bookingBy}</div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="row">
                        <div className="col-4">
                          <h4>
                            Booking Id
                            <span style={{ float: "right" }}>:</span>
                          </h4>
                        </div>
                        <div className="col-8">
                          {entry.bookingId}
                          {entry.booking === true ? (
                            <FaEdit
                              style={{
                                color: Colors.primaryDark,
                                cursor: "pointer",
                                marginLeft: "10px",
                              }}
                              onClick={() => {
                                setEditField({
                                  field: "Booking Id",
                                  type: "number",
                                  value: entry.bookingId,
                                  newValue: entry.bookingId,
                                  id: entry.id,
                                });
                                toggleEditModal(true);
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="row">
                        <div className="col-4">
                          <h4>
                            Booking Amount
                            <span style={{ float: "right" }}>:</span>
                          </h4>
                        </div>
                        <div className="col-8">
                          {entry.bookingAmount} (Our Share: {entry.ourShare} |
                          Govt Share: {entry.govtShare})
                          {entry.booking === true ? (
                            <FaEdit
                              style={{
                                color: Colors.primaryDark,
                                cursor: "pointer",
                                marginLeft: "10px",
                              }}
                              onClick={() => {
                                setEditField({
                                  field: "Booking Amount",
                                  type: "number",
                                  value: entry.bookingAmount,
                                  newValue: entry.bookingAmount,
                                  ourShare: entry.ourShare,
                                  govtShare: entry.govtShare,
                                  id: entry.id,
                                });
                                toggleEditModal(true);
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="row">
                        <div className="col-4">
                          <h4>
                            Checkup By
                            <span style={{ float: "right" }}>:</span>
                          </h4>
                        </div>
                        <div className="col-8">{entry.checkupBy}</div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="row">
                        <div className="col-4">
                          <h4>
                            Fitness At
                            <span style={{ float: "right" }}>:</span>
                          </h4>
                        </div>
                        <div className="col-8">{entry.fitnessAt}</div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4">
                      <div className="row">
                        <div className="col-4">
                          <h4>
                            Points Earned
                            <span style={{ float: "right" }}>:</span>
                          </h4>
                        </div>
                        <div className="col-8">
                          {entry.pointsEarned}
                          {entry.certificateIssued === true ? (
                            <FaEdit
                              style={{
                                color: Colors.primaryDark,
                                cursor: "pointer",
                                marginLeft: "10px",
                              }}
                              onClick={() => {
                                setEditField({
                                  field: "Points Earned",
                                  type: "number",
                                  value: entry.pointsEarned,
                                  newValue: entry.pointsEarned,
                                  id: entry.id,
                                });
                                toggleEditModal(true);
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default UpdateEntries;
