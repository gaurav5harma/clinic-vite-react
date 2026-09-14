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
  backupService,
  getActiveCentersListService,
  getActiveStatusListService,
  getEntryReportService,
  performActionService,
  updateExemptRemarksService,
} from "../../services/HTTPService";
import {
  getCurrentSession,
  getUserData,
  hasAccess,
} from "../../services/AuthService";
import { useReactToPrint } from "react-to-print";
import { Modal } from "react-bootstrap";
import ExcelExportService from "../../services/ExcelExportService";
import { formatIndianAmount } from "../../services/PrefService";
import { FaPlusSquare } from "react-icons/fa";

const EntryReport = (props) => {
  const key = useParams().ref;
  const navigate = useNavigate();
  const componentRef = useRef();
  var current = new Date();
  current.setDate(current.getDate());
  var date = current.toISOString().substring(0, 10);

  const defaultPayload = {
    from: date,
    to: date,
    center: "",
    reportType: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [tabVal, setTabVal] = useState(1);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActionModal, toggleActionModal] = useState(false);
  const [centers, setCenters] = useState([]);
  const [updateVal, setUpdateVal] = useState(1);

  const [searchString, setSearchString] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [activeStatus, setActiveStatus] = useState([]);

  const [tableFont, setTableFont] = useState({
    data: "14px",
    head: "16px",
    title: "18px",
  });
  const [policies, setPolicies] = useState(null);
  const getDetails = () => {
    getActiveStatusListService({ type: "entries" }).then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setActiveStatus(res.data.data);
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
    getCenters();
    getDetails();
  }, []);

  const updateData = () => {
    let upd = updateVal;
    upd = upd + 1;
    setUpdateVal(upd);
  };

  const actionModal = () => {
    return (
      <>
        <Modal
          show={showActionModal}
          onHide={() => {
            toggleActionModal(false);
            setFormsData(defaultPayload);
          }}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <h3 className="text-center">
                  {selectedEntry && selectedEntry.vehicle}
                </h3>
                <div className="col-12 mb-2">
                  <TextInput
                    label="Remarks"
                    value={
                      selectedEntry && selectedEntry.exemptRemarks
                        ? selectedEntry.exemptRemarks
                        : ""
                    }
                    onChange={(val) => {
                      setSelectedEntry({
                        ...selectedEntry,
                        exemptRemarks: val,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            {selectedEntry &&
            selectedEntry.exemptRemarks &&
            selectedEntry.exemptRemarks !== "" ? (
              <div className="row text-center mt-4">
                <div className="col-md-12 mb-6 text-center">
                  <button
                    className="btn btn-theme"
                    onClick={() => {
                      updateExemptRemarksService({
                        eid: selectedEntry.id,
                        eRemarks: selectedEntry.exemptRemarks,
                      }).then((res) => {
                        if (res.status === 200) {
                          if (res.data.status === "success") {
                            toast.success(res.data.msg);
                            toggleActionModal(false);
                            getEntryReportService(payload).then((res) => {
                              if (res.status === 200) {
                                setReport(res.data.data);
                              } else {
                                toast.error("Something went wrong.");
                              }
                            });
                          } else {
                            toast.error(res.data.msg);
                          }
                        } else {
                          toast.error("Something went wrong.");
                        }
                      });
                    }}
                  >
                    Save Remarks
                  </button>
                </div>
              </div>
            ) : null}
          </Modal.Body>
        </Modal>
      </>
    );
  };

  const browseFPD = (event) => {
    let fileinfo = event.target.files[0];
    let name = event.target.name;
    // setAttachmentFileInfo(fileinfo);
    if (fileinfo && fileinfo.size / 2024 <= 3072) {
      fileToDataUri(fileinfo).then((dataUri) => {
        let data = {
          title: currentAttachmentTitle,
          value: dataUri,
        };
        // let attachment = fpds;
        // attachment.push(data);

        // // attachment[attachment.findIndex((ob) => ob.title === name)].value =
        // //   dataUri;
        setPayload({ ...payload, logo: data });
        // setCurrentAttachmentTitle("");
      });
    } else {
      toast.error("File size should be less than 3 MB.");
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

  const generateList = () => {
    let items = report;
    let tblData = [];
    let totalReceivable = 0;
    let totalBookingAmount = 0;
    let totalPointsEarned = 0;
    let totalGovtShare = 0;
    let totalOurShare = 0;
    for (let i = 0; i < items.length; i++) {
      const ele = items[i];
      let receivable = Number(ele.pointsEarned);
      if (ele.bookingBy !== null) {
        receivable = receivable + Number(ele.bookingAmount);
      }
      totalReceivable += receivable;
      totalBookingAmount += Number(ele.bookingAmount);
      totalPointsEarned += Number(ele.pointsEarned);
      totalGovtShare += Number(ele.govtShare);
      totalOurShare += Number(ele.ourShare);

      let row = (
        <tr key={i} style={{ background: i % 2 === 0 ? "#fafafa" : "" }}>
          <td className="text-center">{i + 1}</td>
          <td className="text-left">{ele.date}</td>
          <td className="text-left">{ele.vehicle}</td>
          <td className="text-left">{ele.category}</td>
          <td className="text-center">{ele.user}</td>
          <td className="text-center">{ele.salesPerson}</td>
          <td className="text-center">{ele.agent}</td>
          <td className="text-center">{ele.center}</td>
          <td className="text-center">{ele.managingCenter}</td>
          <td className="text-center">{ele.bookingBy}</td>
          <td className="text-right">{ele.bookingId}</td>
          <td className="text-right">{formatIndianAmount(ele.ourShare)}</td>
          <td className="text-right">{formatIndianAmount(ele.govtShare)}</td>
          <td className="text-right">
            {formatIndianAmount(ele.bookingAmount)}
          </td>
          <td className="text-right">{formatIndianAmount(ele.pointsEarned)}</td>
          <td className="text-right">{formatIndianAmount(receivable)}</td>
          <td className="text-left">
            <small>{ele.remarks}</small>

            {hasAccess("can-add-exempt-remarks") === true &&
            payload.reportType === "exempt" &&
            ele.exemptRemarks.trim() === "" ? (
              <FaPlusSquare
                style={{ cursor: "pointer", color: "navy", float: "right" }}
                onClick={() => {
                  toggleActionModal(true);
                  setSelectedEntry(ele);
                }}
              />
            ) : null}
          </td>
          <td className="text-center">{ele.statusCheck}</td>
        </tr>
      );
      tblData.push(row);
    }
    let lRow = (
      <tr style={{ background: "grey", color: "white" }}>
        <th className="text-center" colSpan={11}>
          {"TOTAL"}
        </th>
        <th className="text-right ps-2">{formatIndianAmount(totalOurShare)}</th>
        <th className="text-right ps-2">
          {formatIndianAmount(totalGovtShare)}
        </th>
        <th className="text-right ps-2">
          {formatIndianAmount(totalBookingAmount)}
        </th>
        <th className="text-right ps-2">
          {formatIndianAmount(totalPointsEarned)}
        </th>
        <th className="text-right ps-2">
          {formatIndianAmount(totalReceivable)}
        </th>
        <th className="text-right ps-2"></th>
        <th className="text-right ps-2"></th>
      </tr>
    );
    tblData.push(lRow);
    return tblData;
  };

  const printReport = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <PageWrapper title={key ? key : "Entry Report"}>
      {actionModal()}
      <div className="row card p-3">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-md-2 mb-3">
                <DateInput
                  label={"From"}
                  value={payload.from}
                  maxDate={date}
                  onChange={(val) => {
                    setPayload({ ...payload, from: val });
                  }}
                  autoFocus={true}
                />
              </div>
              <div className="col-12 col-md-2 mb-3">
                <DateInput
                  label={"To"}
                  value={payload.to}
                  minDate={payload.from}
                  maxDate={date}
                  onChange={(val) => {
                    setPayload({ ...payload, to: val });
                  }}
                  autoFocus={true}
                />
              </div>
              {getUserData().role==='admin'?(
                
              <div className="col-12 col-md-2 mb-3">
                <Select
                  label={"Center"}
                  data={centers}
                  value={payload.center}
                  onChange={(val) => {
                    setPayload({ ...payload, center: val });
                    setReport([]);
                  }}
                />
              </div>
              ):null}
              <div className="col-12 col-md-2 mb-3">
                <Select
                  label={"Report Type"}
                  data={[
                    ...activeStatus,
                    ...[{ name: "EXEMPT", value: "exempt" }],
                    ...[{ name: "BACK DATE", value: "back-date" }],
                  ]}
                  value={payload.reportType}
                  onChange={(val) => {
                    setPayload({ ...payload, reportType: val });
                    setReport([]);
                  }}
                />
              </div>
              <div className="col-12 col-md-2 text-right mt-4">
                <button
                  className="btn btn-theme"
                  disabled={
                    payload.from === "" || payload.to === "" ? true : false
                  }
                  onClick={() => {
                    if (payload.from === "") {
                      toast.warning("Please select From Date");
                    } else if (payload.to === "") {
                      toast.warning("Please select To Date");
                    } else {
                      getEntryReportService(payload).then((res) => {
                        if (res.status === 200) {
                          setReport(res.data.data);
                        } else {
                          toast.error("Something went wrong.");
                        }
                      });
                    }
                  }}
                >
                  Generate
                </button>

                <button
                  className="btn btn-theme"
                  disabled={report.length === 0 ? true : false}
                  onClick={printReport}
                >
                  Print
                </button>
                <button
                  className="btn btn-theme"
                  onClick={() => {
                    backupService().then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
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
                  Backup
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {report.length > 0 ? (
            <div className="col-12">
              <ExcelExportService
                excelData={report}
                fileName={
                  "Entry Report" + " - " + payload.from + "_to_" + payload.to
                }
                title={"Download Excel"}
              />
            </div>
          ) : null}
        </div>
        {report.length > 0 ? (
          <div className="row">
            <div
              className="col-12 text-center"
              ref={componentRef}
              style={{ padding: "20px 30px", overflowX: "auto" }}
            >
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #eaeaea" }} colSpan={18}>
                      <h1 className="text-center m-0">
                        {payload.reportType !== ""
                          ? payload.reportType.replace("-", " ").toUpperCase()
                          : "CERTIFICATE ISSUED"}
                        {payload.center === "" ? "" : " -" + payload.center}
                      </h1>
                      <h3 className="text-center m-0">
                        {payload.from === payload.to
                          ? payload.from
                          : payload.from + " to " + payload.to}
                      </h3>
                    </th>
                  </tr>
                  <tr style={{ background: "gray" }}>
                    <th className="table-head" rowSpan={2}>
                      SN
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Date
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Vehicle
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Category
                    </th>
                    <th className="table-head" rowSpan={2}>
                      KAM
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Sales Person
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Agent
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Center
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Lead By
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Admission By
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Admission Id
                    </th>
                    <th className="table-head" colSpan={3}>
                      Admission Amt.
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Points Earned
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Receiveble
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Remarks
                    </th>
                    <th className="table-head" rowSpan={2}>
                      Status
                    </th>
                  </tr>
                  <tr style={{ background: "gray" }}>
                    <th className="table-head">Our Share</th>
                    <th className="table-head">Govt. Share</th>
                    <th className="table-head">Total</th>
                  </tr>
                </thead>
                <tbody>{report ? generateList() : null}</tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </PageWrapper>
  );
};

export default EntryReport;
