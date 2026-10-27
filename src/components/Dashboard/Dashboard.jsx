import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import { getUserData } from "../../services/AuthService";
import SchoolDashboard from "./SchoolDashboard";
import AdminDashboard from "./AdminDashboard";
import PageWrapper from "../../hoc/PageWrapper";
import {
  getActiveCentersListService,
  getDashboardService,
  startConsultationService,
} from "../../services/HTTPService";
import { Select } from "../Shared/Elements";
import { toast } from "react-toastify";
import { FaPrescription } from "react-icons/fa";

const Dashboard = (props) => {
  const navigate = useNavigate();
  const defaultPayload = {
    name: "",
  };
  const [cards, setCards] = useState([]);
  const [center, setCenter] = useState(null);
  const [centers, setCenters] = useState([]);
  const [opds, setOpds] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [loading, setLoading] = useState(defaultPayload);
  const getDetails = (center) => {
    getDashboardService({ center: center }).then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setCards(res.data.cards);
          setQuickLinks(res.data.quickLinks);
          setOpds(res.data.opds);
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
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
    // getCenters();
  }, []);

  const loadDashboard = () => {
    switch (getUserData().role) {
      case "school-admin":
        return <SchoolDashboard />;
        break;
      case "admin":
        return <AdminDashboard />;
        break;
      case "devadmin":
        return <AdminDashboard />;
        break;
    }
  };

  const generateDashboard = () => {
    let data = cards.slice(0, 6);
    let finalData = [];
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      let row = (
        <div
          key={i}
          className="col-6 col-sm-6 col-md-4 col-lg-2 mb-3"
          onClick={() => navigate(el.url)}
          style={{ cursor: "pointer" }}
        >
          <div
            style={{
              width: "100%",
              background: "linear-gradient(180deg, #f7f7f7 0%, #f0f0f0 100%)",
              borderRadius: "16px",
              height: "100px",
              padding: "4px 8px 5px",
              border: "1px solid #e7e7e7",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "15px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            className="card quick-link-card dashboard-stat-card"
          >
            <div
              style={{
                fontSize: "clamp(10px, 1.1vw, 14px)",
                lineHeight: 1,
                color: "#4d4d4d",
                fontWeight: 600,
                textAlign: "center",
                minHeight: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                wordBreak: "break-word",
                letterSpacing: "0.2px",
              }}
            >
              {el.title}
            </div>

            <div
              style={{
                fontSize: "clamp(22px, 2.1vw, 28px)",
                lineHeight: 1,
                fontWeight: 800,
                color: "#181818",
                textAlign: "center",
                margin: "0",
              }}
            >
              {el.count}
            </div>
          </div>
        </div>
      );
      finalData.push(row);
    }
    return finalData;
  };

  const generateLinks = () => {
    let data = quickLinks;
    let finalData = [];
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      let row = (
        <div className=" col-12 mb-3 " onClick={() => navigate(el.url)}>
          <div
            style={{
              width: "100%",
              background: "#fafafa",
              height: "40px",
              borderRadius: "20px",
              cursor: "pointer",
            }}
            className="card quick-link-card"
          >
            <h3 className="text-center mt-2 mb-0">{el.title}</h3>
          </div>
        </div>
      );
      finalData.push(row);
    }
    return finalData;
  };

  const generateOPDs = () => {
    const data = opds || [];

    if (data.length === 0) {
      return (
        <div className="text-center text-muted py-4">No patients in queue</div>
      );
    }

    const waitingCount = data.filter(
      (el) => (el.status || "Waiting").toLowerCase() !== "completed"
    ).length;
    const completedCount = data.length - waitingCount;

    const getInitials = (name) => {
      return (name || "?")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
    };

    const getStatusConfig = (status) => {
      const normalized = String(status || "WAITING")
        .trim()
        .replace(/[_-]+/g, " ")
        .toUpperCase();
      const labels = {
        "WAITING": "Waiting",
        "IN CONSULTATION": "In Consultation",
        "SKIPPED": "Skipped",
        "COMPLETED": "Completed",
      };
      const statusStyles = {
        "WAITING": {
          background: "#fff4df",
          color: "#b7771d",
          border: "1px solid #f0d59a",
        },
        "IN CONSULTATION": {
          background: "#e8f1ff",
          color: "#2864a5",
          border: "1px solid #bfd5f2",
        },
        "SKIPPED": {
          background: "#fff0f0",
          color: "#b33a3a",
          border: "1px solid #f0c4c4",
        },
        "COMPLETED": {
          background: "#e8f7ef",
          color: "#1d8f5d",
          border: "1px solid #bfe8d1",
        },
      };
      const label =
        labels[normalized] ||
        normalized
          .toLowerCase()
          .replace(/\b\w/g, (character) => character.toUpperCase());

      return {
        label,
        style: {
          ...(statusStyles[normalized] || {
            background: "#f1f3f5",
            color: "#495057",
            border: "1px solid #d6d8db",
          }),
          padding: "4px 8px",
          borderRadius: "999px",
          fontSize: "9px",
          fontWeight: 600,
        },
      };
    };

    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontWeight: 700 }}>Today's queue</h4>
            <small style={{ color: "#7d7d7d" }}>
              {data.length} total • {waitingCount} waiting • {completedCount} completed
            </small>
          </div>
          <button
            className="btn btn-link p-0"
            style={{ color: "#4b4b4b", fontWeight: 600 }}
          >
            Open queue
          </button>
        </div>

        {data.map((el, index) => {
          const tokenNo = el.token || "-";
          const patientName = el.name || "Unknown";
          const uhid = el.uhid || "-";
          const age = el.age ?? "-";
          const gender = el.gender || "-";
          const statusConfig = getStatusConfig(el.status);
          const initials = getInitials(patientName);

          return (
            <div
              key={el.id || el.patientId || el.uhid || index}
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                borderBottom: "1px solid #e8e8e8",
                padding: "12px 0",
                gap: "10px 12px",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  minWidth: "42px",
                  width: "42px",
                  height: "42px",
                  borderRadius: "14px",
                  background: el.status === "COMPLETED" ? "#e0e0e0" : "#dfeff3",
                  color: el.status === "COMPLETED" ? "#939393" : "#1d4d5a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "15px",
                  flexShrink: 0,
                }}
              >
                {String(tokenNo).padStart(2, "0")}
              </div>

              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#e9d9df",
                  color: "#3b3b3b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "12px",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>

              <div style={{ flex: "1 1 180px", minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#1d1d1d",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {patientName}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#7b7b7b",
                    marginTop: "2px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {uhid}
                </div>
              </div>

              <div
                style={{
                  fontSize: "10px",
                  color: "#4f4f4f",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {age} yrs • {gender}
              </div>

              <div style={{ minWidth: "110px", textAlign: "center", flexShrink: 0 }}>
                <span style={statusConfig.style}>{statusConfig.label}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginLeft: "auto",
                  flexShrink: 0,
                }}
              >
                {el.status === "COMPLETED" ? (
                  <button
                    className="btn"
                    style={{
                      background: "#cbcbcb",
                      color: "#101010",
                      borderRadius: "10px",
                      fontWeight: 600,
                      padding: "5px 10px",
                      minWidth: "80px",
                      fontSize: "11px",
                    }}
                  >
                    Prescription
                    <FaPrescription style={{ marginLeft: "5px" }}></FaPrescription>
                  </button>
                ) : (
                  <button
                    className="btn"
                    style={{
                      background: "#1d8f7e",
                      color: "#fff",
                      borderRadius: "10px",
                      fontWeight: 600,
                      padding: "5px 10px",
                      minWidth: "80px",
                      fontSize: "11px",
                    }}
                  >
                    Start
                    <span style={{ marginLeft: "5px" }}>→</span>
                  </button>
                )}

                <button
                  className="btn btn-light"
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    width: "28px",
                    height: "28px",
                    padding: 0,
                    fontSize: "18px",
                    color: "#4f4f4f",
                    lineHeight: 1,
                  }}
                >
                  ···
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .dashboard-stat-card {
            height: 78px !important;
            padding: 3px 5px !important;
          }

          .dashboard-stat-card > div:first-child {
            font-size: 9px !important;
            min-height: 16px !important;
          }

          .dashboard-stat-card > div:last-child {
            font-size: 18px !important;
          }
        }
      `}</style>
      <PageWrapper title={center ? center : "Welcome " + getUserData().name}>
      <div className="row card p-3">
        <div className="col-12">
          <div className="row">{generateDashboard()}</div>
        </div>
      </div>

      <div className="row mt-2">
          <div className="col-12 col-md-9">
            <div className="col-12 card p-3 mb-2">
              <h3 className="mb-3">Up Next</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  borderBottom: "1px solid #e8e8e8",
                  padding: "12px 0",
                  gap: "10px 12px",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    minWidth: "42px",
                    width: "42px",
                    height: "42px",
                    borderRadius: "14px",
                    background: "#dfeff3",
                    color: "#1d4d5a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "15px",
                    flexShrink: 0,
                  }}
                >
                  {String(opds[0]?.token || 0).padStart(2, "0")}
                </div>

                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#e9d9df",
                    color: "#3b3b3b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "12px",
                    flexShrink: 0,
                  }}
                >
                  {(opds[0]?.name || "?")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase()}
                </div>

                <div style={{ flex: "1 1 180px", minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#1d1d1d",
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {opds[0]?.name || "Unknown"}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#7b7b7b",
                      marginTop: "2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {opds[0]?.uhid || "Unknown"}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "10px",
                    color: "#4f4f4f",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {opds[0]?.age || "Unknown"} yrs • {opds[0]?.gender || "Unknown"}
                </div>

                <div style={{ minWidth: "110px", textAlign: "center", flexShrink: 0 }}>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginLeft: "auto",
                    flexShrink: 0,
                  }}
                >
                  <button
                    className="btn"
                    style={{
                      background: "#1d8f7e",
                      color: "#fff",
                      borderRadius: "10px",
                      fontWeight: 600,
                      padding: "5px 10px",
                      minWidth: "80px",
                      fontSize: "11px",
                    }}
                    onClick={() => {
                      startConsultationService({ uhid: opds[0]?.uhid }).then(res=>{
                         if (res.status === 200) {
                            if (res.data.status === "success") {
                               toast.success(res.data.msg);
                                getDetails();
                            } else {
                               toast.error(res.data.msg);
                            }
                        } else {
                          toast.error("Something went wrong.");
                        }
                      });
                    }}
                  >
                    Start Consultation
                    <span style={{ marginLeft: "5px" }}>→</span>
                  </button>
                  <button
                    className="btn"
                    style={{
                      background: "#000000",
                      color: "#fff",
                      borderRadius: "10px",
                      fontWeight: 600,
                      padding: "5px 10px",
                      minWidth: "80px",
                      fontSize: "11px",
                    }}
                  >
                    Skip
                    <span style={{ marginLeft: "5px" }}> x</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12 card p-3">

            {generateOPDs()}
            </div>
          </div>

        {quickLinks.length > 0 ? (
          <div className="col-12 col-md-3">
            <div className="col-12 card p-3">
              <h3 className="mb-3">Quick Links</h3>
              <div className="col-12">{generateLinks()}</div>
            </div>
          </div>
        ) : null}

          {/* {loadDashboard()} */}
      </div>
    </PageWrapper>
    </>
  );
};

export default Dashboard;
