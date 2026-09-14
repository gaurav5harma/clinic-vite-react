import React, { useState, useEffect } from "react";
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
  getAllSewadarsService,
  requestPoliciesService,
} from "../../services/HTTPService";
import { getUserData } from "../../services/AuthService";
const Student = (props) => {
  const key = useParams().ref;
  const navigate = useNavigate();
  const defaultPayload = {
    toPlace: "43",
    fromPlace: getUserData().placeId ? getUserData().placeId : "",
    fromDate: "",
    toDate: "",
    department: "",
    vehicleType: "",
    vehicleNumber: "",
    driverName: "",
    sewaDays: "",
    male: "",
    female: "",
    incharge: "",
    sewadars: [],
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
      // getNominalAccessDataService().then((res) => {
      //   if (res.status === 200) {
      //     let accessData = res.data;
      //     accessData.fromPlaces2 = accessData.fromPlaces;
      //     accessData.fromPlaces2.push({name:'All',value:'all'});
      //     setAccessData(accessData);
      //   } else {
      //     toast.error("Something went wrong.");
      //   }
      // });
    }
  };

  const getPolicies = () => {
    let policyParams = ["sewaDepartments", "vehicleTypes"];
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

  // const getNominal = () => {
  //   getNominalService({ ref: key }).then((res) => {
  //     if (res.status === 200) {
  //       setSelectedData(res.data.data.sewadars);
  //       res.data.data.sewadars = [];
  //       setPayload(res.data.data);
  //     } else {
  //       toast.error("Something went wrong.");
  //     }
  //   });
  // };

  useEffect(() => {
    getDetails();
    getPolicies();
    if (key) {
      // getNominal();
    }
  }, []);

  const updateData = () => {
    let upd = updateVal;
    upd = upd + 1;
    setUpdateVal(upd);
  };

  const generateReport = () => {
    let data =
      report && report.length > 0
        ? report.filter((fl) =>
            fl.name.toLowerCase().includes(searchString.toLowerCase())
          )
        : [];

    let tData = [];
    if (data.length > 0) {
      let totalMale = 0;
      let totalFemale = 0;
      let gtMale = 0;
      let gtFemale = 0;

      data.map((el, key1) => {
        totalMale += Number(el.male);
        totalFemale += Number(el.female);
        gtMale += Number(el.male);
        gtFemale += Number(el.female);

        let r1 = (
          <tr
            className={key1 % 2 === 0 ? "table-row" : "table-row-odd"}
            style={{ color: el.selected === false ? "black" : "green" }}
            key={key1}
          >
            <td
              className="table-data text-center"
              // rowSpan={data.filter((fl) => fl.area === el.area).length}
              style={{ fontSize: tableFont.data }}
            >
              <Checkbox
                checked={el.selected}
                onChange={(val) => {
                  let dta = report;
                  let idx = dta.findIndex((x) => x.badge === el.badge);
                  dta[idx].selected = val;

                  let sel = selectedData;
                  if (val === true) {
                    sel.push(el);
                  } else {
                    let idx = sel.findIndex((x) => x.badge === el.badge);
                    sel.splice(idx, 1);
                  }

                  setReport(dta);
                  setSelectedData(sel);
                  updateData();
                }}
              />
            </td>
            <td
              className="table-data text-left"
              style={{ fontSize: tableFont.data }}
            >
              {el.badge}
            </td>
            <td
              className="table-data text-left"
              style={{ fontSize: tableFont.data }}
            >
              {el.name}
            </td>
            <td
              className="table-data text-left"
              style={{ fontSize: tableFont.data }}
            >
              {el.father_husband}
            </td>
            <td
              className="table-data text-left"
              style={{ fontSize: tableFont.data }}
            >
              {el.gender}
            </td>
            <td
              className="table-data text-left"
              style={{ fontSize: tableFont.data }}
            >
              {el.mobile}
            </td>
          </tr>
        );
        tData.push(r1);
      });
    }

    return tData;
  };

  const generateReport2 = () => {
    let data = selectedData && selectedData.length > 0 ? selectedData : [];

    let tData = [];
    if (data.length > 0) {
      let totalMale = 0;
      let totalFemale = 0;
      let gtMale = 0;
      let gtFemale = 0;

      data.map((el, key1) => {
        totalMale += Number(el.male);
        totalFemale += Number(el.female);
        gtMale += Number(el.male);
        gtFemale += Number(el.female);

        let r1 = (
          <tr
            className={key1 % 2 === 0 ? "table-row" : "table-row-odd"}
            style={{ color: key1 > 0 ? "black" : "green", cursor: "pointer" }}
            key={key1}
            onClick={() => {
              let dta = selectedData;
              let temp = dta[0];
              dta[0] = el;
              dta[key1] = temp;
              setSelectedData(dta);
              updateData();
            }}
          >
            <td
              className="table-data text-center"
              // rowSpan={data.filter((fl) => fl.area === el.area).length}
              style={{ fontSize: tableFont.data }}
            >
              {key1 + 1}
            </td>
            <td
              className="table-data text-left"
              style={{ fontSize: tableFont.data }}
            >
              {el.badge}
            </td>
            <td
              className="table-data text-left"
              style={{ fontSize: tableFont.data }}
            >
              {el.name} {key1 === 0 ? "(Inc.)" : null}
            </td>
            <td
              className="table-data text-left"
              style={{ fontSize: tableFont.data }}
            >
              {el.father_husband}
            </td>
            <td
              className="table-data text-left"
              style={{ fontSize: tableFont.data }}
            >
              {el.gender}
            </td>
            <td
              className="table-data text-left"
              style={{ fontSize: tableFont.data }}
            >
              {el.mobile}
            </td>
          </tr>
        );
        tData.push(r1);
      });
    }

    return tData;
  };

  return (
    <PageWrapper title={key ? key : "New Nominal"}>
      <div className="row card p-3">
        {tabVal === 1 ? (
          <div className="row">
            <div className="col-12 col-md-2 mb-3">
              <Select
                label={"Going From"}
                data={accessData && accessData.fromPlaces}
                value={payload.fromPlace}
                onChange={(val) => {
                  setPayload({ ...payload, fromPlace: val, place: val });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mb-3">
              <Select
                label={"Going To"}
                data={accessData && accessData.toPlaces}
                value={payload.toPlace}
                onChange={(val) => {
                  setPayload({ ...payload, toPlace: val });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mb-3">
              <DateInput
                label={"From Date"}
                value={payload.fromDate}
                onChange={(val) => {
                  setPayload({ ...payload, fromDate: val, toDate: val });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mb-3">
              <DateInput
                label={"To Date"}
                value={payload.toDate}
                minDate={payload.fromDate}
                onChange={(val) => {
                  setPayload({ ...payload, toDate: val });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mb-3">
              <NumInput
                label={"Sewa Days"}
                value={payload.sewaDays}
                onChange={(val) => {
                  if (Number(val) >= 0) {
                    setPayload({ ...payload, sewaDays: val });
                  }
                }}
              />
            </div>
            <div className="col-12 col-md-2 mb-3">
              <Select
                label={"Sewa Department"}
                value={payload.department}
                data={policies && policies.sewaDepartments}
                onChange={(val) => {
                  setPayload({ ...payload, department: val });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mb-3">
              <Select
                label={"Vehicle Type"}
                value={payload.vehicleType}
                data={accessData && accessData.vehicleTypes}
                onChange={(val) => {
                  setPayload({ ...payload, vehicleType: val });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mb-3">
              <TextInput
                label={"Vehicle Number"}
                value={payload.vehicleNumber}
                onChange={(val) => {
                  setPayload({ ...payload, vehicleNumber: val.toUpperCase() });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mb-3">
              <TextInput
                label={"Driver Name"}
                value={payload.driverName}
                onChange={(val) => {
                  setPayload({ ...payload, driverName: val });
                }}
              />
            </div>
            <div className="col-12 text-right">
              {/* <button
                className="btn btn-theme"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  if (payload.fromPlace === "") {
                    toast.warning("Please select from place");
                  } else if (payload.toPlace === "") {
                    toast.warning("Please select to place");
                  } else if (payload.fromDate === "") {
                    toast.warning("Please select from date");
                  } else if (payload.toDate === "") {
                    toast.warning("Please select to date");
                  } else if (payload.department === "") {
                    toast.warning("Please select department");
                  } else if (payload.sewaDays === "") {
                    toast.warning("Please select sewa days");
                  } else {
                    saveNominalService(payload).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          let ref = res.data.data;
                          toast.success(res.data.msg + " with ref: " + ref);
                          ref = ref.replaceAll("/", "-");
                          setPayload(defaultPayload);
                          setTabVal(1);
                          setSelectedData([]);
                          navigate(`/nominals/print/${ref}`);
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
                Save without Sewadars
              </button> */}
              <button
                className="btn btn-theme"
                onClick={() => {
                  if (payload.fromPlace === "") {
                    toast.warning("Please select from place");
                  } else if (payload.toPlace === "") {
                    toast.warning("Please select to place");
                  } else if (payload.fromDate === "") {
                    toast.warning("Please select from date");
                  } else if (payload.toDate === "") {
                    toast.warning("Please select to date");
                  } else if (payload.department === "") {
                    toast.warning("Please select department");
                  } else {
                    setTabVal(2);
                  }
                }}
              >
                Add Sewadars
              </button>
            </div>
          </div>
        ) : null}
        {tabVal === 2 ? (
          <div className="row">
            <div className="col-12 col-md-2 mb-3">
              <Select
                label={"Satsang Ghar"}
                value={place}
                data={accessData && accessData.fromPlaces2}
                onChange={(val) => {
                  getAllSewadarsService({
                    satsangGhar: val,
                    department: "",
                  }).then((res) => {
                    if (res.status === 200) {
                      setPlace(val);
                      let data = res.data;
                      data.forEach((el) => {
                        if (
                          selectedData.findIndex(
                            (x) => x.badge === el.badge
                          ) !== -1
                        ) {
                          el.selected = true;
                        }
                      });
                      setReport(res.data);
                    } else {
                      toast.error("Something went wrong.");
                    }
                  });
                }}
              />
            </div>
            <div className="col-12 col-md-2 mb-3">
              <TextInput
                label={"Search"}
                value={searchString}
                placeholder="Search"
                onChange={(val) => {
                  setSearchString(val);
                }}
              />
            </div>
            <div className="col-12 col-md-8"></div>
            <div className="col-12 col-md-6">
              <h4 className="mb-0 mt-2">
                {selectedData.length} sewadars selected
              </h4>
            </div>
            <div className="col-12 col-md-6 text-right">
              <button
                className="btn btn-theme"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  getAllSewadarsService({
                    satsangGhar: place,
                    department: "",
                  }).then((res) => {
                    if (res.status === 200) {
                      // setPlace(val);
                      let data = res.data;
                      data.forEach((el) => {
                        if (
                          selectedData.findIndex(
                            (x) => x.badge === el.badge
                          ) !== -1
                        ) {
                          el.selected = true;
                        }
                      });
                      setReport(res.data);
                    } else {
                      toast.error("Something went wrong.");
                    }
                  });
                }}
              >
                {"Refresh"}
              </button>
              <button
                className="btn btn-theme"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setTabVal(1);
                }}
              >
                Back
              </button>
              {/* {selectedData.length > 0 ? ( */}
              <button
                className="btn btn-theme"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setTabVal(3);
                }}
              >
                Next
              </button>
              {/* // ) : null} */}
              <a
                href="/nominals/add-sewadar"
                target="_blank"
                className="btn btn-theme"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setTabVal(1);
                }}
              >
                Add New Sewadar
              </a>
            </div>
            <div
              className="col-12"
              style={{ overflowX: "auto", padding: "15px" }}
            >
              <table
                style={{
                  width: "100%",
                }}
              >
                <thead>
                  <tr
                    className="table-row"
                    style={{ background: "#8b6c00", color: "white" }}
                  >
                    <th
                      className="table-data"
                      style={{
                        fontSize: tableFont.head,
                      }}
                    ></th>
                    <th
                      className="table-data"
                      style={{
                        fontSize: tableFont.head,
                      }}
                    >
                      Badge
                    </th>
                    <th
                      className="table-data"
                      style={{
                        fontSize: tableFont.head,
                      }}
                    >
                      Name
                    </th>
                    <th
                      className="table-data"
                      style={{
                        fontSize: tableFont.head,
                      }}
                    >
                      Father/Husband
                    </th>
                    <th
                      className="table-data"
                      style={{
                        fontSize: tableFont.head,
                      }}
                    >
                      Gender
                    </th>
                    <th
                      className="table-data"
                      style={{
                        fontSize: tableFont.head,
                      }}
                    >
                      Mobile
                    </th>
                  </tr>
                </thead>
                <tbody>{generateReport()}</tbody>
              </table>
            </div>
            <div className="col-12 col-md-6">
              <h4 className="mb-0 mt-2">
                {selectedData.length} sewadars selected
              </h4>
            </div>
            <div className="col-12 col-md-6 text-right">
              <button
                className="btn btn-theme"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setTabVal(1);
                }}
              >
                Back
              </button>
              {/* {selectedData.length > 0 ? ( */}
              <button
                className="btn btn-theme"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setTabVal(3);
                }}
              >
                Next
              </button>
              {/* // ) : null} */}
            </div>
          </div>
        ) : null}

        {tabVal === 3 ? (
          <div className="row">
            <div className="col-4 col-md-3">
              <h3 style={{ marginTop: "28px" }}>
                Male : {selectedData.filter((f) => f.gender === "Male").length}
              </h3>
            </div>
            <div className="col-4 col-md-3">
              <h3 style={{ marginTop: "28px" }}>
                Female :{" "}
                {selectedData.filter((f) => f.gender === "Female").length}
              </h3>
            </div>
            <div className="col-4 col-md-3">
              <h3 style={{ marginTop: "28px" }}>
                Total : {selectedData.length}
              </h3>
            </div>
            <div className="col-12 col-md-3">
              <NumInput
                label="Sewa Days"
                value={payload.sewaDays}
                onChange={(val) => {
                  if (Number(val) > 0) {
                    setPayload({ ...payload, sewaDays: val });
                  }
                }}
              />
            </div>
            <div className="col-12 mt-3">
              <div
                className="col-12"
                style={{ overflowX: "auto", padding: "15px" }}
              >
                <h4>Select Jathedar</h4>

                <table
                  style={{
                    width: "100%",
                  }}
                >
                  <thead>
                    <tr
                      className="table-row"
                      style={{ background: "#8b6c00", color: "white" }}
                    >
                      <th
                        className="table-data"
                        style={{
                          fontSize: tableFont.head,
                        }}
                      ></th>
                      <th
                        className="table-data"
                        style={{
                          fontSize: tableFont.head,
                        }}
                      >
                        Badge
                      </th>
                      <th
                        className="table-data"
                        style={{
                          fontSize: tableFont.head,
                        }}
                      >
                        Name
                      </th>
                      <th
                        className="table-data"
                        style={{
                          fontSize: tableFont.head,
                        }}
                      >
                        Father/Husband
                      </th>
                      <th
                        className="table-data"
                        style={{
                          fontSize: tableFont.head,
                        }}
                      >
                        Gender
                      </th>
                      <th
                        className="table-data"
                        style={{
                          fontSize: tableFont.head,
                        }}
                      >
                        Mobile
                      </th>
                    </tr>
                  </thead>
                  <tbody>{generateReport2()}</tbody>
                </table>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <h4 className="mb-0 mt-2">
                {selectedData.length} sewadars selected
              </h4>
            </div>
            <div className="col-12 col-md-6 text-right">
              <button
                className="btn btn-theme"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setTabVal(2);
                }}
              >
                Back
              </button>
              {/* {selectedData.length > 0 ? ( */}
              <button
                className="btn btn-theme"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  let payL = payload;
                  selectedData.forEach((el) => {
                    payL.sewadars.push(el.badge);
                  });
                  payL.male = selectedData.filter(
                    (f) => f.gender === "Male"
                  ).length;
                  payL.female = selectedData.filter(
                    (f) => f.gender === "Female"
                  ).length;
                  payL.incharge =
                    selectedData.length > 0 ? selectedData[0].badge : "";
                  if (payL.sewaDays === "") {
                    toast.warning("Please select sewa days");
                  } else {
                    if (key) {
                      // updateNominalService(payL).then((res) => {
                      //   if (res.status === 200) {
                      //     if (res.data.status === "success") {
                      //       toast.success(res.data.msg);
                      //       // setPayload(defaultPayload);
                      //       setTabVal(1);
                      //       setSelectedData([]);
                      //       navigate(`/nominals/print/${key}`);
                      //     } else {
                      //       toast.error(res.data.msg);
                      //     }
                      //   } else {
                      //     toast.error("Something went wrong.");
                      //   }
                      // });
                    } else {
                      // saveNominalService(payL).then((res) => {
                      //   if (res.status === 200) {
                      //     if (res.data.status === "success") {
                      //       let ref = res.data.data;
                      //       toast.success(res.data.msg + " with ref: " + ref);
                      //       ref = ref.replaceAll("/", "-");
                      //       setPayload(defaultPayload);
                      //       setTabVal(1);
                      //       setSelectedData([]);
                      //       navigate(`/nominals/print/${ref}`);
                      //     } else {
                      //       toast.error(res.data.msg);
                      //     }
                      //   } else {
                      //     toast.error("Something went wrong.");
                      //   }
                      // });
                    }
                  }
                }}
              >
                {key ? "Update Nominal" : "Save Nominal"}
              </button>
              {/* ) : null} */}
            </div>
          </div>
        ) : null}
      </div>
    </PageWrapper>
  );
};

export default Student;
