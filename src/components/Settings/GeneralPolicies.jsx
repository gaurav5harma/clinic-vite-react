import React, { useState, useEffect } from "react";
import PageWrapper from "../../hoc/PageWrapper";
import Colors from "../../assets/theme/Colors";
import { toast } from "react-toastify";
import {
  requestPoliciesService,
  updatePoliciesService,
} from "../../services/HTTPService";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaPen,
  FaTimesCircle,
} from "react-icons/fa";

const GeneralPolicies = () => {
  const defaultData = {
    key: "",
    value: "",
    index: "",
  };
  const [policies, setPolicies] = useState(null);
  const [update, setUpdate] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [selectedData, setSelectedData] = useState(defaultData);
  const checkValidation = () => {
    let val = policies[selectedPolicy];
    if (selectedData.index !== "") {
      val[selectedData.index] = {
        name: selectedData.key,
        value: selectedData.value,
      };
      updatePoliciesService({ policy: selectedPolicy, data: val }).then(
        (res) => {
          if (res.status === 200) {
            if (res.data.status === "success") {
              toast.success(res.data.msg);
              setPolicies({ ...policies, [selectedPolicy]: val });
              setSelectedData(defaultData);
            } else {
              toast.error(res.data.msg);
            }
          } else {
            toast.error("Something went wrong.");
          }
        },
      );
    } else {
      let newData = policies[selectedPolicy];
      newData.push({ name: selectedData.key, value: selectedData.value });
      updatePoliciesService({ policy: selectedPolicy, data: newData }).then(
        (res) => {
          if (res.status === 200) {
            if (res.data.status === "success") {
              toast.success(res.data.msg);
              setPolicies({ ...policies, [selectedPolicy]: newData });
              setSelectedData(defaultData);
            } else {
              toast.error(res.data.msg);
            }
          } else {
            toast.error("Something went wrong.");
          }
        },
      );
    }
  };
  const getPolicies = () => {
    let policyParams = [
      "books",
      "depositBooks",
      "designations",
      "index",
      "salaryStructures",
    ];
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
  const updateChanges = () => {
    let upd = update;
    upd = upd + 1;
    setUpdate(upd);
  };
  return (
    <PageWrapper title="General Policies">
      <div className="row card p-3">
        <div className="col-md-12">
          {policies ? (
            <div className="row">
              <div className="col-12 col-md-3">
                <h3>Select Policy</h3>
                <select
                  className="form-select"
                  value={selectedPolicy}
                  onChange={(e) => {
                    let val = e.target.value;
                    setSelectedPolicy(val);
                    setSelectedData(defaultData);
                  }}
                >
                  <option value="">Select</option>
                  {Object.keys(policies).map((el, key) => {
                    return (
                      <option value={el} key={key}>
                        {el
                          .replace(/([A-Z])/g, " $1")
                          .charAt(0)
                          .toUpperCase() +
                          el.replace(/([A-Z])/g, " $1").slice(1)}
                      </option>
                    );
                  })}
                </select>
              </div>
              {selectedPolicy !== "" ? (
                <div className="row mt-4">
                  <div className="col-12 col-md-3 mb-3">
                    <label className="form-label">Key</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Key"
                      value={selectedData.key}
                      onChange={(e) => {
                        let val = e.target.value;
                        let dta = selectedData;
                        dta.key = val;
                        dta.value = val;
                        setSelectedData(dta);
                        updateChanges();
                      }}
                      autoFocus={true}
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-3">
                    <label className="form-label">Value</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Value"
                      value={selectedData.value}
                      disabled
                      // onChange={(e) => {
                      //   let val = e.target.value;
                      //   let dta = selectedData;
                      //   dta.value = val;
                      //   setSelectedData(dta);
                      //   updateChanges();
                      // }}
                    />
                  </div>
                  <div className="col-12 col-md-3 mb-3">
                    <button
                      className="btn btn-theme"
                      style={{
                        // backgroundColor: Colors.defaultThemeColor,
                        marginTop: "28px",
                      }}
                      onClick={checkValidation}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : null}
              <hr className="mt-3 mb-3" />
              <div className="col-12 col-md-3">
                <h3>
                  {selectedPolicy === ""
                    ? ""
                    : selectedPolicy
                        .replace(/([A-Z])/g, " $1")
                        .charAt(0)
                        .toUpperCase() +
                      selectedPolicy.replace(/([A-Z])/g, " $1").slice(1)}
                </h3>
              </div>
              <div className="col-12 col-md-9">
                <table style={{ width: "100%" }}>
                  <tbody>
                    {policies[selectedPolicy] &&
                      policies[selectedPolicy].map((el, key) => {
                        return (
                          <tr key={key}>
                            <td style={{ width: "30%" }}>
                              {el.name ? el.name : ""}
                            </td>
                            <td style={{ fontWeight: "bold" }}>
                              {el.value ? el.value : el}
                            </td>
                            <td className="text-left">
                              <FaPen
                                style={{
                                  cursor: "pointer",
                                  marginRight: "10px",
                                  marginLeft: "10px",
                                }}
                                onClick={() => {
                                  let data = selectedData;
                                  data.key = el.name ? el.name : "";
                                  data.value = el.value ? el.value : el;
                                  data.index = key;
                                  setSelectedData(data);
                                  updateChanges();
                                }}
                              />
                              {/* <FaTimesCircle
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  let newData = policies[selectedPolicy];
                                  newData.splice(key, 1);
                                  updatePoliciesService({
                                    policy: selectedPolicy,
                                    data: newData,
                                  }).then((res) => {
                                    if (res.status === 200) {
                                      if (res.data.status === "success") {
                                        toast.success(res.data.msg);
                                        setPolicies({
                                          ...policies,
                                          [selectedPolicy]: newData,
                                        });
                                        setSelectedData(defaultData);
                                      } else {
                                        toast.error(res.data.msg);
                                      }
                                    } else {
                                      toast.error("Something went wrong.");
                                    }
                                  });
                                }}
                              /> */}

                              <FaArrowAltCircleDown
                                style={{
                                  cursor: "pointer",
                                  color:
                                    key < policies[selectedPolicy].length - 1
                                      ? "black"
                                      : "#cacaca",
                                }}
                                onClick={() => {
                                  if (
                                    key <
                                    policies[selectedPolicy].length - 1
                                  ) {
                                    let newData = policies[selectedPolicy];
                                    let current = newData[key];
                                    let next = newData[key + 1];
                                    newData[key] = next;
                                    newData[key + 1] = current;
                                    updatePoliciesService({
                                      policy: selectedPolicy,
                                      data: newData,
                                    }).then((res) => {
                                      if (res.status === 200) {
                                        if (res.data.status === "success") {
                                          toast.success(res.data.msg);
                                          setPolicies({
                                            ...policies,
                                            [selectedPolicy]: newData,
                                          });
                                          setSelectedData(defaultData);
                                        } else {
                                          toast.error(res.data.msg);
                                        }
                                      } else {
                                        toast.error("Something went wrong.");
                                      }
                                    });
                                  }
                                }}
                              />
                              <FaArrowAltCircleUp
                                style={{
                                  cursor: "pointer",
                                  color: key === 0 ? "#cacaca" : "black",
                                }}
                                onClick={() => {
                                  if (key > 0) {
                                    let newData = policies[selectedPolicy];
                                    let current = newData[key];
                                    let prev = newData[key - 1];
                                    newData[key] = prev;
                                    newData[key - 1] = current;
                                    updatePoliciesService({
                                      policy: selectedPolicy,
                                      data: newData,
                                    }).then((res) => {
                                      if (res.status === 200) {
                                        if (res.data.status === "success") {
                                          toast.success(res.data.msg);
                                          setPolicies({
                                            ...policies,
                                            [selectedPolicy]: newData,
                                          });
                                          setSelectedData(defaultData);
                                        } else {
                                          toast.error(res.data.msg);
                                        }
                                      } else {
                                        toast.error("Something went wrong.");
                                      }
                                    });
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </PageWrapper>
  );
};

export default GeneralPolicies;
