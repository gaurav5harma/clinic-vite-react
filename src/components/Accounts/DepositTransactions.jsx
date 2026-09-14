import { useState, useEffect } from "react";
import PageWrapper from "../../hoc/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  deleteDepositTransactionService,
  getActiveAgentsListService,
  getActiveCentersListService,
  getDepositTransactionsService,
  requestPoliciesService,
} from "../../services/HTTPService";
import { DateInput, Select } from "../Shared/Elements";
import { FaList, FaTrash } from "react-icons/fa";
import Colors from "../../assets/theme/Colors";
import ExcelExportService from "../../services/ExcelExportService";
import { formatIndianAmount } from "../../services/PrefService";
import { Modal } from "react-bootstrap";
import { getUserData, hasAccess } from "../../services/AuthService";

const DepositTransactions = (props) => {
  const key = useParams().id;
  var current = new Date();
  current.setDate(current.getDate());
  var date = current.toISOString().substring(0, 10);
  const navigate = useNavigate();
  const defaultPayload = {
    dateFrom: date,
    dateTo: date,
    book: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [showEntries, toggleEntries] = useState(true);
  const [leftOverAmount, setLeftOverAmount] = useState(0);
  const [showDeleteModal, toggleDeleteModal] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [centers, setCenters] = useState([]);
  const [policies, setPolicies] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [entries, setEntries] = useState([]);
  const getPolicies = () => {
    let policyParams = ["books","depositBooks"];
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

  useEffect(() => {
    getPolicies();
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

  const getDepositTransactions = () => {
    getDepositTransactionsService({
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      book: payload.book,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setDeposits(res.data.data);
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
              {"Delete Deposit Transaction "}
              {selectedEntry && selectedEntry.id}
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
                    deleteDepositTransactionService({
                      key: selectedEntry.id,
                    }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          getDepositTransactions();
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
    <PageWrapper title="Deposit Transactions">
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
                label={"Book"}
                data={policies && policies.books}
                value={payload.book}
                onChange={(v) => {
                  setPayload({ ...payload, book: v });
                }}
              />
            </div>
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
                      getDepositTransactions();
                    }}
                  >
                    <FaList style={{ marginRight: "5px" }} /> Go
                  </button>
                </div>
                {deposits.length > 0 ? (
                  <div className="col-6 col-md-4 text-center">
                    <ExcelExportService
                      style={{ marginLeft: "20px" }}
                      excelData={deposits}
                      fileName={
                        "Deposit Transactions" +
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
                      <td>Date</td>
                      <td>From Book</td>
                      <td>To Book</td>
                      <td>Remarks</td>
                      <td>Transfered By</td>
                      <td className="text-right">Amount</td>
                      {hasAccess("can-delete-deposit") === true ? (
                        <td className="text-center">Action</td>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {deposits.map((entry, index) => {
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
                          <td>{entry.date}</td>
                          <td>{entry.fromBook}</td>
                          <td>{entry.toBook}</td>
                          <td>{entry.remarks}</td>
                          <td>{entry.user}</td>
                          <td className="text-right">
                            {formatIndianAmount(entry.amount)}
                          </td>
                          {hasAccess("can-delete-deposit") === true ? (
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
                        colSpan={6}
                        style={{ textAlign: "right" }}
                      >
                        Total
                      </td>
                      <td className="text-right">
                        {formatIndianAmount(
                          deposits.reduce(
                            (acc, entry) => acc + Number(entry.amount),
                            0,
                          ),
                        )}
                      </td>
                      {hasAccess("can-delete-deposit") === true ? <td></td> : null}
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

export default DepositTransactions;
