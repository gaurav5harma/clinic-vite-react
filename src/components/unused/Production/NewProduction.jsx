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
  addNewProductionService,
  getClassesListBySchoolService,
  getSchoolsListService,
  getTemplatesListService,
} from "../../services/HTTPService";
import { getUserData } from "../../services/AuthService";
const NewProduction = (props) => {
  const key = useParams().ref;
  const componentRef = useRef();
  const navigate = useNavigate();
  const defaultPayload = {
    school: "",
    title: "",
    type: "",
    orientation: "",
    data: "",
    fields: "",
    template: "",
    innerStyle: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [schools, setSchools] = useState([]);
  const [templates, setTemplates] = useState([]);
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

  const getTemplates = (type) => {
    getTemplatesListService({ type: type }).then((response) => {
      if (response.status === 200) {
        setTemplates(response.data);
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
    <PageWrapper title={key ? key : "New Production"}>
      <div className="row card p-3">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-md-3 mb-3">
                <TextInput
                  label={"Title"}
                  placeholder="Production Title"
                  value={payload.title}
                  onChange={(val) => {
                    setPayload({ ...payload, title: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <Select
                  label={"School"}
                  data={schools}
                  value={payload.school}
                  onChange={(val) => {
                    // getClassesListBySchoolService({ school: val }).then(res => {
                    //   if (res.status === 200) {
                    //     setClasses(res.data.data)
                    //   } else {
                    //     toast.error("Something went wrong.");
                    //   }
                    // });
                    setPayload({ ...payload, school: val });
                  }}
                  autoFocus={true}
                />
              </div>

              <div className="col-12 col-md-3 mb-3">
                <Select
                  label={"Type"}
                  data={[
                    { name: "Student ID Card", value: "student" },
                    { name: "Employee ID Card", value: "employee" },
                    { name: "Name Slip", value: "sticker" },
                    { name: "16mm Lanyard", value: "16mm-lanyard" },
                    { name: "20mm Lanyard", value: "20mm-lanyard" },
                  ]}
                  value={payload.type}
                  onChange={(val) => {
                    // let idx = classes.findIndex(x => Number(x.value) === Number(val));
                    // let _class = classes[idx].class;
                    // let _section = classes[idx].section;
                    let typ = "id-card";
                    if (val === "student" || val === "employee") {
                      typ = "id-card";
                    } else if (
                      val === "16mm-lanyard" ||
                      val === "20mm-lanyard"
                    ) {
                      typ = "lanyard";
                    } else {
                      typ = val;
                    }
                    getTemplates(typ);
                    setPayload({ ...payload, type: val, template: "" });
                  }}
                />
              </div>

              <div className="col-12 col-md-3 mb-3">
                <Select
                  label={"Orientation"}
                  data={[
                    { name: "Portrait", value: "portrait" },
                    { name: "Landscape", value: "landscaspe" },
                  ]}
                  value={payload.orientation}
                  onChange={(val) => {
                    // let idx = classes.findIndex(x => Number(x.value) === Number(val));
                    // let _class = classes[idx].class;
                    // let _section = classes[idx].section;
                    setPayload({ ...payload, orientation: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <TextInput
                  label={"Data"}
                  value={payload.data}
                  onChange={(val) => {
                    setPayload({ ...payload, data: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <TextInput
                  label={"Fields"}
                  value={payload.fields}
                  onChange={(val) => {
                    setPayload({ ...payload, fields: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <Select
                  label={"Template"}
                  data={templates}
                  value={payload.template}
                  onChange={(val) => {
                    setPayload({ ...payload, template: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <TextInput
                  label={"Inner Style"}
                  value={payload.innerStyle}
                  onChange={(val) => {
                    setPayload({ ...payload, innerStyle: val });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-12 text-right mt-4">
            <button
              className="btn btn-theme"
              disabled={
                payload.title === "" ||
                payload.template === "" ||
                payload.type === ""
                  ? true
                  : false
              }
              onClick={() => {
                if (payload.title === "") {
                  toast.warning("Please select title");
                } else if (payload.template === "") {
                  toast.warning("Please select template");
                } else {
                  if (key) {
                  } else {
                    addNewProductionService(payload).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          setPayload(defaultPayload);
                          //  setPayload({ ...defaultPayload, school: payload.school, classId: payload.classId, class: payload.class, section: payload.section, session: payload.session })
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

export default NewProduction;
