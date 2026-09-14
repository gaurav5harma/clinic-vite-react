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
} from "../../services/HTTPService";
import { Select } from "../Shared/Elements";
import { toast } from "react-toastify";

const Dashboard = (props) => {
  const navigate = useNavigate();
  const defaultPayload = {
    name: "",
  };
  const [cards, setCards] = useState([]);
  const [center, setCenter] = useState(null);
  const [centers, setCenters] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [loading, setLoading] = useState(defaultPayload);
  const getDetails = (center) => {
    getDashboardService({ center: center }).then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setCards(res.data.cards);
          setQuickLinks(res.data.quickLinks);
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
    getCenters();
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
    let data = cards;
    let finalData = [];
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      let row = (
        <div className=" col-6 col-md-2 mb-3 " onClick={() => navigate(el.url)}>
          <div
            style={{
              width: "100%",
              background: "#fafafa",
              height: "90px",
              borderRadius: "20px",
              cursor: "pointer",
            }}
            className="card quick-link-card"
          >
            <h1 className="text-center mt-3">{el.count}</h1>
            <h4 className="text-center">{el.title}</h4>
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
        <div className=" col-6 col-md-2 mb-3 " onClick={() => navigate(el.url)}>
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
  return (
    <PageWrapper title={center ? center : "Welcome " + getUserData().name}>
      <div className="row card p-3">
        <div className="col-12">
          <h3 className="mb-3">Dashboard</h3>
          {getUserData().role === "admin" ||
          getUserData().role === "devadmin" ? (
            <div className="row mb-3">
              <div className="col-12 col-md-2">
                <Select
                  data={centers}
                  value={center}
                  onChange={(val) => {
                    getDetails(val);
                    setCenter(val);
                  }}
                />
              </div>
            </div>
          ) : null}
          <div className="row">{generateDashboard()}</div>
          {/* {loadDashboard()} */}
        </div>
        {quickLinks.length > 0 ? (
          <div className="col-12 mt-4">
            <h3 className="mb-3">Quick Links</h3>
            <div className="row">{generateLinks()}</div>
          </div>
        ) : null}
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
