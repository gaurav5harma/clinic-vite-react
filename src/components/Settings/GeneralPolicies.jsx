import React, { useState, useEffect } from "react";
import PageWrapper from "../../hoc/PageWrapper";
import Colors from "../../assets/theme/Colors";
import { toast } from "react-toastify";
import {
  requestPoliciesService,
  updatePoliciesService,
} from "../../services/HTTPService";
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaPen,
  FaTimes,
} from "react-icons/fa";
import { TextInput } from "../Shared/Elements";

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
      "itemCategories",
      "itemType",
      "schedule",
      "baseUnit",
      "tabletDose",
      "capsuleDose",
      "syrupDose",
      "defaultDose",
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
  const movePolicyItem = (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const items = policies[selectedPolicy];

    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reorderedItems = [...items];
    [reorderedItems[index], reorderedItems[targetIndex]] = [
      reorderedItems[targetIndex],
      reorderedItems[index],
    ];

    updatePoliciesService({
      policy: selectedPolicy,
      data: reorderedItems,
    }).then((res) => {
      if (res.status === 200 && res.data.status === "success") {
        toast.success(res.data.msg);
        setPolicies({ ...policies, [selectedPolicy]: reorderedItems });
        setSelectedData(defaultData);
      } else {
        toast.error(res.data?.msg || "Something went wrong.");
      }
    });
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
              {selectedPolicy !== "" && (
                <div className="col-12 mt-4">
                  <div className="rounded-3 border bg-light px-3 py-3">
                    <div className="row g-2 align-items-end">
                      <div className="col-12 col-md-4">
                        <TextInput
                          label="Key"
                          placeholder="Enter key"
                          value={selectedData.key}
                          onChange={(value) =>
                            setSelectedData({
                              ...selectedData,
                              key: value,
                              value: value,
                            })
                          }
                          autoFocus
                        />
                      </div>
                      {/* <div className="col-12 col-md-4">
                        <TextInput
                          label="Value"
                          placeholder="Enter value"
                          value={selectedData.value}
                          onChange={(value) =>
                            setSelectedData({ ...selectedData, value })
                          }
                        />
                      </div> */}
                      <div className="col-12 col-md-4">
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-theme flex-grow-1"
                            onClick={checkValidation}
                            disabled={
                              !selectedData.key.trim() ||
                              !selectedData.value.trim()
                            }
                          >
                            <FaCheck className="me-2" />
                            {selectedData.index !== "" ? "Update" : "Add"}
                          </button>
                          {selectedData.index !== "" && (
                            <button
                              type="button"
                              className="btn btn-light border"
                              title="Cancel editing"
                              onClick={() => setSelectedData(defaultData)}
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPolicy !== "" && (
                <div className="col-12 mt-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h5 className="mb-0 fw-bold">Policy Items</h5>
                    <span className="text-muted small">
                      {policies[selectedPolicy]?.length || 0} items
                    </span>
                  </div>

                  <div className="border rounded-3 bg-white overflow-hidden">
                    {policies[selectedPolicy]?.map((el, key) => {
                      const name = el.name ? el.name : "";
                      const value = el.value ? el.value : el;
                      const isEditing = selectedData.index === key;

                      return (
                        <div
                          className="d-flex align-items-center px-3 py-2 border-bottom"
                          style={{ background: isEditing ? "#f1f7f6" : "#fff" }}
                          key={key}
                        >
                          <div
                            className="text-muted small me-3"
                            style={{ width: "28px" }}
                          >
                            {key + 1}
                          </div>
                          <div className="flex-grow-1 row g-2 align-items-center">
                            <div className="col-12 col-md-5 fw-semibold text-dark">
                              {name}
                            </div>
                            <div className="col-12 col-md-7 text-muted">
                              {value}
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-1 ms-3">
                            <button
                              type="button"
                              className="btn btn-light border btn-sm"
                              title="Move up"
                              disabled={key === 0}
                              onClick={() => movePolicyItem(key, "up")}
                            >
                              <FaArrowUp />
                            </button>
                            <button
                              type="button"
                              className="btn btn-light border btn-sm"
                              title="Move down"
                              disabled={
                                key === policies[selectedPolicy].length - 1
                              }
                              onClick={() => movePolicyItem(key, "down")}
                            >
                              <FaArrowDown />
                            </button>
                            <button
                              type="button"
                              className="btn btn-light border btn-sm"
                              title={isEditing ? "Editing" : "Edit"}
                              style={{ color: Colors.defaultThemeColor }}
                              onClick={() =>
                                setSelectedData({
                                  key: name,
                                  value,
                                  index: key,
                                })
                              }
                            >
                              <FaPen />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {(!policies[selectedPolicy] ||
                      policies[selectedPolicy].length === 0) && (
                      <div className="text-center text-muted py-4">
                        No items added yet
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </PageWrapper>
  );
};

export default GeneralPolicies;
