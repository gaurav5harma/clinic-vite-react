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
  getUpdationsService,
  performActionService,
} from "../../services/HTTPService";
import { getCurrentSession, getUserData } from "../../services/AuthService";
import { useReactToPrint } from "react-to-print";
import { Modal } from "react-bootstrap";
import ExcelExportService from "../../services/ExcelExportService";

const Updations = (props) => {
  const key = useParams().ref;
  const navigate = useNavigate();
  const componentRef = useRef();
  var current = new Date();
  current.setDate(current.getDate());
  var date = current.toISOString().substring(0, 10);

  const defaultPayload = {
    from: date,
    to: date,
  };
  const [payload, setPayload] = useState(defaultPayload);
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

  const updateData = () => {
    let upd = updateVal;
    upd = upd + 1;
    setUpdateVal(upd);
  };

  const generateList = () => {
    let items = report;
    let tblData = [];
    for (let i = 0; i < items.length; i++) {
      const ele = items[i];
      let row = (
        <tr key={i} style={{ background: i % 2 === 0 ? "#fafafa" : "" }}>
          <td className="text-center">{i + 1}</td>
          <td className="text-left">{ele.source.toUpperCase()}</td>
          <td className="text-left">{ele.refVal}</td>
          <td className="text-left">{ele.updatedAt}</td>
          <td className="text-left">{ele.field.toUpperCase()}</td>
          <td className="text-center">{ele.oldVal}</td>
          <td className="text-center">{ele.newVal}</td>
          <td className="text-center">{ele.updatedBy}</td>
          <td className="text-left">
            <small>{ele.remarks}</small>
          </td>
        </tr>
      );
      tblData.push(row);
    }
    return tblData;
  };

  const printReport = useReactToPrint({
    content: () => componentRef.current,
  });

  const actionModal = () => {
    return (
      <>
        <Modal
          show={showActionModal}
          onHide={() => toggleActionModal(false)}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Perform Action
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <h4>
                  Set as{" "}
                  <span style={{ color: "darkred" }}>{payload.action}</span>
                </h4>
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
                    performActionService({
                      school: payload.school,
                      fromStatus: payload.type,
                      slot: payload.slot,
                      reportType: payload.reportType,
                      action: payload.action,
                      session: payload.session,
                    }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          setReport([]);
                          toggleActionModal(false);
                        } else {
                          toast.error(res.data.msg);
                        }
                      } else {
                        toast.error("Something went wrong.");
                      }
                    });
                  }}
                >
                  Yes
                </button>
                <button
                  className="btn btn-theme"
                  onClick={() => toggleActionModal(false)}
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
    <PageWrapper title={key ? key : "Entry Updations"}>
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
                    setReport([]);
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
                    setReport([]);
                  }}
                  autoFocus={true}
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
                      getUpdationsService(payload).then((res) => {
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
                  className="btn btn-theme ms-3"
                  disabled={report.length === 0 ? true : false}
                  onClick={printReport}
                >
                  Print
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
                    <th style={{ border: "1px solid #eaeaea" }} colSpan={9}>
                      <h1 className="text-center m-0">UPDATIONS</h1>
                      <h3 className="text-center m-0">
                        {payload.from === payload.to
                          ? payload.from
                          : payload.from + " to " + payload.to}
                      </h3>
                    </th>
                  </tr>
                  <tr style={{ background: "gray" }}>
                    <th className="table-head">SN</th>
                    <th className="table-head">Source</th>
                    <th className="table-head">Source Ref.</th>
                    <th className="table-head">ID / Veh. No</th>
                    <th className="table-head">Field</th>
                    <th className="table-head">From</th>
                    <th className="table-head">To</th>
                    <th className="table-head">By</th>
                    <th className="table-head">Remarks</th>
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

export default Updations;
