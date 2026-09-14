import React, { useEffect, useState } from "react";
import PageWrapper from "../../hoc/PageWrapper";
// import { addPaperStockDataService } from "../../services/HTTPService";
// import { useNavigate } from "react-router-dom";
import Colors from "../../assets/theme/Colors";
import { toast } from "react-toastify";
// import "./styles.css";
import sty from "./ImportData.module.css";
import { getUserData } from "../../services/AuthService";
import { Select, TextInput } from "../Shared/Elements";
import {
  checkStudentsDataService,
  getSchoolsListService,
} from "../../services/HTTPService";

//
const ImportData = () => {
  // const navigate = useNavigate();
  const defaultPayload = {
    school: "",
    session: "",
    entryBy: "",
    data: [],
  };
  const [pastedData, setPastedData] = useState([]);
  const [schools, setSchools] = useState([]);
  const [payload, setPayload] = useState(defaultPayload);

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

  useEffect(() => {
    getSchools();
  }, []);

  const handlePaste = (e) => {
    if (e.target.tagName && e.target.tagName.match(/(input|textarea)/i)) {
      // Do not handle past when an input element is currently focused
      return;
    }
    // Get clipboard data as text
    const data = e.clipboardData.getData("text");
    // Simplified parsing of the TSV data with hard-coded columns
    const rows = data.split("\n");
    const result = rows.map((row) => {
      const cells = row.split("\t");
      return {
        sno: cells[0],
        name: cells[1],
        father: cells[2],
        mother: cells[3],
        class: cells[4],
        section: cells[5],
        mobile: cells[6],
        dob: cells[7],
        address: cells[8],
        gender: cells[9],
        bloodGroup: cells[10],
        transport: cells[11],
        pin: cells[12],
        pid: cells[13],
        // reelSize: { CategoryName: cells[2] },
      };
    });
    console.log(result);
    setPastedData(result);
  };
  const submitData = () => {
    let payL = payload;
    payL.data = pastedData;
    payL.data.splice(0, 1);
    checkStudentsDataService(payL)
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.successCount);
        } else if (response.data.status === "error") {
          toast.error("Error ? " + response.data.msg);
        } else if (response.data.status === "logout") {
          //   navigate("/login");
        } else {
          toast.error("Error in Registering, Something went wrong. ");
        }
      })
      .catch((err) => {
        // navigate("/dashboard");
        console.log("err", err);
        toast.error("Catch Error, Something went wrong");
      });
  };
  //
  return (
    <PageWrapper title={"Import Data"}>
      <div className="col-md-12 card p-3">
        <div className="row">
          <div className="col-md-12">
            <div className="row mt-3 mb-3">
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
                      setPayload({ ...payload, school: val });
                    }}
                    autoFocus={true}
                  />
                </div>
              )}
              <div className="col-12 col-md-3 mb-3">
                <TextInput
                  label={"Entry By"}
                  value={payload.entryBy}
                  onChange={(val) => {
                    setPayload({ ...payload, entryBy: val });
                  }}
                />
              </div>
              <div className="col-md-12" style={{ textAlign: "center" }}>
                {/* {payload.data.length>0?( */}
                <button
                  className="btn btn-theme"
                  onClick={submitData}
                  disabled={
                    pastedData.length > 0 &&
                    payload.school !== "" &&
                    payload.session !== "" &&
                    payload.entryBy !== ""
                      ? false
                      : true
                  }
                >
                  {"Submit Data"}
                </button>
                {/* ):null} */}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div
            style={{ paddingBottom: "10px", overflowX: "auto" }}
            onPaste={handlePaste}
          >
            {pastedData.length > 0 && (
              <table>
                <thead>
                  <tr className="paper-req-table-row">
                    <th
                      className="paper-req-table-head"
                      width="5%"
                      style={{ textAlign: "center" }}
                    >
                      SN
                    </th>
                    <th className="paper-req-table-head" width="25%">
                      Name
                    </th>
                    <th className="paper-req-table-head" width="10%">
                      Father
                    </th>
                    <th className="paper-req-table-head" width="10%">
                      Mother
                    </th>
                    <th className="paper-req-table-head" width="10%">
                      Class
                    </th>
                    <th className="paper-req-table-head" width="10%">
                      Section
                    </th>
                    <th className="paper-req-table-head" width="10%">
                      Mobile
                    </th>
                    <th className="paper-req-table-head" width="5%">
                      DOB
                    </th>
                    <th className="paper-req-table-head" width="10%">
                      Address
                    </th>
                    <th className="paper-req-table-head" width="10%">
                      Gender
                    </th>
                    <th className="paper-req-table-head" width="10%">
                      Blood Grp.
                    </th>
                    <th className="paper-req-table-head" width="10%">
                      Transport
                    </th>
                    <th className="paper-req-table-head" width="10%">
                      Pin
                    </th>
                    <th className="paper-req-table-head" width="10%">
                      Image
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pastedData.map((item, key) => {
                    return (
                      <>
                        {key > 0 && key < pastedData.length - 1 && (
                          <tr
                            className={
                              key % 2 === 0 ? "paper-req-table-row-odd" : ""
                            }
                            key={key}
                          >
                            <td
                              className="paper-req-table-data"
                              style={{ textAlign: "center" }}
                            >
                              {item.sno}
                            </td>
                            <td
                              className="paper-req-table-data text-left"
                              style={{ paddingLeft: "5px" }}
                            >
                              {item.name}
                            </td>
                            <td className="paper-req-table-data">
                              {item.father}
                            </td>
                            <td className="paper-req-table-data">
                              {item.mother}
                            </td>
                            <td className="paper-req-table-data">
                              {item.class}
                            </td>
                            <td className="paper-req-table-data">
                              {item.section}
                            </td>
                            <td className="paper-req-table-data">
                              {item.mobile}
                            </td>
                            <td className="paper-req-table-data">{item.dob}</td>
                            <td className="paper-req-table-data">
                              {item.address}
                            </td>
                            <td className="paper-req-table-data">
                              {item.gender}
                            </td>
                            <td className="paper-req-table-data">
                              {item.bloodGroup}
                            </td>
                            <td className="paper-req-table-data">
                              {item.transport}
                            </td>
                            <td className="paper-req-table-data">{item.pin}</td>
                            <td className="paper-req-table-data">{item.pid}</td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {pastedData.length > 0 && (
          <div className="row">
            <div className="col-md-12">
              <div className="row mt-3 mb-3">
                <div className="col-md-12" style={{ textAlign: "center" }}>
                  <button
                    className="btn btn-theme"
                    // style={{ backgroundColor: Colors.defaultThemeColor }}
                    onClick={submitData}
                  >
                    {"Submit Data"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ImportData;
