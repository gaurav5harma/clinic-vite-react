import React, { useState, useEffect } from "react";
import Colors from "../../../assets/theme/Colors";
import {
  createProcessPlanService,
  getProcessesService,
} from "../../../services/HTTPService";
import { toast } from "react-toastify";
import { getCorrugationCounts } from "../../../services/PrefService";

const CreateProcessPlanView = (props) => {
  const [processes, setProcesses] = useState([]);
  const [data, setData] = useState({
    item: props.item,
    process: [
      { stage: 1, process: "top-paper-cutting", type: "corrugation" },
      { stage: 1, process: "", type: "" },
      { stage: 2, process: "", type: "" },
      { stage: 3, process: "", type: "" },
      { stage: 4, process: "", type: "" },
      { stage: 5, process: "", type: "" },
      { stage: 6, process: "", type: "" },
      { stage: 7, process: "", type: "" },
      { stage: 8, process: "", type: "" },
      { stage: 9, process: "", type: "" },
      { stage: 10, process: "", type: "" },
      { stage: 11, process: "", type: "" },
      { stage: 12, process: "", type: "" },
      { stage: 13, process: "", type: "" },
      { stage: 14, process: "", type: "" },
    ],
  });

  const getProcesses = () => {
    getProcessesService().then((res) => {
      if (res.status === 200) {
        setProcesses(res.data);
        let corrData = getCorrugationCounts(JSON.parse(props.plyData));
        let process = data.process;
        if (corrData.narrow > 0 && corrData.broad > 0) {
          process[1].stage = 1;
          process[1].process = "corrugation-narrow";
          process[1].type = "corrugation";
          process[2].stage = 1;
          process[2].process = "corrugation-broad";
          process[2].type = "corrugation";
        } else {
          if (corrData.narrow > 0) {
            process[1].stage = 1;
            process[1].process = "corrugation-narrow";
            process[1].type = "corrugation";
          }
          if (corrData.broad > 0) {
            process[1].stage = 1;
            process[1].process = "corrugation-broad";
            process[1].type = "corrugation";
          }
        }
        // Assign next processes
        // for(let i=2;i<process.length;i++){

        // }
        setData({ ...data, process: process });
      } else {
        toast.error("Something went wrong.");
      }
    });
  };

  useEffect(() => {
    getProcesses();
  }, []);

  const processChanged = (index, key, val) => {
    let idxData = data.process.findIndex((ob) => ob.process === val);
    // let idxProcess = processes.findIndex(ob => ob.value === val);
    if (val === "") {
      let process = data.process;
      process[index][key] = "";
      process[index]["type"] = "";
      setData({ ...data, process: process });
    } else if (idxData !== -1) {
      toast.warning("Process already assigned");
    } else {
      let process = data.process;
      process[index][key] = val;
      process[index]["type"] =
        processes[processes.findIndex((ob) => ob.value === val)].type;
      setData({ ...data, process: process });
    }
  };

  const activateField = (index) => {
    if (data.process.length > 0) {
      if (data.process[Number(index) - 1]["process"] !== "") {
        return true;
      }
    } else return false;
  };

  const checkValidation = () => {
    let dta = data;
    let processArr = [];
    data.process.forEach((el) => {
      let counter = 0;
      if (el.process !== "") {
        if (el.process.stage === "") {
          toast.error("Please assign Stage Number to all processes.");
          counter++;
        } else {
          processArr.push(el);
        }
      }
    });
    dta.process = processArr;
    if (!data.item && data.item !== "") {
      toast.error("Please select item");
      props.visibility(false);
    } else if (processArr.length === 0) {
      toast.error("Please input processes");
    } else {
      createProcessPlanService(data).then((res) => {
        if (res.status === 200) {
          if (res.data.status === "success") {
            toast.success(res.data.msg);
            props.visibility(false);
          } else {
            toast.error(res.data.msg);
          }
        } else {
          toast.error("Something went wrong.");
        }
      });
    }
  };

  const generateStageNumbers = (key) => {
    if (Number(key) === 0) {
      return (
        <>
          <option value={key + 1}>{key + 1}</option>
        </>
      );
    } else {
      return (
        <>
          <option value={Number(data.process[key - 1].stage) + 1}>
            {Number(data.process[key - 1].stage) + 1}
          </option>
          <option value={data.process[key - 1].stage}>
            {data.process[key - 1].stage}
          </option>
          <option value={Number(data.process[key - 1].stage) + 2}>
            {Number(data.process[key - 1].stage) + 2}
          </option>
        </>
      );
    }
  };

  return (
    <div className="row p-2 ">
      <h2>
        <span style={{ color: Colors.defaultThemeColor }}>
          Create Process Plan
        </span>
      </h2>
      <small>
        [Note : Assign same stage number to the parallel processes.]
      </small>
      <hr className="mb-3" />
      <div className="row">
        <div className="col-12 mb-3">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ width: "20%" }}>SNo.</th>
                <th style={{ width: "20%" }}>Stage</th>
                <th style={{ width: "30%" }}>Process</th>
                <th style={{ width: "30%" }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {data.process.map((dta, key) => {
                return (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>
                      <select
                        className="form-select"
                        value={dta.stage}
                        onChange={(e) => {
                          let val = e.target.value;
                          if ((Number(val) > 0) | (val === "")) {
                            let process = data.process;
                            process[key]["stage"] = val;
                            for (let i = key; i < data.process.length; i++) {
                              if (i !== key) {
                                process[i]["stage"] =
                                  Number(process[i - 1].stage) + 1;
                              }
                            }
                            setData({ ...data, process: process });
                          }
                        }}
                        // disabled={key===0?false:(activateField(key)===true?false:true)}
                      >
                        {generateStageNumbers(key)}
                      </select>
                    </td>
                    <td>
                      <select
                        tabIndex={key + 11}
                        className="form-select"
                        value={dta.process}
                        onChange={(e) => {
                          let val = e.target.value;
                          processChanged(key, "process", val);
                        }}
                        disabled={
                          key === 0
                            ? false
                            : activateField(key) === true
                            ? false
                            : true
                        }
                      >
                        <option value="">Select</option>
                        {processes &&
                          processes.map((process, key) => {
                            return (
                              <option
                                key={key}
                                typ={process.type}
                                value={process.value}
                              >
                                {process.name}
                              </option>
                            );
                          })}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={dta.type.toUpperCase()}
                        onChange={(e) => {
                          let val = e.target.value;
                        }}
                        readOnly
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="col-12 text-right">
          <button
            className="btn btn-theme px-5"
            style={{ backgroundColor: Colors.defaultThemeColor }}
            onClick={checkValidation}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProcessPlanView;
