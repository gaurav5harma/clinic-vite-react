import { useState, useEffect } from "react";
import PageWrapper from "../../hoc/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  fetchUnpaidEntriesService,
  getActivAgentsListBySPService,
  getActivAgentsListService,
  getActiveSalesPersonList,
  getActivKAMsListService,
  saveMRService,
} from "../../services/HTTPService";
import { DateInput, NumInput, Select, TextInput } from "../Shared/Elements";
import { FaCheckCircle, FaCheckDouble, FaLink, FaTimes } from "react-icons/fa";
import Colors from "../../assets/theme/Colors";

const MR = (props) => {
  const key = useParams().id;
  var current = new Date();
  current.setDate(current.getDate());
  var date = current.toISOString().substring(0, 10);
  const navigate = useNavigate();
  const defaultPayload = {
    date: date,
    kam: "",
    salesPerson: "",
    agent: "",
    received: "",
    remarks: "",
    type: "cash",
    typeRef: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [showEntries, toggleEntries] = useState(false);
  const [onAccountAmount, setOnAccountAmount] = useState(0);
  const [leftOverAmount, setLeftOverAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [kams, setKAMs] = useState([]);
  const [salesPerson, setSalesPerson] = useState([]);
  const [agents, setAgents] = useState([]);
  const [entries, setEntries] = useState([]);
  const getDetails = () => {
    if (loading === true) {
      setLoading(false);
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
    }
  };
  useEffect(() => {
    getDetails();
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
      onAccount: onAccountAmount,
      balance: balanceAmount,
      received: payload.received,
      type: payload.type,
      typeRef: payload.typeRef,
    };
  };

  const getUnpaidEntries = () => {
    fetchUnpaidEntriesService({
      agent: payload.agent,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          let ent = res.data.data;
          let recv = Number(payload.received);
          let outstanding = 0;
          let leftOvr = recv; //leftover
          ent.forEach((el) => {
            if (leftOvr > 0) {
              if (leftOvr >= el.receivable) {
                leftOvr -= el.receivable;
                el.usedAmount = el.receivable;
                el.balance = 0;
              } else {
                el.usedAmount = leftOvr;
                el.balance = el.receivable - leftOvr;
                leftOvr = 0;
              }
              el.selected = true;
            } else {
              el.selected = false;
              el.usedAmount = 0;
              el.balance = el.receivable;
            }
            outstanding += Number(el.balance);
          });
          leftOvr += Number(res.data.onAccount);
          if (leftOvr > outstanding) {
            console.log(
              "Left Over Amount:",
              Number(leftOvr) - Number(outstanding)
            );
            setLeftOverAmount(Number(leftOvr) - Number(outstanding));
            setBalanceAmount(0);
          }
          if (outstanding > leftOvr) {
            console.log(
              "Balance Amount:",
              Number(outstanding) - Number(leftOvr)
            );
            setBalanceAmount(Number(outstanding) - Number(leftOvr));
            setLeftOverAmount(0);
          }
          if (outstanding === leftOvr) {
            setBalanceAmount(0);
            setLeftOverAmount(0);
          }
          setOnAccountAmount(res.data.onAccount);
          setEntries(ent);
          toggleEntries(true);
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
  };
  return (
    <PageWrapper title="MR">
      <div className="row card p-3">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-md-3 mt-3">
              <DateInput
                label={"Date"}
                value={payload.date}
                onChange={(v) => {
                  setPayload({ ...payload, date: v });
                }}
                disabled={showEntries === true ? true : false}
              />
            </div>
            <div className="col-12 col-md-3 mt-3">
              <Select
                label={"KAM"}
                data={kams}
                value={payload.kam}
                onChange={(v) => {
                  getActiveSalesPersonList({ kam: v }).then((res) => {
                    if (res.status === 200) {
                      if (res.data.status === "success") {
                        setSalesPerson(res.data.data);
                        setPayload({
                          ...payload,
                          kam: v,
                          salesPerson: "",
                          agent: "",
                        });
                      } else {
                        toast.error(res.data.msg);
                      }
                    } else {
                      toast.error("Something went wrong.");
                    }
                  });
                }}
                disabled={showEntries === true ? true : false}
                autoFocus
              />
            </div>
            {payload.kam !== "" ? (
              <div className="col-12 col-md-3 mt-3">
                <Select
                  label={"Sales Person"}
                  data={salesPerson}
                  value={payload.salesPerson}
                  onChange={(v) => {
                    getActivAgentsListBySPService({ key: v }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          setAgents(res.data.data);
                          setPayload({ ...payload, salesPerson: v, agent: "" });
                        } else {
                          toast.error(res.data.msg);
                        }
                      } else {
                        toast.error("Something went wrong.");
                      }
                    });
                  }}
                  disabled={showEntries === true ? true : false}
                />
              </div>
            ) : null}
            {payload.salesPerson !== "" ? (
              <div className="col-12 col-md-3 mt-3">
                <Select
                  label={"Agent"}
                  data={agents}
                  value={payload.agent}
                  onChange={(v) => {
                    setPayload({ ...payload, agent: v });
                  }}
                  disabled={showEntries === true ? true : false}
                />
              </div>
            ) : null}
            {payload.agent !== "" ? (
              <div className="col-12 col-md-3 mt-3">
                <NumInput
                  label={"Received"}
                  value={payload.received}
                  onChange={(v) => {
                    if ((v === "" || Number(v) >= 0) && payload.agent !== "") {
                      setPayload({ ...payload, received: Number(v) });
                    }
                  }}
                  disabled={showEntries === true ? true : false}
                />
              </div>
            ) : null}
            {payload.received !== "" && Number(payload.received) > 0 ? (
              <div className="col-12 col-md-3 mt-3">
                <Select
                  label={"Type"}
                  data={[
                    { name: "Cash", value: "cash" },
                    { name: "Cheque", value: "cheque" },
                    { name: "Bank", value: "bank" },
                    { name: "UPI", value: "upi" },
                  ]}
                  value={payload.type}
                  onChange={(v) => {
                    setPayload({ ...payload, type: v });
                  }}
                />
              </div>
            ) : null}
            {payload.received !== "" && Number(payload.received) > 0 ? (
              <div className="col-12 col-md-3 mt-3">
                <TextInput
                  label={"Type Reference"}
                  value={payload.typeRef}
                  onChange={(v) => {
                    setPayload({ ...payload, typeRef: v });
                  }}
                />
              </div>
            ) : null}
            {payload.agent !== "" ? (
              <div className="col-12 col-md-3 mt-4">
                <div className="row">
                  <div className="col-12 col-md-12 mt-3 text-center">
                    <button
                      className="btn btn-theme"
                      style={{
                        backgroundColor: Colors.defaultThemeColor,
                        marginRight: "10px",
                        color: "yellow",
                      }}
                      onClick={() => {
                        getUnpaidEntries();
                      }}
                    >
                      <FaLink style={{ marginRight: "5px" }} /> Link Entry
                    </button>
                    <button
                      className="btn btn-theme"
                      style={{
                        backgroundColor: Colors.defaultThemeColor,
                        color: "white",
                      }}
                      onClick={() => {
                        toggleEntries(false);
                        setEntries([]);
                      }}
                    >
                      <FaTimes style={{ marginRight: "5px" }} /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
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
                      <td></td>
                      <td>Vehicle</td>
                      <td>Date</td>
                      <td>Checkup</td>
                      <td>Center</td>
                      <td className="text-right">Admission Amt.</td>
                      <td className="text-right">Points Earned</td>
                      <td className="text-right">Receivable</td>
                      <td className="text-right">Used</td>
                      <td className="text-right">Balance</td>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, index) => {
                      return (
                        <tr
                          key={index}
                          style={{
                            fontWeight:
                              entry.selected === true ? "500" : "normal",
                            color: entry.selected === true ? "navy" : "black",
                          }}
                        >
                          <td>
                            {entry.selected ? (
                              <FaCheckCircle style={{ color: "darkgreen" }} />
                            ) : (
                              ""
                            )}
                          </td>
                          <td>{entry.vehicle}</td>
                          <td>{entry.entryDate}</td>
                          <td>{entry.fitnessAt}</td>
                          <td>{entry.center}</td>
                          <td className="text-right">{entry.bookingAmount}</td>
                          <td className="text-right">{entry.pointsEarned}</td>
                          <td className="text-right">{entry.receivable}</td>
                          <td className="text-right">{entry.usedAmount}</td>
                          <td className="text-right">{entry.balance}</td>
                        </tr>
                      );
                    })}
                    {onAccountAmount > 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          On Account
                        </td>
                        <td className="text-right">0</td>
                        <td className="text-right">0</td>
                        <td className="text-right">0</td>
                        <td className="text-right">{onAccountAmount}</td>
                        <td className="text-right">-{onAccountAmount}</td>
                      </tr>
                    ) : null}
                    <tr
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      <td
                        className="text-right"
                        colSpan={5}
                        style={{ textAlign: "right" }}
                      >
                        Total
                      </td>
                      <td className="text-right">
                        {entries.reduce(
                          (acc, entry) => acc + Number(entry.bookingAmount),
                          0
                        )}
                      </td>
                      <td className="text-right">
                        {entries.reduce(
                          (acc, entry) => acc + Number(entry.pointsEarned),
                          0
                        )}
                      </td>
                      <td className="text-right">
                        {entries.reduce(
                          (acc, entry) => acc + Number(entry.receivable),
                          0
                        )}
                      </td>
                      <td className="text-right">
                        {entries.reduce(
                          (acc, entry) => acc + Number(entry.usedAmount),
                          0
                        ) + Number(onAccountAmount)}
                      </td>
                      <td className="text-right">
                        {entries.reduce(
                          (acc, entry) => acc + Number(entry.balance),
                          0
                        ) - Number(onAccountAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-12 mt-3 text-end">
                {leftOverAmount > 0 ? (
                  <h2>
                    Leftover Amount :{" "}
                    <span style={{ color: "darkgreen" }}>{leftOverAmount}</span>
                  </h2>
                ) : null}
                {balanceAmount > 0 ? (
                  <h2>
                    Balance Amount :{" "}
                    <span style={{ color: "darkred" }}>{balanceAmount}</span>
                  </h2>
                ) : null}

                <button
                  className="btn btn-theme mt-4"
                  style={{
                    backgroundColor: Colors.defaultThemeColor,
                    color: "white",
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    let params = createParams(entries);
                    saveMRService(params).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          setEntries([]);
                          setLeftOverAmount(0);
                          setBalanceAmount(0);
                          toggleEntries(false);
                          setPayload({
                            ...payload,
                            received: "",
                            typeRef: "",
                            type: "cash",
                          });
                          // getUnpaidEntries();
                        } else {
                          toast.error(res.data.msg);
                        }
                      } else {
                        toast.error("Something went wrong.");
                      }
                    });
                  }}
                >
                  <FaCheckDouble style={{ marginRight: "5px" }} /> Save
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </PageWrapper>
  );
};

export default MR;
