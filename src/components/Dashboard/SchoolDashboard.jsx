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

const SchoolDashboard = (props) => {
  const key = useParams().id;
  const navigate = useNavigate();
  const defaultPayload = {
    name: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const getDetails = () => {
    if (loading === true) {
      setLoading(false);
      getSchoolSummaryService({
        school: getUserData().username,
        session: getCurrentSession(),
      }).then((res) => {
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
    getDetails();
  }, []);

  return (
    <PageWrapper title={getUserData().name}>
      <div className="row card p-3">
        <div className="col-12">
          <div className="row">
            <div
              className="col-6 col-md-2 mb-3"
              onClick={() => navigate("/students/add")}
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
            </div>
            <div
              className="col-6 col-md-2 mb-3"
              onClick={() => navigate("/employees/add")}
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
                <h4 className="text-center mt-4">Add Employee</h4>
              </div>
            </div>
            <div
              className="col-6 col-md-2 mb-3"
              onClick={() => navigate("/students/manage")}
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
                <h4 className="text-center mt-4">Manage Students</h4>
              </div>
            </div>
            <div
              className="col-6 col-md-2 mb-3"
              onClick={() => navigate("/employees/manage")}
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
                <h4 className="text-center mt-4">Manage Employees</h4>
              </div>
            </div>
            <div
              className="col-6 col-md-2 mb-3"
              onClick={() => navigate("/masters/classes")}
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
                <h4 className="text-center mt-4">Classes Master</h4>
              </div>
            </div>
            <div
              className="col-6 col-md-2"
              onClick={() => navigate("/masters/designations")}
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
                <h4 className="text-center mt-4">Designations Master</h4>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <h4>Student ID Cards</h4>
            {summary.students && summary.students[0].total ? (
              <div className="col-6 col-md-2 mb-3">
                <div
                  style={{
                    width: "100%",
                    background: "#fafafa",
                    height: "70px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  className="card"
                >
                  <h4 className="text-center mt-2">Total Students</h4>
                  <h2 className="text-center">{summary.students[0].total}</h2>
                </div>
              </div>
            ) : null}
            {summary.students && summary.students[0].verified ? (
              <div className="col-6 col-md-2 mb-3">
                <div
                  style={{
                    width: "100%",
                    background: "#fafafa",
                    height: "70px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  className="card"
                >
                  <h4 className="text-center mt-2">Verified Students</h4>
                  <h2 className="text-center">
                    {summary.students[0].verified}
                  </h2>
                </div>
              </div>
            ) : null}
            {summary.students && summary.students[0].notVerified ? (
              <div className="col-6 col-md-2 mb-3">
                <div
                  style={{
                    width: "100%",
                    background: "#fafafa",
                    height: "70px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  className="card"
                >
                  <h4 className="text-center mt-2">Unverified Students</h4>
                  <h2 className="text-center">
                    {Number(summary.students[0].notVerified) +
                      Number(summary.students[0].notClicked)}
                  </h2>
                </div>
              </div>
            ) : null}
            {summary.students && summary.students[0].printed ? (
              <div className="col-6 col-md-2 mb-3">
                <div
                  style={{
                    width: "100%",
                    background: "#fafafa",
                    height: "70px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  className="card"
                >
                  <h4 className="text-center mt-2">Ready to Deliver</h4>
                  <h2 className="text-center">{summary.students[0].printed}</h2>
                </div>
              </div>
            ) : null}
            {summary.students && summary.students[0].printed ? (
              <div className="col-6 col-md-2 mb-3">
                <div
                  style={{
                    width: "100%",
                    background: "#fafafa",
                    height: "70px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  className="card"
                >
                  <h4 className="text-center mt-2">Delivered</h4>
                  <h2 className="text-center">
                    {summary.students[0].delivered}
                  </h2>
                </div>
              </div>
            ) : null}
            {summary.students && summary.students[0].toPrint ? (
              <div className="col-6 col-md-2 mb-3">
                <div
                  style={{
                    width: "100%",
                    background: "#fafafa",
                    height: "70px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  className="card"
                >
                  <h4 className="text-center mt-2">In Process</h4>
                  <h2 className="text-center">{summary.students[0].toPrint}</h2>
                </div>
              </div>
            ) : null}
          </div>

          <div className="row mt-4">
            <h4>Employee ID Cards</h4>
            {summary.teachers &&
            summary.teachers[0] &&
            summary.teachers[0].total ? (
              <div className="col-6 col-md-2 mb-3">
                <div
                  style={{
                    width: "100%",
                    background: "#fafafa",
                    height: "70px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  className="card"
                >
                  <h4 className="text-center mt-2">Total Employees</h4>
                  <h2 className="text-center">{summary.teachers[0].total}</h2>
                </div>
              </div>
            ) : null}
            {summary.teachers &&
            summary.teachers[0] &&
            summary.teachers[0].verified ? (
              <div className="col-6 col-md-2 mb-3">
                <div
                  style={{
                    width: "100%",
                    background: "#fafafa",
                    height: "70px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  className="card"
                >
                  <h4 className="text-center mt-2">Verified Employes</h4>
                  <h2 className="text-center">
                    {summary.teachers[0].verified}
                  </h2>
                </div>
              </div>
            ) : null}
            {summary.teachers &&
            summary.teachers[0] &&
            summary.teachers[0].notVerified ? (
              <div className="col-6 col-md-2 mb-3">
                <div
                  style={{
                    width: "100%",
                    background: "#fafafa",
                    height: "70px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  className="card"
                >
                  <h4 className="text-center mt-2">Unverified Employees</h4>
                  <h2 className="text-center">
                    {Number(summary.teachers[0].notVerified) +
                      Number(summary.teachers[0].notClicked)}
                  </h2>
                </div>
              </div>
            ) : null}
            {summary.teachers &&
            summary.teachers[0] &&
            summary.teachers[0].printed ? (
              <div className="col-6 col-md-2 mb-3">
                <div
                  style={{
                    width: "100%",
                    background: "#fafafa",
                    height: "70px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  className="card"
                >
                  <h4 className="text-center mt-2">Ready to Deliver</h4>
                  <h2 className="text-center">{summary.teachers[0].printed}</h2>
                </div>
              </div>
            ) : null}
            {summary.teachers &&
            summary.teachers[0] &&
            summary.teachers[0].printed ? (
              <div className="col-6 col-md-2 mb-3">
                <div
                  style={{
                    width: "100%",
                    background: "#fafafa",
                    height: "70px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  className="card"
                >
                  <h4 className="text-center mt-2">Delivered</h4>
                  <h2 className="text-center">
                    {summary.teachers[0].delivered}
                  </h2>
                </div>
              </div>
            ) : null}
            {summary.teachers &&
            summary.teachers[0] &&
            summary.teachers[0].toPrint ? (
              <div className="col-6 col-md-2 mb-3">
                <div
                  style={{
                    width: "100%",
                    background: "#fafafa",
                    height: "70px",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  className="card"
                >
                  <h4 className="text-center mt-2">In Process</h4>
                  <h2 className="text-center">{summary.teachers[0].toPrint}</h2>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SchoolDashboard;
