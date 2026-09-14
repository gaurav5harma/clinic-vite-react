import React, { useState, useEffect } from "react";
import PageWrapper from "../../hoc/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import SweetAlert from "react-bootstrap-sweetalert";
import Icons from "../../assets/theme/Icons";
import Colors from "../../assets/theme/Colors";
import "react-confirm-alert/src/react-confirm-alert.css";
import { getCurrentSession, getUserData } from "../../services/AuthService";
import { getSchoolSummaryService } from "../../services/HTTPService";
import { Select } from "../Shared/Elements";

const AdminDashboard = (props) => {
  const key = useParams().id;
  const navigate = useNavigate();
  const defaultPayload = {
    name: "",
  };
  const defaultPricing = {
    card: "",
    side: "",
    material: "",
    lanyard: "",
    hook: "",
    quantity: 1,
    maintenance: false,
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [pricing, setPricing] = useState(defaultPricing);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const getDetails = () => {
    if (loading === true) {
      setLoading(false);
      getSchoolSummaryService({ session: getCurrentSession() }).then((res) => {
        if (res.status === 200) {
          if (res.data.status === "success") {
            setSummary(res.data);
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
    // getDetails();
  }, []);

  return (
    // <PageWrapper title={getUserData().name}>
    // <div className="row card p-3">
    //   <div className="col-12">
    <div className="row">
      <div
        className=" col-6 col-md-2 mb-3 "
        onClick={() => navigate("/entries/new-entry")}
      >
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
          <h4 className="text-center mt-4">New Entry</h4>
        </div>
      </div>{" "}
      {/* <div
              className=" col-6 col-md-2 mb-3"
              onClick={() => navigate("/enries/new-entry")}
            >
              <div
                style={{
                  width: "100%",
                  background: "#fafafa",
                  height: "90px",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
                className="card"
              >
                <h4 className="text-center mt-4">Add Student</h4>
              </div>
            </div> */}
    </div>
    //   </div>
    // </div>
    // </PageWrapper>
  );
};

export default AdminDashboard;
