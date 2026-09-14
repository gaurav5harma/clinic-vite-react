import React, { useState, useEffect } from "react";
import Colors from "../../../assets/theme/Colors";
import {
  createMachinePlanService,
  getProcessesWithMachinesService,
} from "../../../services/HTTPService";
import { toast } from "react-toastify";

const CreateMachinePlanView = (props) => {
  const [processes, setProcesses] = useState([]);
  const [data, setData] = useState({
    production: props.production.id,
    machines: [],
  });

  const getProcesses = () => {
    getProcessesWithMachinesService({ item: props.production.itemId }).then(
      (res) => {
        if (res.status === 200) {
          setProcesses(res.data);
          let machines = [];
          res.data.forEach((el) => {
            machines.push({
              processPlan: el.ref,
              process: el.name,
              type: el.type,
              stage: el.stage,
              machine: "",
              machineId: "",
            });
          });
          setData({ ...data, machines: machines });
        } else {
          toast.error("Something went wrong.");
        }
      }
    );
  };

  useEffect(() => {
    getProcesses();
  }, []);

  const machineChanged = (index, e) => {
    let machines = data.machines;
    machines[index]["machine"] =
      processes[index].machines[
        processes[index].machines.findIndex((el) => el.id === e.target.value)
      ].machine;
    machines[index]["machineId"] = e.target.value;
    setData({ ...data, machines: machines });
  };

  const checkValidation = () => {
    if (!data.production && data.production !== "") {
      toast.error("Please select item");
      props.visibility(false);
    } else if (data.machines.length === 0) {
      toast.error("No machines found.");
    } else {
      createMachinePlanService(data).then((res) => {
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

  return (
    <div className="row p-2 ">
      <h2>
        <span style={{ color: Colors.defaultThemeColor }}>
          Add Machine Plan
        </span>
      </h2>
      <hr className="mb-3" />
      <div className="row">
        <div className="col-12 mb-3">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                {/* <th style={{ width: "20%" }}>SNo.</th> */}
                <th style={{ width: "20%" }}>Stage</th>
                <th style={{ width: "30%" }}>Process</th>
                {/* <th style={{ width: "30%" }}>Select Machine</th> */}
              </tr>
            </thead>
            <tbody>
              {processes.length > 0 &&
                processes.map((dta, key) => {
                  return (
                    <tr key={key}>
                      {/* <td>{key + 1}</td> */}
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={dta.stage}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={dta.value}
                          readOnly
                        />
                      </td>
                      {/* <td>
                        <select
                          tabIndex={key + 11}
                          className="form-select"
                          value={data.machines[key].machineId}
                          onChange={(e) => {
                            machineChanged(key, e);
                          }}
                        >
                          <option value="">Select</option>
                          {dta.machines.length > 0 &&
                            dta.machines.map((machine, key2) => {
                              return (
                                <option
                                  key={key2}
                                  value={machine.id}
                                >
                                  {machine.machine}
                                </option>
                              );
                            })}
                        </select>
                      </td> */}
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
            disabled={data.machines.length > 0 ? false : true}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMachinePlanView;
