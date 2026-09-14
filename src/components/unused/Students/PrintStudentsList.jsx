import React, { useState, useEffect, useRef } from "react";
import PageWrapper from "../../hoc/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Colors from "../../assets/theme/Colors";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  Checkbox,
  DateInput,
  NumInput,
  Select,
  TextInput,
  TimeInput,
} from "../Shared/Elements";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import {
  getSchoolsListService,
  getClassesListBySchoolService,
  getStudentsService,
} from "../../services/HTTPService";
import { useReactToPrint } from "react-to-print";
import { getUserData } from "../../services/AuthService";
import { Modal } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const PrintStudentsList = (props) => {
  const key = useParams().id;
  var current = new Date();
  current.setDate(current.getDate());
  var date = current.toISOString().substring(0, 10);
  var timestamp = current.toLocaleString();
  const navigate = useNavigate();
  const componentRef = useRef();
  const defaultPayload = {
    school: "",
    classId: "",
    class: "",
    section: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [updateVal, setUpdateVal] = useState(0);
  const [report, setReport] = useState([]);
  const [showEditModal, toggleEditModal] = useState(false);
  const [showVerifyModal, toggleVerifyModal] = useState(false);
  const [showDeleteModal, toggleDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const [tableFont, setTableFont] = useState({
    data: "11px",
    head: "11px",
    title: "12px",
  });
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
          fetchStudentData(
            getUserData().username,
            payload.class,
            payload.classId,
            payload.section
          );
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

  const updateData = () => {
    let upd = updateVal;
    upd = upd + 1;
    setUpdateVal(upd);
  };

  const generateReport = () => {
    let data =
      report && report.length > 0
        ? report.filter(
            (fl) =>
              fl.name.toLowerCase().includes(searchString.toLowerCase()) ||
              fl.mobile.toLowerCase().includes(searchString.toLowerCase()) ||
              fl.father.toLowerCase().includes(searchString.toLowerCase())
          )
        : [];
    let tData = [];
    if (data.length > 0) {
      data.map((el, key1) => {
        let r1 = (
          <tr
            className={key1 % 2 === 0 ? "table-row" : "table-row-odd"}
            style={{ color: el.isVerified === false ? "black" : "green" }}
            key={key1}
          >
            <td
              className="table-data text-center"
              style={{
                fontSize: tableFont.data,
                width: "200px",
                whiteSpace: "break-spaces",
              }}
            >
              {/* {el.isPrinted===true?(<h2 className="txt-center" style={{color:'maroon'}}>PRINTED</h2>):null} */}
              <div
                style={{
                  height: "70px",
                  width: "55px",
                  border: "1px solid gray",
                  overflow: "hidden",
                  margin: "auto",
                }}
              >
                <img
                  src={el.srcPath + el.image}
                  alt={el.name}
                  style={{ height: "100px", width: "auto", marginTop: "0px" }}
                />
              </div>
              {/* {getUserData().role==='admin'?(

              <div className="mt-2">
                <TextInput
                  style={{fontSize:'8px'}}
                  value={el.image === 'noimage.jpg' ? '' : el.image}
                  onChange={(val)=>{
                    let dta=report;
                    dta[key1].image=val;
                    setReport(data);
                  }}
                  />
                         <button className="btn btn-theme" onClick={()=>{
                  updateImageNameService({ type: 'student', name: el.image, ref: el.ref }).then(res=>{
                             if (res.status === 200) {
                                if (res.data.status === "success") {
                                   toast.success(res.data.msg);
                                  fetchStudentData(payload.school, payload.class, payload.classId, payload.section);

                                } else {
                                   toast.error(res.data.msg);
                                }
                            } else {
                              toast.error("Something went wrong.");
                            }
                          });
                         }}>
                           Update
                         </button>
              </div>
              ):null} */}
            </td>
            <td
              className="table-data text-left"
              style={{
                fontSize: tableFont.data,
                width: "40%",
                whiteSpace: "break-spaces",
              }}
            >
              <table className="mt-1">
                <tbody>
                  <tr>
                    <th>
                      Name
                      <span style={{ margin: "0px 5px", float: "right" }}>
                        :
                      </span>
                    </th>
                    <td style={{ border: "0px" }}>{el.name}</td>
                  </tr>
                  <tr>
                    <th>
                      Father
                      <span style={{ margin: "0px 5px", float: "right" }}>
                        :
                      </span>
                    </th>
                    <td style={{ border: "0px" }}>{el.father}</td>
                  </tr>
                  {/* <tr>
                    <th>Mother</th>
                    <td style={{ border: '0px' }}><span style={{ margin: '0px 5px' }}>:</span>{el.mother}</td>
                  </tr> */}
                  <tr>
                    <th>
                      Mobile
                      <span style={{ margin: "0px 5px", float: "right" }}>
                        :
                      </span>
                    </th>
                    <td style={{ border: "0px" }}>{el.mobile}</td>
                  </tr>
                  <tr>
                    <th>
                      Class
                      <span style={{ margin: "0px 5px", float: "right" }}>
                        :
                      </span>
                    </th>
                    <td style={{ border: "0px" }}>{el.class}</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td
              className="table-data text-left"
              style={{ fontSize: tableFont.data, width: "50%" }}
            >
              <table className="mt-1" width="100%">
                <tbody>
                  <tr>
                    <th width="20%">
                      DOB
                      <span style={{ margin: "0px 5px", float: "right" }}>
                        :
                      </span>
                    </th>
                    <td width="80%" style={{ border: "0px" }}>
                      {el.dobFormatted}
                    </td>
                  </tr>
                  <tr>
                    <th width="20%">
                      B. Group
                      <span style={{ margin: "0px 5px", float: "right" }}>
                        :
                      </span>
                    </th>
                    <td width="80%" style={{ border: "0px" }}>
                      {el.bloodGroup}
                    </td>
                  </tr>
                  <tr>
                    <th width="20%">
                      Address
                      <span style={{ margin: "0px 5px", float: "right" }}>
                        :
                      </span>
                    </th>
                    <td
                      width="80%"
                      style={{ border: "0px", whiteSpace: "normal" }}
                    >
                      {el.address}
                    </td>
                  </tr>
                  <tr>
                    <th width="20%">
                      ERPID
                      <span style={{ margin: "0px 5px", float: "right" }}>
                        :
                      </span>
                    </th>
                    <td width="80%" style={{ border: "0px" }}>
                      {el.ref}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        );
        tData.push(r1);
      });
    }

    return tData;
  };

  const printReport = useReactToPrint({
    content: () => componentRef.current,
  });

  const fetchStudentData = (sch, cls, classId, section) => {
    if (sch !== "") {
      getStudentsService({
        school: sch,
        class: cls,
        section: section,
        type: "verification",
      }).then((res) => {
        if (res.status === 200) {
          setPayload({
            ...payload,
            school: sch,
            class: cls,
            classId: classId,
            section: section,
          });
          setReport(res.data.data);
        } else {
          toast.error("Something went wrong.");
        }
      });
    } else {
      setPayload({
        ...payload,
        school: sch,
        class: cls,
        classId: classId,
        section: section,
      });
    }
  };

  return (
    <PageWrapper title="Print List">
      <div className="row card p-3">
        <div className="col-12">
          <div className="row">
            {getUserData().role === "school-admin" ? null : (
              <div className="col-12 col-md-2">
                <Select
                  label={"School"}
                  data={schools}
                  value={payload.school}
                  onChange={(val) => {
                    getClassesListBySchoolService({ school: val }).then(
                      (res) => {
                        if (res.status === 200) {
                          setClasses(res.data.data);
                        } else {
                          toast.error("Something went wrong.");
                        }
                      }
                    );
                    // fetchStudentData(
                    //   val,
                    //   payload.class,
                    //   payload.classId,
                    //   payload.section
                    // );
                    setReport([]);
                    setPayload({
                      ...payload,
                      school: val,
                      classId: "",
                      class: "",
                      section: "",
                    });
                  }}
                  autoFocus={true}
                />
              </div>
            )}
            <div className="col-12 col-md-2">
              <Select
                label={"Class"}
                data={classes}
                value={payload.classId}
                onChange={(val) => {
                  let idx = classes.findIndex(
                    (x) => Number(x.value) === Number(val)
                  );
                  let _class = classes[idx].class;
                  let _section = classes[idx].section;
                  setPayload({
                    ...payload,
                    classId: val,
                    class: _class,
                    section: _section,
                  });
                  fetchStudentData(payload.school, _class, val, _section);
                }}
              />
            </div>
            <div className="col-12 col-md-6 text-right">
              <button
                className="btn btn-theme"
                onClick={printReport}
                style={{ marginTop: "28px", marginRight: "10px" }}
              >
                Print
              </button>
              <button
                className="btn btn-theme"
                style={{ marginTop: "28px", marginRight: "10px" }}
                onClick={() => {
                  fetchStudentData(
                    payload.school,
                    payload.class,
                    payload.classId,
                    payload.section
                  );
                }}
              >
                {"Refresh"}
              </button>
              <button
                className="btn btn-theme"
                style={{ marginTop: "28px", marginRight: "10px" }}
                onClick={() => {
                  let data = tableFont.head;
                  data = Number(data.replace("px", ""));
                  data -= 1;
                  let dta = data - 2;
                  setTableFont({
                    head: data + "px",
                    data: dta + "px",
                    title: Number(dta + 2) + "px",
                  });
                }}
              >
                {"A-"}
              </button>
              <button
                className="btn btn-theme"
                style={{ marginTop: "28px" }}
                onClick={() => {
                  let data = tableFont.head;
                  data = Number(data.replace("px", ""));
                  data += 1;
                  let dta = data - 2;
                  setTableFont({
                    head: data + "px",
                    data: dta + "px",
                    title: Number(dta + 2) + "px",
                  });
                }}
              >
                {"A+"}
              </button>
            </div>
          </div>
        </div>
        {payload.school !== "" ? (
          <div className="row mt-5">
            <div className="col-md-4"></div>
            <div className="col-12 col-md-4">
              <TextInput
                value={searchString}
                placeholder="Search"
                onChange={(val) => {
                  setSearchString(val);
                }}
              />
            </div>
            <div className="col-md-4"></div>
            <div
              className="col-12"
              style={{ overflowX: "auto", padding: "15px" }}
              ref={componentRef}
            >
              <table
                style={{
                  width: "100%",
                }}
              >
                <thead>
                  <tr
                    className="table-row"
                    style={{ background: "navy", color: "white" }}
                  >
                    <th
                      className="table-data"
                      colSpan={3}
                      style={{
                        fontSize: tableFont.head,
                      }}
                    >
                      <h3 className="text-center m-0">
                        {report.length > 0 ? report[0].schoolName : ""}
                      </h3>
                      <h5 className="text-center m-0">
                        {report.length > 0
                          ? "School Code : " + payload.school
                          : ""}
                      </h5>
                      <h5 className="text-center m-0">
                        {payload && payload.class !== ""
                          ? "Class : " + payload.class + " - " + payload.section
                          : "All"}
                      </h5>
                    </th>
                  </tr>
                </thead>
                <tbody>{generateReport()}</tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </PageWrapper>
  );
};

export default PrintStudentsList;
