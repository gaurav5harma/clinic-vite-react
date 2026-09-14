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
  addNewEmployeeService,
  getDesignationsListBySchoolService,
  getSchoolsListService,
} from "../../services/HTTPService";
import { getCurrentSession, getUserData } from "../../services/AuthService";
const AddEmployee = (props) => {
  const key = useParams().ref;
  const componentRef = useRef();
  const navigate = useNavigate();
  const defaultPayload = {
    school: "",
    session: getCurrentSession(),
    class: "",
    classId: "",
    section: "",
    name: "",
    father: "",
    mother: "",
    dob: "",
    gender: "",
    mobile: "",
    bloodGroup: "",
    aadhar: "",
    address: "",
    pin: "",
    entryBy: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [schools, setSchools] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessData, setAccessData] = useState(null);
  const [place, setPlace] = useState("");
  const [updateVal, setUpdateVal] = useState(1);

  const [searchString, setSearchString] = useState("");
  const [selectedData, setSelectedData] = useState([]);

  const [tableFont, setTableFont] = useState({
    data: "14px",
    head: "16px",
    title: "18px",
  });
  const [policies, setPolicies] = useState(null);
  const getDetails = () => {
    if (loading === true) {
      setLoading(false);
    }
  };

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

  return (
    <PageWrapper title={key ? key : "Add Employee"}>
      <div className="row card p-3">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-md-3 mb-3">
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
                <div className="col-12 col-md-3 mb-3">
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
                      setPayload({ ...payload, school: val });
                    }}
                    autoFocus={true}
                  />
                </div>
              )}

              <div className="col-12 col-md-3 mb-3">
                <Select
                  label={"Designation"}
                  data={designations}
                  value={payload.designation}
                  onChange={(val) => {
                    setPayload({ ...payload, designation: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <TextInput
                  ref={componentRef}
                  label={"Name of Employee"}
                  value={payload.name}
                  onChange={(val) => {
                    setPayload({ ...payload, name: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <TextInput
                  label={"Father/Husband's Name"}
                  value={payload.father}
                  onChange={(val) => {
                    setPayload({ ...payload, father: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <DateInput
                  label={"Date of Birth"}
                  value={payload.dob}
                  onChange={(val) => {
                    setPayload({ ...payload, dob: val });
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
                  value={payload.gender}
                  onChange={(val) => {
                    setPayload({ ...payload, gender: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <NumInput
                  label={"Mobile"}
                  value={payload.mobile}
                  onChange={(val) => {
                    if (val.length <= 10) {
                      setPayload({ ...payload, mobile: val });
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
                  value={payload.bloodGroup}
                  onChange={(val) => {
                    setPayload({ ...payload, bloodGroup: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <NumInput
                  label={"Aadhar No."}
                  value={payload.aadhar}
                  onChange={(val) => {
                    setPayload({ ...payload, aadhar: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <TextInput
                  label={"Address"}
                  value={payload.address}
                  onChange={(val) => {
                    setPayload({ ...payload, address: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <NumInput
                  label={"Postal PIN"}
                  value={payload.pin}
                  onChange={(val) => {
                    setPayload({ ...payload, pin: val });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-12 text-right mt-4">
            <button
              className="btn btn-theme"
              disabled={
                payload.name === "" ||
                payload.designation === "" ||
                payload.school === "" ||
                payload.mobile === ""
                  ? true
                  : false
              }
              onClick={() => {
                if (payload.name === "") {
                  toast.warning("Please select from place");
                } else if (payload.mobile === "") {
                  toast.warning("Please select to place");
                } else {
                  if (key) {
                  } else {
                    addNewEmployeeService(payload).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          setPayload({
                            ...defaultPayload,
                            school: payload.school,
                            designation: payload.designation,
                            session: payload.session,
                          });
                          //  componentRef.current.focus()
                        } else {
                          toast.error(res.data.msg);
                        }
                      } else {
                        toast.error("Something went wrong.");
                      }
                    });
                  }
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AddEmployee;
