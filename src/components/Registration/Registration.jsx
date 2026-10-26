import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import PageWrapper from "../../hoc/PageWrapper";
import {
  addNewPatientService,
  generateOpdTokenService,
  getPatientsByMobileService,
} from "../../services/HTTPService";
import { NumInput, Select, TextInput } from "../Shared/Elements";

const defaultPatientForm = {
  name: "",
  age: "",
  gender: "",
  address: "",
};

const defaultVitalsForm = {
  bloodPressure: "",
  bloodSugar: "",
  height: "",
  weight: "",
  temperature: "",
  bloodOxygen: "",
  pulse: "",
  receptionRemarks: "",
};

const Registration = () => {
  const [mobile, setMobile] = useState("");
  const [registeredPatients, setRegisteredPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientForm, setPatientForm] = useState(defaultPatientForm);
  const [generatedToken, setGeneratedToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenLoading, setIsTokenLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("select");
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [vitalsForm, setVitalsForm] = useState(defaultVitalsForm);
  const [pendingPatient, setPendingPatient] = useState(null);

  const matchingPatients = registeredPatients;
  const hasMatchingPatients = matchingPatients.length > 0;

  const getPatientSelectionKey = (patient) => {
    const uhid = getPatientUhid(patient);
    return String(uhid !== "-" ? uhid : patient?.mobile || "");
  };

  const getApiStatus = (response) =>
    response?.data?.status ?? response?.status ?? response?.response ?? "";

  const getApiMessage = (response) =>
    response?.data?.msg ?? response?.data?.message ?? response?.msg ?? response?.message ?? "";

  const getApiPayload = (response) =>
    response?.data?.data ??
    (response?.data?.result ??
      (response?.data ??
        (response?.result ?? response ?? {})));

  const getPatientUhid = (patient) =>
    patient?.uhid ||
    patient?.uhidNo ||
    patient?.uhidNumber ||
    patient?.patientUhid ||
    patient?.patientUHID ||
    patient?.uhid_number ||
    "-";

  const extractPatientUhid = (response, fallback = "") => {
    const payload = getApiPayload(response);
    const message = [
      payload?.msg,
      payload?.message,
      payload?.result?.msg,
      payload?.result?.message,
      payload?.data?.msg,
      payload?.data?.message,
      getApiMessage(response),
    ]
      .filter(Boolean)
      .join(" ");

    const messageUhid = String(message).match(/UHID\s*[:=]\s*(\d{8})/i)
      || String(message).match(/(?:uhid|patient\s*uhid)[^\d]*(\d{8})/i)
      || String(message).match(/\b(\d{8})\b/);

    if (messageUhid && messageUhid[1]) {
      return messageUhid[1];
    }

    const scanForUhid = (value) => {
      if (!value || typeof value === "string") {
        const match = String(value || "").match(/\b(\d{8})\b/);
        return match ? match[1] : "";
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          const found = scanForUhid(item);
          if (found) return found;
        }
        return "";
      }

      if (typeof value === "object") {
        for (const key of Object.keys(value)) {
          if (/uhid|uhidno|uhidnumber|patientuhid|uhid_number/i.test(key)) {
            const found = scanForUhid(value[key]);
            if (found) return found;
          }

          const nested = scanForUhid(value[key]);
          if (nested) return nested;
        }
      }

      return "";
    };

    const nestedUhid = scanForUhid(payload);
    if (nestedUhid) {
      return nestedUhid;
    }

    return (
      payload?.uhid ||
      payload?.uhidNo ||
      payload?.uhidNumber ||
      payload?.patientUhid ||
      payload?.patientUHID ||
      payload?.uhid_number ||
      fallback ||
      ""
    );
  };

  const getLastOpdDate = (patient) =>
    patient?.lastOpdDate ||
    patient?.lastOPDDate ||
    patient?.lastVisitDate ||
    patient?.lastVisit ||
    patient?.opdDate ||
    patient?.opd_date ||
    "-";

  const extractTokenFromResponse = (response) => {
    const payload = getApiPayload(response);
    const directMessage = getApiMessage(response) || payload?.msg || payload?.message || payload?.token || "";

    if (directMessage !== "" && directMessage !== null && directMessage !== undefined) {
      const numberMatch = String(directMessage).match(/(\d+)/);
      if (numberMatch && numberMatch[1]) {
        return String(numberMatch[1]);
      }
      return String(directMessage);
    }

    return (
      payload?.token ||
      payload?.tokenNo ||
      payload?.tokenNumber ||
      payload?.generatedToken ||
      payload?.result?.token ||
      payload?.result?.tokenNo ||
      payload?.data?.token ||
      ""
    );
  };

  const requestToken = (params) => {
    setIsTokenLoading(true);
    return generateOpdTokenService(params)
      .then((res) => {
        const status = getApiStatus(res);
        const msg = getApiMessage(res);

        if (status !== "success") {
          throw new Error(msg || "Unable to generate token from server.");
        }

        const token = extractTokenFromResponse(res);

        if (!token) {
          throw new Error(msg || "Token not returned from server.");
        }

        setGeneratedToken(token);
        toast.success(msg || `OPD Token ${token} generated successfully.`);
        return token;
      })
      .catch((error) => {
        const errMessage = error?.message || getApiMessage(error) || "Unable to generate token from server.";
        toast.error(errMessage);
        throw error;
      })
      .finally(() => {
        setIsTokenLoading(false);
      });
  };

  const handleVitalsChange = (field, value) => {
    setVitalsForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getPatientDetails = () => {
    if (mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    setGeneratedToken("");
    setSelectedPatientId("");
    setActiveTab("select");

    getPatientsByMobileService({ mobile })
      .then((res) => {
        const status = getApiStatus(res);
        const msg = getApiMessage(res);

        if (status === "success") {
          const apiData = getApiPayload(res) || [];
          const patients = Array.isArray(apiData) ? apiData : [];
          setRegisteredPatients(patients);

          if (patients.length === 0) {
            setActiveTab("new");
            setSelectedPatientId("");
            setPatientForm(defaultPatientForm);
            toast.info(msg || "No patient found for this mobile number.");
          } else {
            setActiveTab("select");
          }
          return;
        }

        setRegisteredPatients([]);
        setActiveTab("new");
        toast.error(msg || "Unable to fetch patient details.");
      })
      .catch(() => {
        setRegisteredPatients([]);
        toast.error("Unable to fetch patient details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (mobile.length !== 10) {
      setRegisteredPatients([]);
      setSelectedPatientId("");
      setGeneratedToken("");
      setActiveTab("select");
      return;
    }
  }, [mobile]);

  const handleMobileChange = (value) => {
    const nextValue = String(value).replace(/[^0-9]/g, "").slice(0, 10);
    setMobile(nextValue);
    setSelectedPatientId("");
    setGeneratedToken("");
    setPatientForm(defaultPatientForm);
  };

  const handleMobileKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (mobile.length === 10) {
        getPatientDetails();
      }
    }
  };

  const handlePatientFormChange = (field, value) => {
    setPatientForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateToken = () => {
    if (!mobile.trim()) {
      toast.error("Please enter mobile number.");
      return;
    }

    const isNewPatientFlow = activeTab === "new" || matchingPatients.length === 0;

    if (!isNewPatientFlow) {
      if (!selectedPatientId) {
        toast.error("Please select an existing patient.");
        return;
      }

      const patient = registeredPatients.find(
        (item) => String(getPatientUhid(item) || item.mobile) === String(selectedPatientId)
      );

      if (!patient) {
        toast.error("Selected patient not found.");
        return;
      }

      setPendingPatient(patient);
      setVitalsForm(defaultVitalsForm);
      setShowVitalsModal(true);
      return;
    }

    if (
      patientForm.name.trim() === "" ||
      patientForm.age === "" ||
      patientForm.gender === "" ||
      patientForm.address.trim() === ""
    ) {
      toast.error("Please fill all patient details.");
      return;
    }

    const payload = {
      mobile,
      name: patientForm.name.trim(),
      age: Number(patientForm.age),
      gender: patientForm.gender,
      address: patientForm.address.trim(),
    };

    addNewPatientService(payload)
      .then((res) => {
        const status = getApiStatus(res);
        const msg = getApiMessage(res);

        if (status !== "success") {
          toast.error(msg || "Unable to register patient.");
          return;
        }

        const result = getApiPayload(res) || {};
        const createdUhid = extractPatientUhid(
          res,
          result?.uhid || result?.uhidNo || result?.uhidNumber || ""
        );

        if (!createdUhid) {
          toast.error(msg || "UHID not returned from registration response.");
          return;
        }

        toast.success(msg || "Patient registered successfully.");

        const newPatient = {
          ...payload,
          uhid: createdUhid,
        };

        setRegisteredPatients((prev) => [newPatient, ...prev]);
        setSelectedPatientId(String(newPatient.uhid || newPatient.mobile));
        setPatientForm(defaultPatientForm);
        setPendingPatient(newPatient);
        setVitalsForm(defaultVitalsForm);
        setShowVitalsModal(true);
      })
      .catch(() => {
        toast.error("Unable to register patient.");
      });
  };

  const handleSubmitVitalsAndGenerateToken = () => {
    if (!pendingPatient) {
      toast.error("Patient details are missing.");
      return;
    }

    const patientPayload = {
      uhid: getPatientUhid(pendingPatient),
      mobile,
      name: pendingPatient.name,
      ...vitalsForm,
    };

    requestToken(patientPayload)
      .then(() => {
        setShowVitalsModal(false);
        setVitalsForm(defaultVitalsForm);
      })
      .catch(() => {
        // toast is already handled inside requestToken based on response status/msg
      });
  };

  return (
    <PageWrapper title="Registration">
      <div className="card">
        <div className="card-body">
          <div className="row g-3 align-items-end">
                      <div className="col-12 col-md-3"></div>

            <div className="col-12 col-md-4 col-lg-4">
              <TextInput
                label="Mobile Number"
                placeholder="Enter mobile number"
                value={mobile}
                maxLength={10}
                pattern={(val) => /^[0-9]*$/.test(val)}
                onChange={handleMobileChange}
                onKeyDown={handleMobileKeyDown}
                autoFocus
              />
            </div>


            <div className="col-12 col-md-2 col-lg-2">
              <button
                type="button"
                className="btn btn-theme w-100"
                onClick={getPatientDetails}
                disabled={mobile.length !== 10 || isLoading}
              >
                {isLoading ? "Fetching..." : "Search"}
              </button>
            </div>
                      <div className="col-12 col-md-3"></div>

          </div>

          {mobile.length === 10 && isLoading && (
            <div className="mt-4 text-muted">Searching patient details...</div>
          )}

          {mobile.length === 10 && (
            <div className="mt-4">
              <div className="nav nav-tabs flex-wrap mb-3">
                {hasMatchingPatients && (
                  <button
                    type="button"
                    className={`nav-link ${activeTab === "select" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("select");
                      setPatientForm(defaultPatientForm);
                    }}
                  >
                    Select Patient
                  </button>
                )}
                <button
                  type="button"
                  className={`nav-link ${activeTab === "new" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("new");
                    setSelectedPatientId("");
                  }}
                >
                  New Patient
                </button>
              </div>

              {activeTab === "select" && hasMatchingPatients && (
                <div>
                  <div className="row g-3">
                    {matchingPatients.map((patient) => {
                      const patientKey = getPatientSelectionKey(patient);
                      const isSelected = selectedPatientId === patientKey;

                      return (
                        <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" key={patientKey}>
                          <label
                            className={`list-group-item list-group-item-action h-100 ${
                              isSelected ? "active shadow border-primary" : ""
                            }`}
                            style={{
                              cursor: "pointer",
                              borderWidth: isSelected ? "2px" : "1px",
                              background: isSelected ? "#eaf3ff" : "#ffffff",
                              transform: isSelected ? "translateY(-1px)" : "none",
                              transition: "all 0.2s ease-in-out",
                              minHeight: "100px",
                            }}
                          >
                            <input
                              type="radio"
                              className="d-none"
                              name="selectedPatient"
                              checked={isSelected}
                              onChange={() => setSelectedPatientId(patientKey)}
                            />
                            <div>
                                      <strong>{patient.name}  <span style={{ color: "#007bff" }}>{patient.age || "-"}/{patient.gender.charAt(0).toUpperCase()}</span> </strong>
                              <div>
                                <div>
                                      <small style={{color: "#00730b" }}>UHID: {getPatientUhid(patient)}</small>

                                </div>
                                <small>Last OPD: {getLastOpdDate(patient)}</small>
                              </div>
                              <small>{patient.address || "-"}</small>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  {selectedPatientId && (
                    <div className="mt-3">
                      <button
                        type="button"
                        className="btn btn-primary w-100 w-md-auto"
                        onClick={handleGenerateToken}
                        disabled={isTokenLoading}
                      >
                        {isTokenLoading ? "Generating..." : "Generate OPD Token"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "new" && (
                <div>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <TextInput
                        label="Name"
                        placeholder="Enter patient name"
                        value={patientForm.name}
                        onChange={(val) => handlePatientFormChange("name", val)}
                      />
                    </div>

                    <div className="col-12 col-md-3">
                      <NumInput
                        label="Age"
                        placeholder="Age"
                        value={patientForm.age}
                        onChange={(val) => handlePatientFormChange("age", val)}
                      />
                    </div>

                    <div className="col-12 col-md-3">
                      <Select
                        label="Gender"
                        value={patientForm.gender}
                        data={[
                          { value: "Male", name: "Male" },
                          { value: "Female", name: "Female" },
                          { value: "Other", name: "Other" },
                        ]}
                        onChange={(val) => handlePatientFormChange("gender", val)}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={patientForm.address}
                        onChange={(e) => handlePatientFormChange("address", e.target.value)}
                        placeholder="Enter patient address"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn btn-success w-100 w-md-auto"
                      onClick={handleGenerateToken}
                      disabled={isLoading || isTokenLoading}
                    >
                      {isTokenLoading ? "Registering..." : "Register"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {generatedToken && (
            <div className="alert alert-success mb-0 py-2 px-3 mt-3">
              OPD Token: <strong>{generatedToken}</strong>
            </div>
          )}
        </div>
      </div>

      <Modal
        show={showVitalsModal}
        onHide={() => {
          setShowVitalsModal(false);
          setVitalsForm(defaultVitalsForm);
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Vitals Details
            {pendingPatient && (
              <span className="ms-2 text-muted">
                - {pendingPatient.name || "Patient"} ({getPatientUhid(pendingPatient) || "UHID"})
              </span>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <TextInput
                label="Blood Pressure"
                placeholder="e.g. 120/80"
                value={vitalsForm.bloodPressure}
                onChange={(val) => handleVitalsChange("bloodPressure", val)}
              />
            </div>

            <div className="col-12 col-md-6">
              <TextInput
                label="Blood Sugar"
                placeholder="e.g. 90 mg/dL"
                value={vitalsForm.bloodSugar}
                onChange={(val) => handleVitalsChange("bloodSugar", val)}
              />
            </div>

            <div className="col-12 col-md-6">
              <NumInput
                label="Height"
                placeholder="cm"
                value={vitalsForm.height}
                onChange={(val) => handleVitalsChange("height", val)}
              />
            </div>

            <div className="col-12 col-md-6">
              <NumInput
                label="Weight"
                placeholder="kg"
                value={vitalsForm.weight}
                onChange={(val) => handleVitalsChange("weight", val)}
              />
            </div>

            <div className="col-12 col-md-6">
              <NumInput
                label="Temperature"
                placeholder="°C"
                value={vitalsForm.temperature}
                onChange={(val) => handleVitalsChange("temperature", val)}
              />
            </div>

            <div className="col-12 col-md-6">
              <NumInput
                label="Blood Oxygen"
                placeholder="%"
                value={vitalsForm.bloodOxygen}
                onChange={(val) => handleVitalsChange("bloodOxygen", val)}
              />
            </div>

            <div className="col-12 col-md-6">
              <NumInput
                label="Pulse"
                placeholder="bpm"
                value={vitalsForm.pulse}
                onChange={(val) => handleVitalsChange("pulse", val)}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Reception Remarks</label>
              <textarea
                className="form-control"
                rows={3}
                value={vitalsForm.receptionRemarks}
                onChange={(e) => handleVitalsChange("receptionRemarks", e.target.value)}
                placeholder="Enter reception remarks"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex-column flex-md-row">
          <button
            type="button"
            className="btn btn-secondary w-100 w-md-auto"
            onClick={() => {
              setShowVitalsModal(false);
              setVitalsForm(defaultVitalsForm);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary w-100 w-md-auto"
            onClick={handleSubmitVitalsAndGenerateToken}
            disabled={isTokenLoading}
          >
            {isTokenLoading ? "Generating..." : "Generate"}
          </button>
        </Modal.Footer>
      </Modal>
    </PageWrapper>
  );
};

export default Registration;
