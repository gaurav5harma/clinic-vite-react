import { useState, useEffect } from "react";
import PageWrapper from "../../hoc/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  requestPoliciesService,
  saveDepositService,
} from "../../services/HTTPService";
import { DateInput, Select, TextInput } from "../Shared/Elements";
import { FaArrowRight, FaList, FaTrash } from "react-icons/fa";
import Colors from "../../assets/theme/Colors";
import ExcelExportService from "../../services/ExcelExportService";
import { formatIndianAmount } from "../../services/PrefService";
import { Modal } from "react-bootstrap";
import { hasAccess } from "../../services/AuthService";

const Transfer = (props) => {
  const key = useParams().id;
  var current = new Date();
  current.setDate(current.getDate());
  var date = current.toISOString().substring(0, 10);
  const navigate = useNavigate();
  const defaultPayload = {
    fromBook: "",
    toBook: "",
    remarks:"",
    amount:""
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
  const getPolicies = () => {
    let policyParams = ["books", "depositBooks"];
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

  const saveDeposit = () => {
    saveDepositService({
      fromBook: payload.fromBook,
      toBook: payload.toBook,
      amount: payload.amount,
      remarks: payload.remarks,
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          toast.success(res.data.msg);
          setPayload(defaultPayload)
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
  };

  return (
    <PageWrapper title="Transfer">
      <div className="row card p-3">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-md-2 mt-3">
              <Select
                label={"From Book"}
                data={policies && policies.books}
                value={payload.fromBook}
                onChange={(v) => {
                  setPayload({ ...payload, fromBook: v });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mt-3">
              <Select
                label={"To Book"}
                data={policies && policies.depositBooks}
                value={payload.toBook}
                onChange={(v) => {
                  setPayload({ ...payload, toBook: v });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mt-3">
              <TextInput
                label={"Amount"}
                value={payload.amount}
                onChange={(v) => {
                  if (v === "" || Number(v) >= 0) {
                    setPayload({ ...payload, amount: v });
                  }
                }}
              />
            </div>
            <div className="col-12 col-md-2 mt-3">
              <TextInput
                label={"Transfer Remarks"}
                value={payload.remarks}
                onChange={(v) => {
                  setPayload({ ...payload, remarks: v });
                } }
              />
            </div>
            <div className="col-md-4 mt-3">
              <div className="row">
                <div className="col-6 col-md-2 mt-4 text-center">
                  <button
                    className="btn btn-theme"
                    style={{
                      backgroundColor: Colors.defaultThemeColor,
                      color: "white",
                      marginRight: "20px",
                    }}
                    onClick={() => {
                      saveDeposit();
                    }}
                  >
                    <FaArrowRight style={{ marginRight: "5px" }} /> Transfer
                  </button>
                </div>
                {mrs.length > 0 ? (
                  <div className="col-6 col-md-2 text-center">
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
                      title={"Download Excel"}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Transfer;
