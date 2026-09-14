import React, { useEffect, useState } from "react";
import PageWrapper from "../../hoc/PageWrapper";
// import { addPaperStockDataService } from "../../services/HTTPService";
// import { useNavigate } from "react-router-dom";
import Colors from "../../assets/theme/Colors";
import { toast } from "react-toastify";
// import "./styles.css";
import sty from "./ImportData.module.css";
import { getCurrentSession, getUserData } from "../../services/AuthService";
import { Select, TextInput } from "../Shared/Elements";
import {
  checkStudentsDataService,
  getSchoolsListService,
} from "../../services/HTTPService";
import { Modal } from "react-bootstrap";

//
const ImportData = () => {
  // const navigate = useNavigate();
  const defaultPayload = {
    school: "",
    session: getCurrentSession(),
    entryBy: "",
    skipRow: "no",
    data: [],
  };
  const [pastedData, setPastedData] = useState([]);
  const [processingData, setProcessingData] = useState([]);
  const [schools, setSchools] = useState([]);
  const [payload, setPayload] = useState(defaultPayload);
  const [dataManagementModal, toggleDataManagementModal] = useState(false);
  const [schema, setSchema] = useState([]);
  const [headerFields, setHeaderFields] = useState([
    { name: "Registration No.", value: "regNo" },
    { name: "Student Name", value: "name" },
    { name: "Father's Name", value: "father" },
    { name: "Mother's Name", value: "mother" },
    { name: "Class", value: "class" },
    { name: "Section", value: "section" },
    { name: "Mobile", value: "mobile" },
    { name: "DOB", value: "dob" },
    { name: "Address", value: "address" },
    { name: "Gender", value: "gender" },
    { name: "Transport", value: "transport" },
    { name: "Image", value: "image" },
    { name: "Blood Group", value: "bloodGroup" },
    { name: "Aadhar", value: "aadhar" },
    { name: "PEN Number", value: "pen" },
    { name: "Alt. Mobile", value: "mobileAlt" },
    { name: "Misc Col 1", value: "misc1" },
    { name: "Misc Col 2", value: "misc2" },
    { name: "Misc Col 3", value: "misc3" },
    { name: "Misc Col 4", value: "misc4" },
    { name: "Misc Col 5", value: "misc5" },
  ]);
  const [updateVal, setUpdateVal] = useState(0);

  const getSchools = () => {
    getSchoolsListService().then((response) => {
      if (response.status === 200) {
        setSchools(response.data);
        if (getUserData().role === "school-admin") {
          // console.log(getUserData().username)
          getClassesListBySchoolService({
            school: getUserData().username,
          }).then((res) => {
            if (res.status === 200) {
              setClasses(res.data.data);
            } else {
              toast.error("Something went wrong.");
            }
          });
          setPayload({ ...payload, school: getUserData().username });
        }
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
    getSchools();
  }, []);

  const handlePaste = (e) => {
    if (e.target.tagName && e.target.tagName.match(/(input|textarea)/i)) {
      // Do not handle past when an input element is currently focused
      return;
    }
    // Get clipboard data as text
    const data = e.clipboardData.getData("text");
    // Simplified parsing of the TSV data with hard-coded columns
    const rows = data.split("\n");
    const result = rows.map((row) => {
      const cells = row.split("\t");
      return cells;
    });
    setProcessingData(result);
    let arr = [];
    for (let index = 0; index < result[0].length; index++) {
      arr.push({ value: "" });
    }
    setSchema(arr);
    toggleDataManagementModal(true);
  };
  const submitData = () => {
    let payL = payload;
    payL.data = pastedData;
    if (payL.skipRow === "yes") {
      payL.data.splice(0, 1);
    }
    checkStudentsDataService(payL)
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(
            "Added: " +
              response.data.added +
              " Failed: " +
              response.data.failed +
              " Updated: " +
              response.data.updated
          );
        } else if (response.data.status === "error") {
          toast.error("Error ? " + response.data.msg);
        } else if (response.data.status === "logout") {
          //   navigate("/login");
        } else {
          toast.error("Error in Registering, Something went wrong. ");
        }
      })
      .catch((err) => {
        // navigate("/dashboard");
        console.log("err", err);
        toast.error("Catch Error, Something went wrong");
      });
  };

  const dmModal = () => {
    return (
      <>
        <Modal
          show={dataManagementModal}
          onHide={() => toggleDataManagementModal(false)}
          size="xs"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {"Data Mapping"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                {processingData.length > 0 ? generateView() : null}
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
                    let dta = processingData.map((el, key) => {
                      let cells = [];
                      el.map((x, k) => {
                        if (schema[k].value !== "") {
                          let obj = schema[k].value;
                          cells.push({ [obj]: x.replace("\r", "") });
                        }
                      });
                      return Object.assign({}, ...cells);
                    });
                    setPastedData(dta);
                    toggleDataManagementModal(false);
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const generateView = () => {
    let data = processingData[0];
    let tblData = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      let row = (
        <div className="row" key={index}>
          <div
            className="col-6"
            style={{ background: "#eaeaea", border: "1px solid #dedede" }}
          >
            <h5 className="m-2">{element}</h5>
          </div>
          <div
            className="col-6"
            style={{ background: "#fafafa", border: "1px solid #eaeaea" }}
          >
            <Select
              data={headerFields}
              value={
                schema.length > 0 && schema[index] ? schema[index].value : ""
              }
              onChange={(val) => {
                let arr = schema;
                let idx = arr.findIndex((ob) => ob.value === val);
                if (idx === -1 || val == "") {
                  arr[index] = { value: val };
                  setSchema(arr);
                  update();
                } else {
                  toast.warning("Field already selected for another column");
                }
              }}
            />
          </div>
        </div>
      );
      tblData.push(row);
    }
    return tblData;
  };

  const update = () => {
    let upd = updateVal;
    upd = upd + 1;
    setUpdateVal(upd);
  };

  const generateTableData = () => {
    let data = pastedData;
    let tblData = [];
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      let row1 = (
        <tr
          className={index % 2 === 0 ? "paper-req-table-row-odd" : ""}
          key={index}
        >
          {generateItems(item)}
        </tr>
      );
      tblData.push(row1);
    }
    return tblData;
  };

  const generateItems = (item) => {
    let data = schema;
    let tblData = [];
    for (let index = 0; index < data.length; index++) {
      const itm = data[index];
      let row1 = (
        <td
          key={index}
          className="paper-req-table-data"
          style={{ textAlign: "left" }}
        >
          {item[itm.value]}
        </td>
      );
      tblData.push(row1);
    }
    return tblData;
  };

  const generateHeaders = () => {
    let data = schema;
    let tblData = [];
    for (let index = 0; index < data.length; index++) {
      const itm = data[index];
      let row1 = (
        <th className="paper-req-table-head" key={index}>
          {headerFields.findIndex((ob) => ob.value === itm.value) > -1
            ? headerFields[
                headerFields.findIndex((ob) => ob.value === itm.value)
              ].name
            : ""}
          {/* {itm.value}{headerFields.findIndex(ob=>ob.value===itm.value)} */}
        </th>
      );
      tblData.push(row1);
    }
    return tblData;
  };
  //
  return (
    <PageWrapper title={"Import Data"}>
      {dmModal()}
      <div className="col-md-12 card p-3">
        <div className="row">
          <div className="col-md-12">
            <div className="row mt-3 mb-3">
              <div className="col-12 col-md-2 mb-3">
                <TextInput
                  label={"Session"}
                  placeholder="20XX-20XX"
                  value={payload.session}
                  onChange={(val) => {
                    if (val.length <= 9) {
                      setPayload({ ...payload, session: val });
                    }
                  }}
                />
              </div>
              {getUserData().role === "school-admin" ? null : (
                <div className="col-12 col-md-2 mb-3">
                  <Select
                    label={"School"}
                    data={schools}
                    value={payload.school}
                    onChange={(val) => {
                      setPayload({ ...payload, school: val });
                    }}
                    autoFocus={true}
                  />
                </div>
              )}
              <div className="col-12 col-md-2 mb-3">
                <TextInput
                  label={"Entry By"}
                  value={payload.entryBy}
                  onChange={(val) => {
                    setPayload({ ...payload, entryBy: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-2 mb-3">
                <Select
                  data={[
                    { name: "Yes", value: "yes" },
                    { name: "No", value: "no" },
                  ]}
                  label={"Skip First Row"}
                  value={payload.skipRow}
                  onChange={(val) => {
                    setPayload({ ...payload, skipRow: val });
                    update();
                  }}
                />
              </div>
              <div className="col-md-12" style={{ textAlign: "center" }}>
                {/* {payload.data.length>0?( */}
                <button
                  className="btn btn-theme"
                  onClick={submitData}
                  disabled={
                    pastedData.length > 0 &&
                    payload.school !== "" &&
                    payload.session !== "" &&
                    payload.entryBy !== ""
                      ? false
                      : true
                  }
                >
                  {"Submit Data"}
                </button>
                {/* ):null} */}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div
            style={{ paddingBottom: "10px", overflowX: "auto" }}
            onPaste={handlePaste}
          >
            {pastedData.length > 0 && (
              <table>
                <thead>
                  <tr className="paper-req-table-row">{generateHeaders()}</tr>
                </thead>
                <tbody>{generateTableData()}</tbody>
              </table>
            )}
          </div>
        </div>
        {pastedData.length > 0 && (
          <div className="row">
            <div className="col-md-12">
              <div className="row mt-3 mb-3">
                <div className="col-md-12" style={{ textAlign: "center" }}>
                  <button
                    className="btn btn-theme"
                    // style={{ backgroundColor: Colors.defaultThemeColor }}
                    onClick={submitData}
                  >
                    {"Submit Data"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ImportData;
