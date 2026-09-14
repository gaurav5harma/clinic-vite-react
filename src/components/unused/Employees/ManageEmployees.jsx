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
  getSchoolsListService,
  getClassesListBySchoolService,
  getDesignationsListBySchoolService,
  getEmployeesService,
  verifyEmployeeService,
  updateEmployeeService,
  deleteEmployeeService,
  updateImageNameService,
  printedStatusService,
} from "../../../services/HTTPService";
import { useReactToPrint } from "react-to-print";
import { getUserData } from "../../../services/AuthService";
import { Modal } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Resizer from "react-image-file-resizer";

const ManageEmployees = (props) => {
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
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [schools, setSchools] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrintedModal, togglePrintedModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showImageChangeModal, setImageChangeModal] = useState(false);

  const [searchString, setSearchString] = useState("");
  const [updateVal, setUpdateVal] = useState(0);
  const [report, setReport] = useState([]);
  const [showEditModal, toggleEditModal] = useState(false);
  const [showVerifyModal, toggleVerifyModal] = useState(false);
  const [showDeleteModal, toggleDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
    data: "14px",
    head: "16px",
    title: "18px",
  });
  const getSchools = () => {
    getSchoolsListService().then((response) => {
      if (response.status === 200) {
        setSchools(response.data);

        if (getUserData().role === "school-admin") {
          // console.log(getUserData().username)
          getDesignationsListBySchoolService({
            school: getUserData().username,
          }).then((res) => {
            if (res.status === 200) {
              setDesignations(res.data.data);
            } else {
              toast.error("Something went wrong.");
            }
          });
          fetchEmployeesData(getUserData().username, payload.designation);
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
                      type: "employee",
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
                  setSelectedEmployee(el)
                  toggleVerifyModal(true)
                }}
                disabled={el.isVerified}
              >
                {el.isVerified === false ? "Verify" : "Verified"}
              </button>
              <br/>
              {(el.isVerified === false && getUserData().role === 'school-admin') || (getUserData().role === 'admin')?(

              <button
                className="btn btn-blue mt-2"
                // disabled={el.attendance}
                onClick={() => {
                  el.classId = payload.classId;
                  el.entryBy = "";
                  setSelectedEmployee(el)
                  toggleEditModal(true)
                }}
              >
                Edit
              </button>
              ):null}
            </td> */}
            <td
              className="table-data text-center"
              style={{ fontSize: tableFont.data }}
            >
              {el.isPrinted === true ? (
                <h2 className="txt-center" style={{ color: "maroon" }}>
                  PRINTED
                </h2>
              ) : null}
              <img
                src={el.srcPath + el.image}
                alt={el.name}
                style={{
                  height: "90px",
                  width: "70px",
                  border: "1px solid navy",
                }}
              />
              <input
                type="file"
                // value={payload.image?payload.image.title:''}
                className="form-control"
                ref={fileInputRef}
                onChange={(e) => {
                  setSelectedEmployee(el);
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
                        type: "employees",
                        name: el.image,
                        ref: el.ref,
                      }).then((res) => {
                        if (res.status === 200) {
                          if (res.data.status === "success") {
                            toast.success(res.data.msg);
                            fetchEmployeesData(
                              payload.school,
                              payload.designation
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
              <table className="mt-3">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td style={{ border: "0px" }}>
                      <span style={{ margin: "0px 5px" }}>:</span>
                      {el.name}
                    </td>
                  </tr>
                  <tr>
                    <th>S/W/D/o</th>
                    <td style={{ border: "0px" }}>
                      <span style={{ margin: "0px 5px" }}>:</span>
                      {el.father}
                    </td>
                  </tr>
                  <tr>
                    <th>Mobile</th>
                    <td style={{ border: "0px" }}>
                      <span style={{ margin: "0px 5px" }}>:</span>
                      {el.mobile}
                    </td>
                  </tr>
                  <tr>
                    <th>B. Group</th>
                    <td style={{ border: "0px" }}>
                      <span style={{ margin: "0px 5px" }}>:</span>
                      {el.bloodGroup}
                    </td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td style={{ border: "0px" }}>
                      <span style={{ margin: "0px 5px" }}>:</span>
                      {el.address}
                    </td>
                  </tr>
                  <tr>
                    <th>ERPID</th>
                    <td style={{ border: "0px" }}>
                      <span style={{ margin: "0px 5px" }}>:</span>
                      {el.ref}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="col-12 mb-3">
                {(el.isVerified === false &&
                  getUserData().role === "school-admin") ||
                getUserData().role === "admin" ? (
                  <button
                    className="btn btn-blue"
                    style={{ marginRight: "10px", height: "30px" }}
                    // disabled={el.attendance}
                    onClick={() => {
                      el.classId = payload.classId;
                      el.entryBy = "";
                      setSelectedEmployee(el);
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
                    setSelectedEmployee(el);
                    toggleVerifyModal(true);
                  }}
                  // disabled={el.isVerified}
                >
                  {el.isVerified === false ? "Verify" : "Verified"}
                </button>
              </div>
            </td>
          </tr>
        );
        tData.push(r1);
      });
    }

    return tData;
  };

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
                    uploadEmployeeImageService(payL).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          fetchEmployeesData(
                            payload.school,
                            payload.designation
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

  const printReport = useReactToPrint({
    content: () => componentRef.current,
  });

  const fetchEmployeesData = (sch, designation) => {
    if (sch !== "" && designation !== "") {
      getEmployeesService({
        school: sch,
        designation: designation,
        type: "verification",
      }).then((res) => {
        if (res.status === 200) {
          setPayload({
            ...payload,
            school: sch,
            designation: designation,
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
        designation: designation,
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
                    {selectedEmployee
                      ? selectedEmployee.name
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
                    verifyEmployeeService({
                      employeeId: selectedEmployee.ref,
                    }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          let dta = report;
                          let idx = dta.findIndex(
                            (x) => x.employeeId === selectedEmployee.employeeId
                          );
                          dta[idx].isVerified = !selectedEmployee.isVerified;
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
              {selectedEmployee ? selectedEmployee.name : " Student"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <h5>
                  Are you sure, you want to delete{" "}
                  <span style={{ color: "darkred" }}>
                    {selectedEmployee
                      ? selectedEmployee.name
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
                    deleteEmployeeService({
                      employeeId: selectedEmployee.ref,
                    }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          toggleDeleteModal(false);
                          fetchEmployeesData(
                            payload.school,
                            payload.designation
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
              {selectedEmployee ? selectedEmployee.name : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                {selectedEmployee ? (
                  <div className="row">
                    <div className="col-12 text-right">
                      <span
                        style={{ color: "darkred", cursor: "pointer" }}
                        onClick={() => {
                          toggleEditModal(false);
                          toggleDeleteModal(true);
                        }}
                      >
                        <FaTrash style={{ color: "darkred" }} /> Delete Employee
                      </span>
                    </div>
                    {getUserData().role === "school-admin" ? null : (
                      <div className="col-12 col-md-3 mb-3">
                        <Select
                          label={"School"}
                          data={schools}
                          value={selectedEmployee.schoolId}
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
                            setSelectedEmployee({
                              ...selectedEmployee,
                              school: val,
                            });
                          }}
                          autoFocus={true}
                        />
                      </div>
                    )}

                    <div className="col-12 col-md-3 mb-3">
                      <Select
                        label={"Designation"}
                        data={designations}
                        value={selectedEmployee.designation}
                        onChange={(val) => {
                          setSelectedEmployee({
                            ...selectedEmployee,
                            designation: val,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <TextInput
                        label={"Name of Employee"}
                        value={selectedEmployee.name}
                        onChange={(val) => {
                          setSelectedEmployee({
                            ...selectedEmployee,
                            name: val,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <TextInput
                        label={"Father/Husband's Name"}
                        value={selectedEmployee.father}
                        onChange={(val) => {
                          setSelectedEmployee({
                            ...selectedEmployee,
                            father: val,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <DateInput
                        label={"Date of Birth"}
                        value={selectedEmployee.dob}
                        onChange={(val) => {
                          setSelectedEmployee({
                            ...selectedEmployee,
                            dob: val,
                          });
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
                        value={selectedEmployee.gender}
                        onChange={(val) => {
                          setSelectedEmployee({
                            ...selectedEmployee,
                            gender: val,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <NumInput
                        label={"Mobile"}
                        value={selectedEmployee.mobile}
                        onChange={(val) => {
                          if (val.length <= 10) {
                            setSelectedEmployee({
                              ...selectedEmployee,
                              mobile: val,
                            });
                          }
                        }}
                      />
                    </div>
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
                        value={selectedEmployee.bloodGroup}
                        onChange={(val) => {
                          setSelectedEmployee({
                            ...selectedEmployee,
                            bloodGroup: val,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <NumInput
                        label={"Aadhar No."}
                        value={selectedEmployee.aadhar}
                        onChange={(val) => {
                          setSelectedEmployee({
                            ...selectedEmployee,
                            aadhar: val,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <TextInput
                        label={"Address"}
                        value={selectedEmployee.address}
                        onChange={(val) => {
                          setSelectedEmployee({
                            ...selectedEmployee,
                            address: val,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-3">
                      <NumInput
                        label={"Postal PIN"}
                        value={selectedEmployee.pin}
                        onChange={(val) => {
                          setSelectedEmployee({
                            ...selectedEmployee,
                            pin: val,
                          });
                        }}
                      />
                    </div>
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
                    updateEmployeeService(selectedEmployee).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          fetchEmployeesData(
                            payload.school,
                            payload.designation
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
    <PageWrapper title="Employees">
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
                    getDesignationsListBySchoolService({ school: val }).then(
                      (res) => {
                        if (res.status === 200) {
                          setDesignations(res.data.data);
                        } else {
                          toast.error("Something went wrong.");
                        }
                      }
                    );
                    fetchEmployeesData(val, payload.designation);
                    setPayload({ ...payload, school: val });
                  }}
                  autoFocus={true}
                />
              </div>
            )}
            <div className="col-12 col-md-2">
              <Select
                label={"Designation"}
                data={designations}
                value={payload.designationId}
                onChange={(val) => {
                  setPayload({ ...payload, designation: val });
                  fetchEmployeesData(payload.school, val);
                }}
              />
            </div>
            <div className="col-12 col-md-6 text-right">
              <button
                className="btn btn-theme"
                style={{ marginTop: "28px", marginRight: "10px" }}
                onClick={() => {
                  fetchEmployeesData(payload.school, payload.designation);
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
        {payload.school !== "" && payload.designation !== "" ? (
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
                      Employee
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

export default ManageEmployees;
