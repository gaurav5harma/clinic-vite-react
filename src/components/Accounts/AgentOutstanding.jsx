import { useState, useEffect } from "react";
import PageWrapper from "../../hoc/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  fetchUnpaidEntriesService,
  getActivAgentsListBySPService,
  getActiveAgentsListService,
  getActiveCentersListService,
  getActiveSalesPersonList,
  getActivKAMsListService,
  getAgentLedgerService,
  saveMRService,
} from "../../services/HTTPService";
import { DateInput, NumInput, Select, TextInput } from "../Shared/Elements";
import {
  FaCheckCircle,
  FaCheckDouble,
  FaLink,
  FaList,
  FaTimes,
} from "react-icons/fa";
import Colors from "../../assets/theme/Colors";
import ExcelExportService from "../../services/ExcelExportService";
import { formatIndianAmount } from "../../services/PrefService";
import { getUserData } from "../../services/AuthService";

const AgentOutstanding = (props) => {
  const key = useParams().id;
  var current = new Date();
  current.setDate(current.getDate());
  var date = current.toISOString().substring(0, 10);
  const navigate = useNavigate();
  const defaultPayload = {
    agent: "",
    type: "outstanding",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [showEntries, toggleEntries] = useState(false);
  const [leftOverAmount, setLeftOverAmount] = useState(0);
  const [onAccountAmount, setOnAccountAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState("All Agents");
  const [salesPerson, setSalesPerson] = useState([]);
  const [agents, setAgents] = useState([]);
  const [entries, setEntries] = useState([]);
  const [centers, setCenters] = useState([]);
  const getDetails = () => {
    if (loading === true) {
      setLoading(false);
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
    }
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
    if (getUserData().role === "admin") {
      getCenters();
    }
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

  const getUnpaidEntries = () => {
    getAgentLedgerService({
      agent: payload.agent,
      type: payload.type,
      center: payload.center,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          let ent = res.data.data;
          let recv = Number(payload.received);
          let outstanding = 0;
          let leftOvr = 0; //leftover
          ent.length > 0 &&
            ent.forEach((el) => {
              outstanding += Number(el.balance);
            });
          leftOvr += Number(res.data.onAccount);
          // console.log(leftOvr, outstanding);
          if (leftOvr > outstanding) {
            // console.log(
            //   "Left Over Amount:",
            //   Number(leftOvr) - Number(outstanding)
            // );
            setLeftOverAmount(Number(leftOvr) - Number(outstanding));
            setBalanceAmount(0);
          }
          if (outstanding > leftOvr) {
            // console.log(
            //   "Balance Amount:",
            //   Number(outstanding) - Number(leftOvr)
            // );
            setBalanceAmount(Number(outstanding) - Number(leftOvr));
            setLeftOverAmount(0);
          }
          if (outstanding === leftOvr) {
            setBalanceAmount(0);
            setLeftOverAmount(0);
          }
          setOnAccountAmount(res.data.onAccount ? res.data.onAccount : 0);
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
    <PageWrapper title="Agent Outstanding">
      <div className="row card p-3">
        <div className="col-12">
          <div className="row">
            {/* <div className="col-12 col-md-3 mt-3">
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
                />
              </div>
            ) : null} */}
            {/* {payload.salesPerson !== "" ? ( */}
            <div className="col-12 col-md-2 mt-3">
              <Select
                label={"Agent"}
                data={agents}
                value={payload.agent}
                onChange={(v) => {
                  setPayload({ ...payload, agent: v });
                  let idx = agents.findIndex((agent) => agent.value === v);
                  if (idx !== -1) {
                    setSelectedAgent(agents[idx].name);
                  } else {
                    setSelectedAgent("All Agents");
                  }
                }}
                autoFocus={true}
              />
            </div>
            <div className="col-12 col-md-2 mt-3">
              <Select
                label={"Type"}
                data={[
                  { name: "All", value: "all" },
                  { name: "Outstanding Only", value: "outstanding" },
                ]}
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
                  onChange={(val) => {
                    setPayload({ ...payload, center: val });
                  }}
                />
              </div>
            ) : null}
            {/* ) : null} */}

            <div className="col-12 col-md-3 mt-4">
              <div className="row">
                <div className="col-6 col-md-6 mt-3 text-center">
                  <button
                    className="btn btn-theme"
                    style={{
                      backgroundColor: Colors.defaultThemeColor,
                      color: "white",
                    }}
                    onClick={() => {
                      getUnpaidEntries();
                    }}
                  >
                    <FaList style={{ marginRight: "5px" }} /> Get Outstanding
                  </button>
                </div>
                {entries.length > 0 ? (
                  <div
                    className="col-6 col-md-6 text-center"
                    style={{ marginTop: "-16px" }}
                  >
                    <ExcelExportService
                      excelData={entries}
                      fileName={"Agent Outstanding" + " - " + selectedAgent}
                      title={"Download Excel"}
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
                      <td>Vehicle</td>
                      <td>Agent</td>
                      <td>Date</td>
                      <td>Checkup</td>
                      <td>Center</td>
                      <td className="text-right">Admission Amt.</td>
                      <td className="text-right">Points Earned</td>
                      <td className="text-right">Receivable</td>
                      <td className="text-right">Received</td>
                      <td className="text-right">Outstanding</td>
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
                          <td>{index + 1}</td>
                          <td>{entry.vehicle}</td>
                          <td>{entry.agent}</td>
                          <td>{entry.entryDate}</td>
                          <td>{entry.fitnessAt}</td>
                          <td>{entry.center}</td>
                          <td className="text-right">
                            {formatIndianAmount(entry.bookingAmount)}
                          </td>
                          <td className="text-right">
                            {formatIndianAmount(entry.pointsEarned)}
                          </td>
                          <td className="text-right">
                            {formatIndianAmount(entry.receivable)}
                          </td>
                          <td className="text-right">
                            {formatIndianAmount(entry.paid)}
                          </td>
                          <td className="text-right">
                            {formatIndianAmount(entry.balance)}
                          </td>
                        </tr>
                      );
                    })}
                    {onAccountAmount > 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          On Account
                        </td>
                        <td className="text-right">0</td>
                        <td className="text-right">0</td>
                        <td className="text-right">0</td>
                        <td className="text-right">
                          {formatIndianAmount(onAccountAmount)}
                        </td>
                        <td className="text-right">
                          -{formatIndianAmount(onAccountAmount)}
                        </td>
                      </tr>
                    ) : null}

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
                        {entries.reduce(
                          (acc, entry) => acc + Number(entry.bookingAmount),
                          0
                        )}
                      </td>
                      <td className="text-right">
                        {formatIndianAmount(
                          entries.reduce(
                            (acc, entry) => acc + Number(entry.pointsEarned),
                            0
                          )
                        )}
                      </td>
                      <td className="text-right">
                        {formatIndianAmount(
                          entries.reduce(
                            (acc, entry) => acc + Number(entry.receivable),
                            0
                          )
                        )}
                      </td>
                      <td className="text-right">
                        {formatIndianAmount(
                          entries.reduce(
                            (acc, entry) => acc + Number(entry.paid),
                            0
                          ) + Number(onAccountAmount)
                        )}
                      </td>
                      <td className="text-right">
                        {formatIndianAmount(
                          entries.reduce(
                            (acc, entry) => acc + Number(entry.balance),
                            0
                          ) - onAccountAmount
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-12 mt-3 text-end">
                {leftOverAmount > 0 ? (
                  <h2>
                    On Account Amount :{" "}
                    <span style={{ color: "darkgreen" }}>
                      {onAccountAmount}
                    </span>
                  </h2>
                ) : null}
                {balanceAmount > 0 ? (
                  <h2>
                    Balance Amount :{" "}
                    <span style={{ color: "darkred" }}>{balanceAmount}</span>
                  </h2>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AgentOutstanding;
