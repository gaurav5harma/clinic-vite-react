import React, { useState, useEffect } from "react";
import PageWrapper from "../../../hoc/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Colors from "../../../assets/theme/Colors";
import { NumInput, TextInput } from "../../Shared/Elements";
import {
  addNewSchoolService,
  requestPoliciesService,
  requestSalaryStructureService,
} from "../../../services/HTTPService";
import { getUserData } from "../../../services/AuthService";
const AddSchool = (props) => {
  const key = useParams().ref;
  const navigate = useNavigate();
  const defaultPayload = {
    name: "",
    subtitle: "",
    address: "",
    pin: "",
    mobile: "",
    altMobile: "",
    contactPerson: "",
    cpMobile: "",
    logo: "",
    signature: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [tabVal, setTabVal] = useState(1);
  const [report, setReport] = useState([]);
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

  const getPolicies = () => {
    let policyParams = ["departments", "plants", "designations"];
    requestPoliciesService({ policies: policyParams }).then((response) => {
      if (response.status === 200) {
        requestSalaryStructureService().then((response2) => {
          if (response.status === 200) {
            let pol = response.data;
            pol["salaryStructures"] = response2.data;
            setPolicies(pol);
          } else {
            toast.error(response.data.msg);
            if (response.data.status === "logout") {
              logout();
            }
            window.history.back();
          }
        });
      } else {
        toast.error(response.data.msg);
        if (response.data.status === "logout") {
          logout();
        }
        window.history.back();
      }
    });
  };

  const getNominal = () => {};

  useEffect(() => {
    getDetails();
    getPolicies();
    if (key) {
      getNominal();
    }
  }, []);

  const updateData = () => {
    let upd = updateVal;
    upd = upd + 1;
    setUpdateVal(upd);
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

  return (
    <PageWrapper title={key ? key : "Add School"}>
      <div className="row card p-3">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-md-3 mb-3">
                <TextInput
                  label={"Name of School"}
                  value={payload.name}
                  onChange={(val) => {
                    setPayload({ ...payload, name: val });
                  }}
                  autoFocus={true}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <TextInput
                  label={"Sub Title"}
                  value={payload.subtitle}
                  onChange={(val) => {
                    setPayload({ ...payload, subtitle: val });
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
                <NumInput
                  label={"Alt Mobile"}
                  value={payload.altMobile}
                  onChange={(val) => {
                    if (val.length <= 10) {
                      setPayload({ ...payload, altMobile: val });
                    }
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <TextInput
                  label={"Contact Person"}
                  value={payload.contactPerson}
                  onChange={(val) => {
                    setPayload({ ...payload, contactPerson: val });
                  }}
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <NumInput
                  label={"Contact Person Mobile"}
                  value={payload.cpMobile}
                  onChange={(val) => {
                    if (val.length <= 10) {
                      setPayload({ ...payload, cpMobile: val });
                    }
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
                    if (val.length <= 6) {
                      setPayload({ ...payload, pin: val });
                    }
                  }}
                />
              </div>
              {/* <div className="col-12 col-md-3 mb-3">
                <label className="form-label" htmlFor="">
                  Select Logo (PNG Only)
                </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(event) => {
                    let fileinfo = event.target.files[0];
                    let name = event.target.name;
                    console.log(fileinfo)
                    if (fileinfo && fileinfo.size / 1024 <= 3072) {
                      if (fileinfo.type === "image/png") {
                        fileToDataUri(fileinfo).then((dataUri) => {
                          let data = {
                            title: 'logo',
                            value: dataUri,
                          };
                          setPayload({ ...payload, logo: data });
                        });
                      }
                      else {
                        toast.error("Only PNG file is allowed");
                      }
                    } else {
                      toast.error("File size should be less than 3 MB.");
                    }
                  }}
                  placeholder="Browse"
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <label className="form-label" htmlFor="">
                  Select Signature (PNG Only)
                </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(event) => {
                    let fileinfo = event.target.files[0];
                    let name = event.target.name;
                    console.log(fileinfo)
                    if (fileinfo && fileinfo.size / 1024 <= 3072) {
                      if (fileinfo.type === "image/png") {
                        fileToDataUri(fileinfo).then((dataUri) => {
                          let data = {
                            title: 'signature',
                            value: dataUri,
                          };
                          setPayload({ ...payload, signature: data });
                        });
                      }
                      else {
                        toast.error("Only PNG file is allowed");
                      }
                    } else {
                      toast.error("File size should be less than 3 MB.");
                    }
                  }}
                  placeholder="Browse"
                />
              </div>
              <div className="col-12 col-md-3 mb-3">
                <label className="form-label" htmlFor="">
                  Select School Image (JPG/PNG Only)
                </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(event) => {
                    let fileinfo = event.target.files[0];
                    let name = event.target.name;
                    console.log(fileinfo)
                    if (fileinfo && fileinfo.size / 1024 <= 3072) {
                      if (fileinfo.type === "image/png" || fileinfo.type === "image/jpg" || fileinfo.type === "image/jpeg") {
                        fileToDataUri(fileinfo).then((dataUri) => {
                          let data = {
                            title: 'school',
                            value: dataUri,
                          };
                          setPayload({ ...payload, schoolImage: data });
                        });
                      }
                      else {
                        toast.error("Only PNG/JPG file is allowed");
                      }
                    } else {
                      toast.error("File size should be less than 3 MB.");
                    }
                  }}
                  placeholder="Browse"
                />
              </div> */}
            </div>
          </div>

          <div className="col-12 text-right mt-4">
            <button
              className="btn btn-theme"
              disabled={
                payload.name === "" || payload.mobile === "" ? true : false
              }
              onClick={() => {
                if (payload.name === "") {
                  toast.warning("Please select from place");
                } else if (payload.mobile === "") {
                  toast.warning("Please select to place");
                } else {
                  if (key) {
                  } else {
                    addNewSchoolService(payload).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                          setPayload(defaultPayload);
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

export default AddSchool;
