import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getIdValidation,
  logout,
  setCompanyData,
  setIdValidation,
} from "../../services/AuthService";
import {
  updateSettingsService,
  getSettingsService,
} from "../../services/HTTPService";

export default function Settings() {
  const defaultSettings = {
    title: "",
    address: "",
    bank: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    upi: "",
    district: "",
    state: "",
    gstin: "",
    stateCode: "",
    email: "",
    image: "",
    url: "",
    billPrefix: "",
    currentSession: "",
    reportTyprMarked: false,
  };

  const defaultVillagePayload = {
    state: "",
    district: "",
    village: "",
    tehsil: "",
    tehsilName: "",
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [growerIdValidation, setGrowerIdValidation] = useState(
    JSON.parse(getIdValidation())
  );
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [villagePayload, setVillagePayload] = useState(defaultVillagePayload);

  const getSettings = () => {
    if (loading === true) {
      setLoading(false);
      getSettingsService().then((response) => {
        if (response.status === 200) {
          setSettings(response.data);
          let idVal = getIdValidation();
          setGrowerIdValidation(idVal);
        } else {
          toast.error(response.data.msg);
          if (response.data.status === "logout") {
            logout();
          }
        }
      });
    }
  };

  const getStates = () => {
    if (loading === true) {
      setLoading(false);
      // getAllStatesService().then((response) => {
      //   if (response.status === 200) {
      //     setStates(response.data);
      //   } else {
      //     toast.error(response.data.msg);
      //     if (response.data.status === "logout") {
      //       logout();
      //     }
      //     window.history.back();
      //   }
      // });
    }
  };
  useEffect(() => {
    getSettings();
    getStates();
  });

  const reportTypeChanged = () => {
    let val = settings.reportTypeMarked;
    val = !val;
    updateSettings("reportTypeMarked", val);
    checkValidation();
  };
  const idValidationChanged = () => {
    let val = growerIdValidation;
    val = !val;
    setIdValidation(val);
    setGrowerIdValidation(val);
  };
  const emailChanged = (event) => {
    let val = event.target.value;
    updateSettings("email", val);
  };
  // const imageChanged = (event) => {
  //   let val = event.target.value;
  //   updateSettings("image", val);
  // };
  const billPrefixChanged = (event) => {
    let val = event.target.value;
    updateSettings("billPrefix", val);
  };
  const addressChanged = (event) => {
    let val = event.target.value;
    updateSettings("address", val);
  };
  const stateChanged = (event) => {
    let val = event.target.value;
    updateSettings("state", val);
  };
  const districtChanged = (event) => {
    let val = event.target.value;
    updateSettings("district", val);
  };
  const gstinChanged = (event) => {
    let val = event.target.value;
    updateSettings("gstin", val);
  };
  const stateCodeChanged = (event) => {
    let val = event.target.value;
    updateSettings("stateCode", val);
  };
  const bankChanged = (event) => {
    let val = event.target.value;
    updateSettings("bank", val);
  };
  const accountNumberChanged = (event) => {
    let val = event.target.value;
    updateSettings("accountNumber", val);
  };
  const ifscChanged = (event) => {
    let val = event.target.value;
    updateSettings("ifsc", val);
  };
  const branchChanged = (event) => {
    let val = event.target.value;
    updateSettings("branch", val);
  };
  const upiChanged = (event) => {
    let val = event.target.value;
    updateSettings("upi", val);
  };
  const sessionChanged = (event) => {
    let val = event.target.value;
    updateSettings("currentSession", val);
  };
  const updateSettings = (key, value) => {
    let data = settings;
    data[key] = value;
    setSettings({ ...data });
  };

  const villageStateChanged = (e) => {
    let val = e.target.value;
    updateVillage("state", val);
    if (val !== "") {
      setDistricts([]);
      let selectedDistricts =
        states[
          parseInt(
            states.findIndex((obj) => obj.name.toString() === val.toString())
          )
        ].districts;
      setDistricts(selectedDistricts);
    }
  };

  const villageDistrictChanged = (e) => {
    let val = e.target.value;
    updateVillage("district", val);
    if (val !== "") {
      // getTehsilsService(val).then((res) => {
      //   setTehsils(res.data);
      // });
    }
  };

  const villageTehsilChanged = (e) => {
    let val = e.target.value;
    if (val !== "") {
      updateVillage("tehsil", val);
      if (val !== "other") {
        updateVillage("tehsilName", val);
      }
    }
  };

  const villageTehsilNameChanged = (e) => {
    let val = e.target.value;
    updateVillage("tehsilName", val);
  };

  const villageChanged = (e) => {
    let val = e.target.value;
    updateVillage("village", val);
  };

  const updateVillage = (key, value) => {
    let data = villagePayload;
    data[key] = value;
    setVillagePayload({ ...data });
  };

  const checkValidation = () => {
    if (settings.email === "") {
      toast.error("Email is required");
    } else if (settings.image === "") {
      toast.error("Image path is required");
    } else if (settings.billPrefix === "") {
      toast.error("Bill Prefix is required");
    } else if (settings.address === "") {
      toast.error("Address is required");
    } else if (settings.district === "") {
      toast.error("District is required");
    } else if (settings.state === "") {
      toast.error("State field is required");
    } else {
      updateSettingsService(settings).then((res) => {
        if (res.data.status === "success") {
          setCompanyData(JSON.stringify(settings));
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      });
    }
  };

  const addVillage = () => {
    if (villagePayload.district === "") {
      toast.error("Please select district");
    } else if (villagePayload.tehsilName === "") {
      toast.error("Please select/enter tehsil name.");
    } else if (villagePayload.village === "") {
      toast.error("Please enter village name");
    } else {
      // addVillageService(villagePayload).then((res) => {
      //   if (res.data.status === "success") {
      //     toast.success(res.data.msg);
      //     let payL=villagePayload;
      //     if(villagePayload.tehsil==='other'){
      //       payL.tehsil="";
      //       payL.tehsilName="";
      //     }
      //     payL.village='';
      //     setVillagePayload({...payL});
      //   } else {
      //     toast.error(res.data.msg);
      //   }
      // });
    }
  };
  return (
    <div className="app-content pt-3 p-md-3 p-lg-4">
      <div className="container-xl">
        <h1 className="app-page-title">Settings</h1>
        <hr className="mb-4" />
        <div className="row g-4 settings-section">
          <div className="col-12 col-md-4">
            <h3 className="section-title">Company</h3>
            <div className="section-intro">Company's primary details</div>
          </div>
          <div className="col-12 col-md-8">
            <div className="app-card app-card-settings shadow-sm p-4">
              <div className="app-card-body">
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.title}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    Website Url
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.url}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    Company's Logo URL
                  </label>
                  <input
                    type="text"
                    value={settings.image}
                    className="form-control"
                    // onChange={imageChanged}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    Company's E-mail
                  </label>
                  <input
                    type="text"
                    value={settings.email}
                    className="form-control"
                    onChange={emailChanged}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    Current Session (1st Oct - 30th Sep)
                  </label>
                  <input
                    type="text"
                    value={settings.currentSession}
                    className="form-control"
                    placeholder="YYYY-YYYY"
                    minLength="9"
                    maxLength="9"
                    onChange={sessionChanged}
                  />
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={settings.reportTypeMarked ? true : false}
                    onChange={reportTypeChanged}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="settings-switch-1"
                  >
                    Show reports for marked seed grower only.
                  </label>
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={
                      growerIdValidation === true ||
                      growerIdValidation === "true"
                        ? true
                        : false
                    }
                    onChange={idValidationChanged}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="settings-switch-1"
                  >
                    Seed Grower Id Validation.
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="mb-4" />
        <div className="row g-4 settings-section">
          <div className="col-12 col-md-4">
            <h3 className="section-title">Billing</h3>
            <div className="section-intro">Company's billing details</div>
          </div>
          <div className="col-12 col-md-8">
            <div className="app-card app-card-settings shadow-sm p-4">
              <div className="app-card-body">
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    Bill Prefix
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.billPrefix}
                    onChange={billPrefixChanged}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.address}
                    onChange={addressChanged}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    District
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.district}
                    onChange={districtChanged}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.state}
                    onChange={stateChanged}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="mb-4" />
        <div className="row g-4 settings-section">
          <div className="col-12 col-md-4">
            <h3 className="section-title">Tax Details</h3>
            <div className="section-intro">Company's TAX details</div>
          </div>
          <div className="col-12 col-md-8">
            <div className="app-card app-card-settings shadow-sm p-4">
              <div className="app-card-body">
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.gstin}
                    onChange={gstinChanged}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    State Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.stateCode}
                    onChange={stateCodeChanged}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="mb-4" />
        <div className="row g-4 settings-section">
          <div className="col-12 col-md-4">
            <h3 className="section-title">Bank Details</h3>
            <div className="section-intro">Company's Bank account details</div>
          </div>
          <div className="col-12 col-md-8">
            <div className="app-card app-card-settings shadow-sm p-4">
              <div className="app-card-body">
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.bank}
                    onChange={bankChanged}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    Account Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.accountNumber}
                    onChange={accountNumberChanged}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    Branch
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.branch}
                    onChange={branchChanged}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    IFS Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.ifsc}
                    onChange={ifscChanged}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    UPI
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.upi}
                    onChange={upiChanged}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="mb-3 mt-3" style={{ float: "right" }}>
              <button className="btn app-btn-primary" onClick={checkValidation}>
                Update Settings
              </button>
            </div>
          </div>
        </div>
        <hr className="mb-4" />
        <div className="row g-4 settings-section">
          <div className="col-12 col-md-4">
            <h3 className="section-title">New Village</h3>
            <div className="section-intro">Add new Tehsil and Village</div>
          </div>
          <div className="col-12 col-md-8">
            <div className="app-card app-card-settings shadow-sm p-4">
              <div className="app-card-body">
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    State
                  </label>
                  <select
                    className="form-select"
                    onChange={villageStateChanged}
                    value={villagePayload.state}
                  >
                    <option value="">Select State</option>
                    {states &&
                      states.map((state, key) => {
                        return (
                          <option key={key} value={state.name}>
                            {state.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    District
                  </label>
                  <select
                    className="form-select"
                    onChange={villageDistrictChanged}
                    value={villagePayload.district}
                  >
                    <option value="">Select District</option>
                    {districts &&
                      districts.map((district, key) => {
                        return (
                          <option key={key} value={district.districtCode}>
                            {district.district}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    Tehsil
                  </label>
                  {villagePayload.tehsil !== "other" ? (
                    <select
                      className="form-select"
                      onChange={villageTehsilChanged}
                      value={villagePayload.tehsil}
                    >
                      <option value="">Select Tehsil</option>
                      {tehsils &&
                        tehsils.map((tehsil, key) => {
                          return (
                            <option key={key} value={tehsil.tehsil}>
                              {tehsil.tehsil}
                            </option>
                          );
                        })}
                      <option value="other">Not listed</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Tehsil Name"
                      value={villagePayload.tehsilName}
                      onChange={villageTehsilNameChanged}
                    />
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="setting-input-1" className="form-label">
                    Village Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Village Name"
                    className="form-control"
                    value={villagePayload.village}
                    onChange={villageChanged}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="mb-3 mt-3" style={{ float: "right" }}>
              <button className="btn app-btn-primary" onClick={addVillage}>
                Add Village
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
