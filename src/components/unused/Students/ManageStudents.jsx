import React, { useState, useEffect, useRef } from "react";
import PageWrapper from "../../../hoc/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Colors from "../../../assets/theme/Colors";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  Checkbox,
  DateInput,
  NumInput,
  Select,
  TextInput,
  TimeInput,
} from "../../Shared/Elements";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import {
  updateImageNameService,
  getSchoolsListService,
  getClassesListBySchoolService,
  getStudentsService,
  verifyStudentService,
  updateStudentService,
  deleteStudentService,
  printedStatusService,
  uploadStudentImageService,
  upgradeClassesService,
} from "../../../services/HTTPService";
import { useReactToPrint } from "react-to-print";
import { getCurrentSession, getUserData } from "../../../services/AuthService";
import { Modal } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Resizer from "react-image-file-resizer";

const ManageStudents = (props) => {
  const key = useParams().id;
  var current = new Date();
  current.setDate(current.getDate());
  var date = current.toISOString().substring(0, 10);
  var timestamp = current.toLocaleString();
  const navigate = useNavigate();
  const componentRef = useRef();
  const fileInputRef = useRef(null);
  const defaultPayload = {
    school: "",
    classId: "",
    class: "",
    section: "",
    session: getCurrentSession(),
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
  const [showPrintedModal, togglePrintedModal] = useState(false);
  const [showDeleteModal, toggleDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showImageChangeModal, setImageChangeModal] = useState(false);
  const status = ["all", "notPrinted", "verified", "notVerified"];
  const [tableFont, setTableFont] = useState({
    data: "11px",
    head: "13px",
    title: "13px",
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

  const browseAttachment = (event) => {
    let fileinfo = event.target.files[0];
    let name = event.target.name;
    let imgUri = "";

    if (fileinfo) {
      try {
        Resizer.imageFileResizer(
          fileinfo,
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            console.log(uri);
            // imgUri = uri;
            let data = {
              title: fileinfo,
              item: name,
              value: uri,
            };
            setPayload({ ...payload, image: data });
            setImageChangeModal(true);
          },
          "base64",
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }

    // if (fileinfo && fileinfo.size / 2024 <= 1024) {
    //   fileToDataUri(fileinfo).then((dataUri) => {
    //     let data = {
    //       title: fileinfo,
    //       item: name,
    //       value: dataUri,
    //     };
    //     setPayload({ ...payload, image: data });
    //     setImageChangeModal(true)

    //   });
    // } else {
    //   toast.error("File size should be less than 1MB.");
    // }
  };

  const fileToDataUri = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        // console.log("event.target.result", event.target.result);
        resolve(event.target.result);
      };
      // reader.onloadend = () => {
      //   setPayload({ ...payload, image: reader.result });
      // };
      reader.readAsDataURL(file);
    });

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
      for (let key1 = 0; key1 < data.length; key1++) {
        const el = data[key1];

        // data.map((el, key1) => {
        let r1 = (
          <tr
            className={key1 % 2 === 0 ? "table-row" : "table-row-odd"}
            style={{ color: el.isVerified === false ? "black" : "green" }}
            key={key1}
          >
            <td
              className="table-data text-center"
              style={{ fontSize: tableFont.data, width: "40%" }}
            >
              {el.isPrinted === true ? (
                <h2 className="txt-center" style={{ color: "maroon" }}>
                  PRINTED
                </h2>
              ) : null}
              <img
                src={
                  el.srcPath +
                  el.image +
                  (el.image.includes("jpg") || el.image.includes("png")
                    ? ""
                    : "." + el.extension)
                }
                alt={el.name}
                style={{ height: "90px", width: "70px", cursor: "pointer" }}
                // onClick={()=>{

                //   // setSelectedStudent(el)
                //   // updateData()
                //   fileInputRef.current.click()}
                //   }
              />

              <input
                type="file"
                // value={payload.image?payload.image.title:''}
                className="form-control"
                ref={fileInputRef}
                onChange={(e) => {
                  setSelectedStudent(el);
                  browseAttachment(e);
                }}
                // style={{display:'none'}}
              />
              {getUserData().role === "admin" ? (
                <div className="mt-2">
                  <TextInput
                    style={{ fontSize: "8px" }}
                    value={el.image === "noimage.jpg" ? "" : el.image}
                    onChange={(val) => {
                      let dta = report;
                      dta[key1].image = val;
                      setReport(data);
                    }}
                  />
                  <button
                    className="btn btn-theme"
                    onClick={() => {
                      updateImageNameService({
                        type: "student",
                        name: el.image,
                        ref: el.ref,
                      }).then((res) => {
                        if (res.status === 200) {
                          if (res.data.status === "success") {
                            toast.success(res.data.msg);
                            fetchStudentData(
                              payload.school,
                              payload.class,
                              payload.classId,
                              payload.section
                            );
                          } else {
                            toast.error(res.data.msg);
                          }
                        } else {
                          toast.error("Something went wrong.");
                        }
                      });
                    }}
                  >
                    Update
                  </button>
                </div>
              ) : null}
            </td>
            <td
              className="table-data text-left"
              style={{ fontSize: tableFont.data }}
              onAuxClick={() => {
                alert("Working");
              }}
            >
              <table className="mt-1">
                <tbody>
                  {el.regNo ? (
                    <tr>
                      <th>Reg. No.</th>
                      <td style={{ border: "0px" }}>
                        <span style={{ margin: "0px 5px" }}>:</span>
                        {el.regNo}
                      </td>
                    </tr>
                  ) : null}
                  {el.name ? (
                    <tr>
                      <th>Name</th>
                      <td style={{ border: "0px" }}>
                        <span style={{ margin: "0px 5px" }}>:</span>
                        {el.name}
                      </td>
                    </tr>
                  ) : null}
                  {el.father ? (
                    <tr>
                      <th>Father</th>
                      <td style={{ border: "0px" }}>
                        <span style={{ margin: "0px 5px" }}>:</span>
                        {el.father}
                      </td>
                    </tr>
                  ) : null}
                  {el.mother ? (
                    <tr>
                      <th>Mother</th>
                      <td style={{ border: "0px" }}>
                        <span style={{ margin: "0px 5px" }}>:</span>
                        {el.mother}
                      </td>
                    </tr>
                  ) : null}
                  {el.mobile ? (
                    <tr>
                      <th>Mobile</th>
                      <td style={{ border: "0px" }}>
                        <span style={{ margin: "0px 5px" }}>:</span>
                        {el.mobile}
                      </td>
                    </tr>
                  ) : null}
                  {el.class ? (
                    <tr>
                      <th>Class</th>
                      <td style={{ border: "0px" }}>
                        <span style={{ margin: "0px 5px" }}>:</span>
                        {el.class}
                      </td>
                    </tr>
                  ) : null}
                  {el.dob ? (
                    <tr>
                      <th>DOB</th>
                      <td style={{ border: "0px" }}>
                        <span style={{ margin: "0px 5px" }}>:</span>
                        {el.dobFormatted}
                      </td>
                    </tr>
                  ) : null}
                  {el.bloodGroup ? (
                    <tr>
                      <th>B. Group</th>
                      <td style={{ border: "0px" }}>
                        <span style={{ margin: "0px 5px" }}>:</span>
                        {el.bloodGroup}
                      </td>
                    </tr>
                  ) : null}
                  {el.address ? (
                    <tr>
                      <th>Address</th>
                      <td style={{ border: "0px" }}>
                        <span style={{ margin: "0px 5px" }}>:</span>
                        {el.address}
                      </td>
                    </tr>
                  ) : null}
                  {el.transport ? (
                    <tr>
                      <th>Transport</th>
                      <td style={{ border: "0px" }}>
                        <span style={{ margin: "0px 5px" }}>:</span>
                        {el.transport}
                      </td>
                    </tr>
                  ) : null}
                  {el.ref ? (
                    <tr>
                      <th>ERPID</th>
                      <td style={{ border: "0px" }}>
                        <span style={{ margin: "0px 5px" }}>:</span>
                        {el.ref}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
              <div className="col-12 mb-3">
                {(el.isVerified === false &&
                  getUserData().role === "school-admin") ||
                getUserData().role === "admin" ? (
                  <button
                    className="btn btn-blue"
                    // disabled={el.attendance}
                    style={{ height: "25px", marginRight: "10px" }}
                    onClick={() => {
                      el.classId = payload.classId;
                      // el.entryBy = "";
                      setSelectedStudent(el);
                      toggleEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                ) : null}
                {el.isVerified === true &&
                el.isPrinted === true &&
                getUserData().role === "admin" ? (
                  <button
                    className="btn btn-red"
                    // disabled={el.attendance}
                    style={{ height: "30px", marginRight: "10px" }}
                    onClick={() => {
                      el.classId = payload.classId;
                      // el.entryBy = "";
                      setSelectedStudent(el);
                      togglePrintedModal(true);
                    }}
                  >
                    {el.isPrinted === true ? "Not Printed" : "Printed"}
                  </button>
                ) : null}
                <button
                  className={
                    el.isVerified === false ? "btn btn-theme" : "btn btn-green"
                  }
                  // disabled={el.attendance}
                  onClick={() => {
                    setSelectedStudent(el);
                    toggleVerifyModal(true);
                  }}
                  disabled={el.isVerified}
                >
                  {el.isVerified === false ? "Verify" : "Verified"}
                </button>
              </div>
            </td>
            {/* <td
                className="table-data text-center"
                // rowSpan={data.filter((fl) => fl.area === el.area).length}
                style={{ fontSize: tableFont.data }}
              >
                <button
                  className={
                    el.isVerified === false ? "btn btn-theme" : "btn btn-green"
                  }
                  // disabled={el.attendance}
                  onClick={() => {
                    setSelectedStudent(el)
                    toggleVerifyModal(true)
                  }}
                  disabled={el.isVerified}
                >
                  {el.isVerified === false ? "Verify" : "Verified"}
                </button>
                <br />
                {(el.isVerified === false && getUserData().role === 'school-admin') || (getUserData().role === 'admin') ? (
  
                  <button
                    className="btn btn-blue mt-2"
                    // disabled={el.attendance}
                    onClick={() => {
                      el.classId = payload.classId;
                      // el.entryBy = "";
                      setSelectedStudent(el)
                      toggleEditModal(true)
                    }}
                  >
                    Edit
                  </button>
                ) : null}
              </td> */}
          </tr>
        );
        tData.push(r1);
        // });
      }
    }

    return tData;
  };

  const printReport = useReactToPrint({
    content: () => componentRef.current,
  });

  const modalChangeImage = () => {
    return (
      <>
        <Modal
          show={showImageChangeModal}
          onHide={() => setImageChangeModal(false)}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {selectedStudent ? selectedStudent.name : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-md-12 mb-2">
                    <img
                      src={
                        payload.image
                          ? payload.image.value
                          : "https://via.placeholder.com/150"
                      }
                      alt="Upload"
                      className="w-40 h-40 cursor-pointer rounded-lg border"
                      onClick={() => {
                        setImageChangeModal(false);
                        fileInputRef.current.click();
                      }}
                    />
                  </div>
                </div>
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
                    let payL = payload;
                    payL.sid = selectedStudent.ref;
                    uploadStudentImageService(payL).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          fetchStudentData(
                            payload.school,
                            payload.class,
                            payload.classId,
                            payload.section
                          );
                          setPayload({ ...payload, image: null });

                          setImageChangeModal(false);
                        } else {
                          toast.error(res.data.msg);
                        }
                      } else {
                        toast.error("Something went wrong.");
                      }
                    });
                  }}
                >
                  Update
                </button>
                <button
                  className="btn btn-theme"
                  onClick={() => setImageChangeModal(false)}
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

  const fetchStudentData = (sch, cls, classId, section) => {
    if (sch !== "" && cls !== "") {
      getStudentsService({
        school: sch,
        class: cls,
        section: section,
        session: getCurrentSession(),
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

  const modalVerify = () => {
    return (
      <>
        <Modal
          show={showVerifyModal}
          onHide={() => toggleVerifyModal(false)}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {"Verify Data"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <h5>
                  Are you sure, all the details about{" "}
                  <span style={{ color: "darkred" }}>
                    {selectedStudent
                      ? selectedStudent.name
                      : "selected student"}
                  </span>{" "}
                  are correct?
                </h5>
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
                    verifyStudentService({
                      studentId: selectedStudent.ref,
                      session: getCurrentSession(),
                    }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          let dta = report;
                          let idx = dta.findIndex(
                            (x) => x.studentId === selectedStudent.studentId
                          );
                          dta[idx].isVerified = !selectedStudent.isVerified;
                          setReport(dta);
                          toggleVerifyModal(false);
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
                  onClick={() => toggleVerifyModal(false)}
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

  const modalPrinted = () => {
    return (
      <>
        <Modal
          show={showPrintedModal}
          onHide={() => togglePrintedModal(false)}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Not Printed
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <h5>
                  Are you sure, you want to set ID Card of{" "}
                  <span style={{ color: "darkred" }}>
                    {selectedStudent
                      ? selectedStudent.name
                      : "selected student"}
                  </span>{" "}
                  as Not Printed?
                </h5>
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
                    printedStatusService({
                      studentId: selectedStudent.ref,
                      type: "student",
                      session: getCurrentSession(),
                      status: false,
                    }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          let dta = report;
                          let idx = dta.findIndex(
                            (x) => x.studentId === selectedStudent.studentId
                          );
                          dta[idx].isPrinted = false;
                          setReport(dta);
                          togglePrintedModal(false);
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
                  onClick={() => togglePrintedModal(false)}
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

  const modalDelete = () => {
    return (
      <>
        <Modal
          show={showDeleteModal}
          onHide={() => toggleDeleteModal(false)}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {"Delete "}
              {selectedStudent ? selectedStudent.name : " Student"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <h5>
                  Are you sure, you want to delete{" "}
                  <span style={{ color: "darkred" }}>
                    {selectedStudent
                      ? selectedStudent.name
                      : "selected student"}
                  </span>
                  ?
                </h5>
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
                    deleteStudentService({
                      mid: selectedStudent.id,
                      studentId: selectedStudent.ref,
                    }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          toggleDeleteModal(false);
                          fetchStudentData(
                            payload.school,
                            payload.class,
                            payload.classId,
                            payload.section
                          );
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
                  onClick={() => toggleDeleteModal(false)}
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

  const modalEdit = () => {
    return (
      <>
        <Modal
          show={showEditModal}
          onHide={() => toggleEditModal(false)}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {selectedStudent ? selectedStudent.name : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                {selectedStudent ? (
                  <div className="row">
                    <div className="col-12 text-right">
                      <span
                        style={{ color: "darkred", cursor: "pointer" }}
                        onClick={() => {
                          toggleEditModal(false);
                          toggleDeleteModal(true);
                        }}
                      >
                        <FaTrash style={{ color: "darkred" }} /> Delete Student
                      </span>
                    </div>
                    {getUserData().role === "school-admin" ? null : (
                      <div className="col-12 col-md-3 mb-3">
                        <Select
                          label={"School"}
                          data={schools}
                          value={selectedStudent.schoolId}
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
                            setSelectedStudent({
                              ...selectedStudent,
                              school: val,
                            });
                          }}
                          autoFocus={true}
                        />
                      </div>
                    )}

                    <div className="col-12 col-md-3 mb-3">
                      <Select
                        label={"Class"}
                        data={classes}
                        value={selectedStudent.classId}
                        onChange={(val) => {
                          let idx = classes.findIndex(
                            (x) => Number(x.value) === Number(val)
                          );
                          let _class = classes[idx].class;
                          let _section = classes[idx].section;
                          setSelectedStudent({
                            ...selectedStudent,
                            classId: val,
                            class: _class,
                            section: _section,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <TextInput
                        label={"Entry By"}
                        value={selectedStudent.entryBy}
                        onChange={(val) => {
                          setSelectedStudent({
                            ...selectedStudent,
                            entryBy: val,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <TextInput
                        label={"Name of Student"}
                        value={selectedStudent.name}
                        onChange={(val) => {
                          setSelectedStudent({ ...selectedStudent, name: val });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <TextInput
                        label={"Father's Name"}
                        value={selectedStudent.father}
                        onChange={(val) => {
                          setSelectedStudent({
                            ...selectedStudent,
                            father: val,
                          });
                        }}
                      />
                    </div>
                    {getUserData().username === "CWS18" ? null : (
                      <div className="col-12 col-md-3 mb-3">
                        <TextInput
                          label={"Mother's Name"}
                          value={selectedStudent.mother}
                          onChange={(val) => {
                            setSelectedStudent({
                              ...selectedStudent,
                              mother: val,
                            });
                          }}
                        />
                      </div>
                    )}
                    <div className="col-12 col-md-3 mb-3">
                      <DateInput
                        label={"Date of Birth"}
                        value={selectedStudent.dob}
                        onChange={(val) => {
                          setSelectedStudent({ ...selectedStudent, dob: val });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <Select
                        label={"Gender"}
                        data={[
                          { name: "Male", value: "male" },
                          { name: "female", value: "female" },
                        ]}
                        value={selectedStudent.gender}
                        onChange={(val) => {
                          setSelectedStudent({
                            ...selectedStudent,
                            gender: val,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <NumInput
                        label={"Mobile"}
                        value={selectedStudent.mobile}
                        onChange={(val) => {
                          if (val.length <= 10) {
                            setSelectedStudent({
                              ...selectedStudent,
                              mobile: val,
                            });
                          }
                        }}
                      />
                    </div>
                    {getUserData().username === "CWS18" ? null : (
                      <div className="col-12 col-md-3 mb-3">
                        <Select
                          label={"Blood Group"}
                          data={[
                            { name: "A+", value: "A+" },
                            { name: "B+", value: "B+" },
                            { name: "AB+", value: "AB+" },
                            { name: "O+", value: "O+" },
                            { name: "A-", value: "A-" },
                            { name: "B-", value: "B-" },
                            { name: "AB-", value: "AB-" },
                            { name: "O-", value: "O-" },
                          ]}
                          value={selectedStudent.bloodGroup}
                          onChange={(val) => {
                            setSelectedStudent({
                              ...selectedStudent,
                              bloodGroup: val,
                            });
                          }}
                        />
                      </div>
                    )}
                    {getUserData().username === "CWS18" ? null : (
                      <div className="col-12 col-md-3 mb-3">
                        <NumInput
                          label={"Aadhar No."}
                          value={selectedStudent.aadhar}
                          onChange={(val) => {
                            setSelectedStudent({
                              ...selectedStudent,
                              aadhar: val,
                            });
                          }}
                        />
                      </div>
                    )}
                    {getUserData().username === "CWS18" ? null : (
                      <div className="col-12 col-md-3 mb-3">
                        <TextInput
                          label={"PEN No."}
                          value={selectedStudent.pen}
                          onChange={(val) => {
                            setSelectedStudent({
                              ...selectedStudent,
                              pen: val,
                            });
                          }}
                        />
                      </div>
                    )}
                    <div className="col-12 col-md-3 mb-3">
                      <TextInput
                        label={"Address"}
                        value={selectedStudent.address}
                        onChange={(val) => {
                          setSelectedStudent({
                            ...selectedStudent,
                            address: val,
                          });
                        }}
                      />
                    </div>
                    {/* {getUserData().username === 'CWS18' ? null : (
                      <div className="col-12 col-md-3 mb-3">
                        <NumInput
                          label={"Postal PIN"}
                          value={selectedStudent.pin}
                          onChange={(val) => {
                            setSelectedStudent({ ...selectedStudent, pin: val });
                          }}
                        />
                        </div>
                    )} */}

                    <div className="col-12 col-md-3 mb-3">
                      <TextInput
                        label={"Transport"}
                        value={selectedStudent.transport}
                        onChange={(val) => {
                          setSelectedStudent({
                            ...selectedStudent,
                            transport: val,
                          });
                        }}
                      />
                    </div>
                    {/* <div className="col-12 col-md-3 mb-3">
                      <TextInput
                        label={"Image"}
                        value={selectedStudent.image}
                        onChange={(val) => {
                          setSelectedStudent({ ...selectedStudent, image: val });
                        }}
                      />
                    </div> */}
                  </div>
                ) : null}
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
                    let payL = selectedStudent;
                    payL.session = getCurrentSession();
                    if (payL.entryBy === "") {
                      toast.error("Please enter your name in Entry By Field.");
                    } else {
                      updateStudentService(payL).then((res) => {
                        if (res.status === 200) {
                          if (res.data.status === "success") {
                            fetchStudentData(
                              payload.school,
                              payload.class,
                              payload.classId,
                              payload.section
                            );
                            toggleEditModal(false);
                            toast.success(res.data.msg);
                          } else {
                            toast.error(res.data.msg);
                          }
                        } else {
                          toast.error("Something went wrong.");
                        }
                      });
                    }
                  }}
                >
                  Update
                </button>
                <button
                  className="btn btn-theme"
                  onClick={() => toggleEditModal(false)}
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
    <PageWrapper title="Students">
      {modalEdit()}
      {modalVerify()}
      {modalDelete()}
      {modalPrinted()}
      {modalChangeImage()}
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
                    fetchStudentData(
                      val,
                      payload.class,
                      payload.classId,
                      payload.section
                    );
                    setPayload({ ...payload, school: val });
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
            <div className="col-12 col-md-2">
              <Select
                label={"Filter"}
                data={status}
                value={payload.filter}
                onChange={(val) => {
                  setPayload({ ...payload, filter: val });
                }}
              />
            </div>
            <div className="col-12 col-md-6 text-right">
              {getUserData().role === "school-admin" ? null : (
                <button
                  className="btn btn-theme"
                  style={{ marginTop: "28px", marginRight: "10px" }}
                  onClick={() => {
                    upgradeClassesService({
                      school: payload.school,
                      session: getCurrentSession(),
                    }).then((res) => {
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
                  {"Updrade"}
                </button>
              )}
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
        {payload.school !== "" && payload.class !== "" ? (
          <div className="row mt-5">
            <div className="col-md-4"></div>
            <div className="col-12 col-md-4">
              <TextInput
                value={searchString}
                placeholder="Search"
                onChange={(val) => {
                  setSearchString(val);
                  // updateData()
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
                      style={{
                        fontSize: tableFont.head,
                      }}
                    >
                      Image
                    </th>
                    <th
                      className="table-data"
                      style={{
                        fontSize: tableFont.head,
                      }}
                    >
                      Student
                    </th>
                    {/* <th
                      className="table-data"
                      style={{
                        fontSize: tableFont.head,
                      }}
                    ></th> */}
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

export default ManageStudents;
