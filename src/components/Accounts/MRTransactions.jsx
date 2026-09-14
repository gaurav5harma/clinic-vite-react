import { useState, useEffect } from "react";
import PageWrapper from "../../hoc/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  deleteMRTransactionService,
  getActiveAgentsListService,
  getActiveCentersListService,
  getMRTransactionsService,
  requestPoliciesService,
} from "../../services/HTTPService";
import { DateInput, Select } from "../Shared/Elements";
import { FaList, FaTrash } from "react-icons/fa";
import Colors from "../../assets/theme/Colors";
import ExcelExportService from "../../services/ExcelExportService";
import { formatIndianAmount } from "../../services/PrefService";
import { Modal } from "react-bootstrap";
import { getUserData, hasAccess } from "../../services/AuthService";

const MRTransactions = (props) => {
  const key = useParams().id;
  var current = new Date();
  current.setDate(current.getDate());
  var date = current.toISOString().substring(0, 10);
  const navigate = useNavigate();
  const defaultPayload = {
    dateFrom: date,
    dateTo: date,
    agent: "",
    type: "",
    center: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [showEntries, toggleEntries] = useState(true);
  const [leftOverAmount, setLeftOverAmount] = useState(0);
  const [showDeleteModal, toggleDeleteModal] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [agents, setAgents] = useState([]);
  const [centers, setCenters] = useState([]);
  const [policies, setPolicies] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [mrs, setMRs] = useState([]);
  const [entries, setEntries] = useState([]);
  const getDetails = () => {
    getActiveAgentsListService().then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setAgents(res.data.data);
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
  };
  const getPolicies = () => {
    let policyParams = ["books"];
    requestPoliciesService({ policies: policyParams }).then((response) => {
      if (response.status === 200) {
        setPolicies(response.data);
        // console.log("response.data", response.data);
      } else {
        toast.error(response.data.msg);
        if (response.data.status === "logout") {
          logout();
        }
        window.history.back();
      }
    });
  };

  const getCenters = () => {
    getActiveCentersListService({ for: "all" }).then((res) => {
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
  };
  useEffect(() => {
    getDetails();
    getPolicies();
    getCenters();
  }, []);

  const createParams = () => {
    let ent = entries;
    ent.forEach((element) => {
      delete element.govtShare;
      delete element.ourShare;
      delete element.bookingBy;
      delete element.category;
      delete element.bookingId;
      delete element.agent;
    });
    return {
      agent: payload.agent,
      entries: ent,
      leftOver: leftOverAmount,
      balance: balanceAmount,
      received: payload.received,
      type: payload.type,
      typeRef: payload.typeRef,
    };
  };

  const getMRTransactions = () => {
    getMRTransactionsService({
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      type: payload.type,
      agent: payload.agent,
      center: payload.center,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setMRs(res.data.data);
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
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
              {"Delete MR Transaction "}
              {selectedEntry && selectedEntry.txnRef}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-md-12 mb-2">
                    <h4>Are you sure, you want to delete this transaction?</h4>
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
                    deleteMRTransactionService({
                      key: selectedEntry.id,
                    }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          getMRTransactions();
                          toggleDeleteModal(false);
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
  return (
    <PageWrapper title="MR Transactions">
      {modalDelete()}
      <div className="row card p-3">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-md-2 mt-3">
              <DateInput
                label={"Date From"}
                value={payload.dateFrom}
                onChange={(v) => {
                  setPayload({ ...payload, dateFrom: v });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mt-3">
              <DateInput
                label={"Date To"}
                value={payload.dateTo}
                onChange={(v) => {
                  setPayload({ ...payload, dateTo: v });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mt-3">
              <Select
                label={"Agent"}
                data={agents}
                value={payload.agent}
                onChange={(v) => {
                  setPayload({ ...payload, agent: v });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mt-3">
              <Select
                label={"Type"}
                data={policies && policies.books}
                value={payload.type}
                onChange={(v) => {
                  setPayload({ ...payload, type: v });
                }}
              />
            </div>
            {getUserData().role === "admin" ||
            getUserData().role === "devadmin" ? (
              <div className="col-12 col-md-2 mt-3">
                <Select
                  label={"Center"}
                  data={centers}
                  value={payload.center}
                  onChange={(v) => {
                    setPayload({ ...payload, center: v });
                  }}
                />
              </div>
            ) : null}
            <div className="col-md-2 mt-3">
              <div className="row">
                <div className="col-6 col-md-4 mt-4 text-center">
                  <button
                    className="btn btn-theme"
                    style={{
                      backgroundColor: Colors.defaultThemeColor,
                      color: "white",
                      marginRight: "20px",
                    }}
                    onClick={() => {
                      getMRTransactions();
                    }}
                  >
                    <FaList style={{ marginRight: "5px" }} /> Go
                  </button>
                </div>
                {mrs.length > 0 ? (
                  <div className="col-6 col-md-4 text-center">
                    <ExcelExportService
                      style={{ marginLeft: "20px" }}
                      excelData={mrs}
                      fileName={
                        "MR Transactions" +
                        " - " +
                        payload.dateFrom +
                        "_to_" +
                        payload.dateTo
                      }
                      title={"Excel"}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {showEntries === true ? (
            <div className="row">
              <div className="col-12" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", marginTop: "20px" }}>
                  <thead
                    style={{
                      background: Colors.defaultThemeColor,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <tr>
                      <td>SN</td>
                      <td>TXN Id</td>
                      <td>Date</td>
                      <td>Agent</td>
                      <td>Center</td>
                      <td>Type</td>
                      <td>Remarks</td>
                      <td className="text-right">Amount</td>
                      <td className="text-right">Unapplied</td>
                      {hasAccess("can-delete-mr") === true ? (
                        <td className="text-center">Action</td>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {mrs.map((entry, index) => {
                      return (
                        <tr
                          key={index}
                          style={{
                            fontWeight:
                              entry.selected === true ? "500" : "normal",
                            color: entry.selected === true ? "navy" : "black",
                          }}
                        >
                          <td>{index + 1}</td>
                          <td>{entry.txnRef}</td>
                          <td>{entry.date}</td>
                          <td>{entry.agent}</td>
                          <td>{entry.center}</td>
                          <td>{entry.type}</td>
                          <td>{entry.remarks}</td>
                          <td className="text-right">
                            {formatIndianAmount(entry.amount)}
                          </td>
                          <td className="text-right">
                            {formatIndianAmount(entry.unapplied)}
                          </td>
                          {hasAccess("can-delete-mr") === true ? (
                            <td className="text-center">
                              <FaTrash
                                style={{ color: "maroon", cursor: "pointer" }}
                                onClick={() => {
                                  setSelectedEntry(entry);
                                  toggleDeleteModal(true);
                                }}
                              />
                            </td>
                          ) : null}
                        </tr>
                      );
                    })}

                    <tr
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      <td
                        className="text-right"
                        colSpan={7}
                        style={{ textAlign: "right" }}
                      >
                        Total
                      </td>
                      <td className="text-right">
                        {formatIndianAmount(
                          mrs.reduce(
                            (acc, entry) => acc + Number(entry.amount),
                            0,
                          ),
                        )}
                      </td>
                      <td className="text-right">
                        {formatIndianAmount(
                          mrs.reduce(
                            (acc, entry) => acc + Number(entry.unapplied),
                            0,
                          ),
                        )}
                      </td>
                      {hasAccess("can-delete-mr") === true ? <td></td> : null}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </PageWrapper>
  );
};

export default MRTransactions;
