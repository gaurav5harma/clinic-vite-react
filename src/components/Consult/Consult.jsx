import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import PageWrapper from "../../hoc/PageWrapper";
import { logout } from "../../services/AuthService";
import {
  getAllMedicinesServices,
  getCurrentConsultationService,
  requestPoliciesService,
  updateConsultationService,
} from "../../services/HTTPService";
import { DateInput, NumInput, Select, TextInput } from "../Shared/Elements";
import "./Consult.css";

const Consult = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [editingVitals, setEditingVitals] = useState({});
  const [consultationNotes, setConsultationNotes] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [medicineSearch, setMedicineSearch] = useState("");
  const [isSearchingMedicines, setIsSearchingMedicines] = useState(false);
  const [policies, setPolicies] = useState({});
  const [prescriptionErrors, setPrescriptionErrors] = useState({});
  const [isSavingConsultation, setIsSavingConsultation] = useState(false);

  useEffect(() => {
    getCurrentConsultationService({})
      .then((response) => {
        if (response.data?.status === "success" && response.data.patientDetails) {
          const data = response.data;
          setPatientData({
            ...data.patientDetails,
            ...data.vitals,
            consultationHistory: data.consultationHistory || [],
            updateKey: data.updateKey || data.consultationId || "",
          });
          setConsultationNotes({
            allergies: data.allergiesAndMedicalHistory?.allergies || "",
            medicalHistory:
              data.allergiesAndMedicalHistory?.medicalHistory || "",
            investigationFindings: data.investigationAndFindings || "",
            diagnosis: data.diagnosis || "",
            doctorRemarks: data.doctorRemarks || "",
            followUpDate: data.followUpDate || "",
          });

          const existingPrescription = data.prescription;
          if (Array.isArray(existingPrescription)) {
            setPrescriptions(
              existingPrescription.map((item) => ({
                medicineId: item.medicineId || item.id || "",
                medicine: item.medicine || item.name || "",
                medicineType: item.medicineType || item.type || item.baseUnit || "",
                dose: item.dose || "",
                frequency: item.frequency || "1-1-1",
                timing: item.timing || "After food",
                route: item.route || "Oral",
                duration: item.duration || "14 days",
                quantity:
                  /^as\s*directed$/i.test(String(item.dose || ""))
                    ? ""
                    : /tablet|capsule/i.test(
                          String(item.medicineType || item.type || item.baseUnit || ""),
                        )
                      ? calculatePrescriptionQuantity(
                          item.dose || "",
                          item.frequency || "1-1-1",
                          item.duration || "14 days",
                        )
                      : item.quantity || "",
                note: item.note || "",
              })),
            );
          } else {
            setPrescriptions([]);
          }
        } else {
          toast.error(
            response.data?.msg || "Unable to fetch current consultation.",
          );
        }
      })
      .catch(() => {
        toast.error("Unable to fetch current consultation.");
      });
  }, []);

  useEffect(() => {
    requestPoliciesService({
      policies: ["tabletDose", "capsuleDose", "syrupDose", "defaultDose"],
    })
      .then((response) => {
        if (response.status === 200 && response.data) {
          setPolicies(response.data.data || response.data);
        } else {
          toast.error(
            response.data?.msg || "Unable to load prescription policies.",
          );
        }
      })
      .catch(() => toast.error("Unable to load prescription policies."));
  }, []);

  useEffect(() => {
    const searchValue = medicineSearch.trim();

    if (searchValue.length < 2) {
      setMedicineOptions([]);
      setIsSearchingMedicines(false);
      return undefined;
    }

    setIsSearchingMedicines(true);
    let ignoreResult = false;

    const searchTimer = setTimeout(() => {
      getAllMedicinesServices({
        page: 1,
        rows: 20,
        sortOrder: 1,
        sortField: "name",
        globalFilter: searchValue,
      })
        .then((response) => {
          if (ignoreResult) return;
          if (response.data?.response === "success") {
            setMedicineOptions(
              Array.isArray(response.data.data) ? response.data.data : [],
            );
          } else {
            setMedicineOptions([]);
          }
        })
        .catch(() => {
          if (!ignoreResult) setMedicineOptions([]);
        })
        .finally(() => {
          if (!ignoreResult) setIsSearchingMedicines(false);
        });
    }, 300);

    return () => {
      ignoreResult = true;
      clearTimeout(searchTimer);
    };
  }, [medicineSearch]);

  const normalizeMedicineName = (name) =>
    String(name || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  const getDoseOptions = (medicineType, baseUnit) => {
    const type = String(medicineType || baseUnit || "").toLowerCase();
    let options = [];

    if (type.includes("tablet")) options = policies.tabletDose || [];
    else if (type.includes("capsule")) options = policies.capsuleDose || [];
    else if (
      type.includes("syrup") ||
      type.includes("suspension") ||
      type.includes("liquid")
    ) {
      options = policies.syrupDose || [];
    }

    if (!options.length) options = policies.defaultDose || [];
    options = Array.isArray(options) ? [...options] : [];
    const hasAsDirected = options.some((option) => {
      const value =
        typeof option === "string" ? option : option.value || option.name;
      return /^as\s*directed$/i.test(String(value || ""));
    });
    if (!hasAsDirected) options.push("As Directed");
    return options;
  };

  const addPrescription = (medicineName, medicineData = null) => {
    const medicine = (medicineName || medicineSearch)
      .trim()
      .replace(/\s+/g, " ");
    if (!medicine) {
      toast.error("Please select or enter a medicine.");
      return;
    }

    const isDuplicate = prescriptions.some(
      (item) =>
        normalizeMedicineName(item.medicine) ===
        normalizeMedicineName(medicine),
    );
    if (isDuplicate) {
      toast.warning(`${medicine} is already added to the prescription.`);
      return;
    }

    setPrescriptions((current) => [
      ...current,
      {
        medicine,
        medicineId: medicineData?.id || "",
        medicineType: medicineData?.type || medicineData?.baseUnit || "",
        dose: "",
        frequency: "1-1-1",
        timing: "After food",
        route: "Oral",
        duration: "14 days",
        quantity: "",
        note: "",
      },
    ]);
    setMedicineSearch("");
  };

  const calculatePrescriptionQuantity = (dose, frequency, duration) => {
    const doseText = String(dose || "").trim();
    if (!doseText || /^as\s*directed$/i.test(doseText)) return "";

    let doseValue = 0;
    const fractionMatch = doseText.match(/(\d+)\s*\/\s*(\d+)/);
    const numberMatch = doseText.match(/(?:^|[^\d])(\d+(?:\.\d+)?)/);
    if (fractionMatch) {
      doseValue = Number(fractionMatch[1]) / Number(fractionMatch[2]);
    } else if (numberMatch) {
      doseValue = Number(numberMatch[1]);
    }

    const frequencyText = String(frequency || "").trim();
    if (!doseValue || !/^\d+(?:-\d+){0,2}$/.test(frequencyText)) return "";
    const dosesPerDay = frequencyText
      .split("-")
      .reduce((total, value) => total + Number(value || 0), 0);

    const durationMatch = String(duration || "").match(
      /(\d+(?:\.\d+)?)\s*(day|days|week|weeks|month|months)?/i,
    );
    if (!durationMatch) return "";

    let durationDays = Number(durationMatch[1]);
    const unit = (durationMatch[2] || "day").toLowerCase();
    if (unit.startsWith("week")) durationDays *= 7;
    if (unit.startsWith("month")) durationDays *= 30;

    if (!dosesPerDay || !durationDays) return "";
    const quantity = doseValue * dosesPerDay * durationDays;
    return Number.isInteger(quantity)
      ? String(quantity)
      : String(Number(quantity.toFixed(2)));
  };

  const isAutoQuantityMedicine = (item) => {
    const medicineType = String(
      item?.medicineType || item?.baseUnit || item?.type || "",
    ).toLowerCase();
    return medicineType.includes("tablet") || medicineType.includes("capsule");
  };

  const updatePrescription = (index, field, value) => {
    setPrescriptions((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const updated = { ...item, [field]: value };

        if (/^as\s*directed$/i.test(String(updated.dose || "").trim())) {
          updated.quantity = "";
        } else if (field === "quantity") {
          if (!isAutoQuantityMedicine(updated)) updated.quantity = value;
          else {
            updated.quantity = calculatePrescriptionQuantity(
              updated.dose,
              updated.frequency,
              updated.duration,
            );
          }
        } else if (isAutoQuantityMedicine(updated)) {
          updated.quantity = calculatePrescriptionQuantity(
            updated.dose,
            updated.frequency,
            updated.duration,
          );
        }
        return updated;
      }),
    );
    setPrescriptionErrors((current) => {
      if (!current[index]?.[field]) return current;
      return {
        ...current,
        [index]: { ...current[index], [field]: false },
      };
    });
  };

  const validatePrescriptions = () => {
    // if (prescriptions.length === 0) {
    //   toast.error("Please add at least one medicine to the prescription.");
    //   return false;
    // }

    const errors = {};
    let firstError = "";
    prescriptions.forEach((item, index) => {
      const rowErrors = {};
      const requiredFields = [
        "medicine",
        "dose",
        "frequency",
        "timing",
        "route",
        "duration",
      ];

      requiredFields.forEach((field) => {
        if (!String(item[field] || "").trim()) {
          rowErrors[field] = true;
          if (!firstError) {
            const label =
              field === "timing"
                ? "When"
                : field[0].toUpperCase() + field.slice(1);
            firstError = `${label} is required for ${item.medicine}.`;
          }
        }
      });

      if (
        !/^as\s*directed$/i.test(String(item.dose || "").trim()) &&
        !item.quantity
      ) {
        rowErrors.quantity = true;
        if (!firstError) {
          firstError = `Quantity is required for ${item.medicine}.`;
        }
      }

      if (Object.keys(rowErrors).length) errors[index] = rowErrors;
    });

    setPrescriptionErrors(errors);
    if (firstError) {
      toast.error(firstError);
      return false;
    }
    return true;
  };

  const availableMedicines = medicineOptions.filter(
    (medicine) =>
      !prescriptions.some(
        (item) =>
          normalizeMedicineName(item.medicine) ===
          normalizeMedicineName(medicine.name || medicine.genericName),
      ),
  );

  const saveConsultation = (completionStatus) => {
    if (completionStatus === "completed" && !validatePrescriptions()) {
      return;
    }

    const payload = {
      updateKey: patientData?.updateKey || patientData?.consultationId || patientData?.id || "",
      status: completionStatus === "completed" ? "completed" : "draft",
      patientDetails: {
        uhid: patientData?.uhid || "",
        name: patientData?.name || "",
        gender: patientData?.gender || "",
        age: patientData?.age ?? "",
        address: patientData?.address || "",
        mobile: patientData?.mobile || "",
        date: patientData?.date || "",
        token: patientData?.token ?? "",
        entryAt: patientData?.entryAt || "",
        receptionRemarks: patientData?.receptionRemarks || "",
      },
      vitals: {
        bloodPressure: patientData?.bloodPressure ?? "",
        bloodSugar: patientData?.bloodSugar ?? "",
        height: patientData?.height ?? "",
        weight: patientData?.weight ?? "",
        temperature: patientData?.temperature ?? "",
        bloodOxygen: patientData?.bloodOxygen ?? "",
        pulse: patientData?.pulse ?? "",
      },
      allergiesAndMedicalHistory: {
        allergies: consultationNotes.allergies || "",
        medicalHistory: consultationNotes.medicalHistory || "",
      },
      investigationAndFindings: consultationNotes.investigationFindings || "",
      diagnosis: consultationNotes.diagnosis || "",
      doctorRemarks: consultationNotes.doctorRemarks || "",
      followUpDate: consultationNotes.followUpDate || null,
      prescription: prescriptions.map((item) => ({
        medicineId: item.medicineId || "",
        medicine: item.medicine,
        dose: item.dose,
        frequency: item.frequency,
        timing: item.timing,
        route: item.route,
        duration: item.duration,
        quantity: item.quantity,
        note: item.note,
      })),
    };

    setIsSavingConsultation(true);
    updateConsultationService(payload)
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg || (
            completionStatus === "completed"
              ? "Consultation completed successfully."
              : "Consultation draft saved successfully."
          ));
        } else if (response.data.status === "warning") {
          toast.warning(response.data.msg);
        } else if (response.data.status === "error") {
          toast.error(response.data.msg);
        } else if (response.data.status === "logout") {
          logout();
          navigate("/login");
        } else {
          toast.error(
            "Error in updating consultation, Something went wrong. " +
              response.data.status,
          );
        }
        setIsSavingConsultation(false);
      })
      .catch(() => {
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
        setIsSavingConsultation(false);
      });
  };

  const detailGroups = patientData
    ? [
        {
          title: "Patient Details",
          details: [
            ["Patient Name", patientData.name],
            ["UHID", patientData.uhid],
            ["Gender", patientData.gender],
            ["Age", patientData.age],
            ["Address", patientData.address],
            ["Mobile", patientData.mobile],
            ["Date", patientData.date],
            ["Token", patientData.token],
            ["Entry At", patientData.entryAt],
            ["Reception Remarks", patientData.receptionRemarks],
          ],
        },
        {
          title: "Vitals",
          details: [
            ["Blood Pressure", patientData.bloodPressure, "bloodPressure"],
            ["Blood Sugar", patientData.bloodSugar, "bloodSugar"],
            ["Height", patientData.height, "height"],
            ["Weight", patientData.weight, "weight"],
            ["Temperature", patientData.temperature, "temperature"],
            ["Blood Oxygen", patientData.bloodOxygen, "bloodOxygen"],
            ["Pulse", patientData.pulse, "pulse"],
          ],
        },
      ]
    : [];

  const consultationSections = [
    {
      title: "Allergies and Medical History",
      fields: [
        {
          key: "allergies",
          label: "Allergies",
          placeholder: "Add known allergies",
        },
        {
          key: "medicalHistory",
          label: "Medical History",
          placeholder: "Add relevant medical history",
        },
      ],
    },
    {
      title: "Previous Consultations",
      fields: [
        {
          key: "consultationHistory",
          label: "Consultation History",
          type: "history",
        },
      ],
    },
    {
      title: "Investigation and Findings",
      fields: [
        {
          key: "investigationFindings",
          label: "Investigation and Findings",
          placeholder: "Add investigation results and clinical findings",
        },
      ],
    },
    {
      title: "Diagnosis",
      fields: [
        {
          key: "diagnosis",
          label: "Diagnosis",
          placeholder: "Add diagnosis",
        },
      ],
    },
    {
      title: "Follow-Up",
      fields: [
        {
          key: "followUpDate",
          label: "Follow-Up Date",
          type: "date",
        },
      ],
    },
    {
      title: "Doctor Remarks",
      fields: [
        {
          key: "doctorRemarks",
          label: "Doctor Remarks",
          placeholder: "Add remarks",
        },
      ],
    },
  ];

  return (
    <PageWrapper title="Consult">
      <div className="row card p-2">
        <div className="col-12">
          {patientData ? (
            <>
              {detailGroups.map((group, index) => (
                <details
                  key={group.title}
                  className="consult-section mb-2"
                  open
                >
                  <summary className="fw-semibold">
                    <span className="d-flex align-items-center gap-2">
                      <span className="consult-index small fw-bold">
                        {index + 1}
                      </span>
                      {group.title}
                    </span>
                    <span className="consult-summary-meta">
                      <span className="consult-toggle" aria-hidden="true" />
                      <span className="consult-count">
                        {group.details.length} items
                      </span>
                    </span>
                  </summary>
                  <div className="row gx-2 gy-1 px-2 pb-2">
                    {group.details.map(([label, value, fieldName]) => {
                      const displayValue =
                        value === "" || value == null ? "-" : value;

                      return (
                        <div className="col-12 col-sm-6 col-lg-3" key={label}>
                          <div className="consult-field">
                            <span className="text-muted small d-block">
                              {label}
                            </span>
                            {fieldName ? (
                              editingVitals[fieldName] ? (
                                <div className="d-flex align-items-center gap-1">
                                  <TextInput
                                    value={value ?? ""}
                                    autoFocus
                                    onChange={(inputValue) =>
                                      setPatientData((currentData) => ({
                                        ...currentData,
                                        [fieldName]: inputValue,
                                      }))
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-link p-1"
                                    aria-label={`Finish editing ${label}`}
                                    title={`Finish editing ${label}`}
                                    onClick={() =>
                                      setEditingVitals((current) => ({
                                        ...current,
                                        [fieldName]: false,
                                      }))
                                    }
                                  >
                                    <FaCheck />
                                  </button>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between gap-1">
                                  <span className="small fw-semibold text-break">
                                    {displayValue}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-link p-1 flex-shrink-0"
                                    aria-label={`Edit ${label}`}
                                    title={`Edit ${label}`}
                                    onClick={() =>
                                      setEditingVitals((current) => ({
                                        ...current,
                                        [fieldName]: true,
                                      }))
                                    }
                                  >
                                    <FaEdit />
                                  </button>
                                </div>
                              )
                            ) : (
                              <span className="small fw-semibold text-break d-block">
                                {displayValue}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              ))}
              <details
                className="consult-section prescription-section mb-2"
                open
              >
                <summary className="fw-semibold">
                  <span className="d-flex align-items-center gap-2">
                    <span className="consult-index small fw-bold">
                      {detailGroups.length + 1}
                    </span>
                    Prescription
                  </span>
                  <span className="consult-summary-meta">
                    <span className="consult-toggle" aria-hidden="true" />
                    <span className="consult-count">
                      {prescriptions.length} medicines
                    </span>
                  </span>
                </summary>
                <div className="prescription-list">
                  {/* <div className="prescription-header" aria-hidden="true"> */}
                  {/* <span>Medicine</span><span>Dose</span><span>Frequency</span><span>When</span><span>Route</span><span>Duration</span><span>Qty</span><span>Note</span><span></span> */}
                  {/* </div> */}
                  {prescriptions.map((item, index) => (
                    <div
                      className="prescription-row"
                      key={`${item.medicine}-${index}`}
                    >
                      <div>
                        <label className="form-label">Medicine</label>
                        <TextInput
                          value={item.medicine}
                          disabled
                          onChange={() => {}}
                        />
                      </div>
                      <div
                        className={
                          prescriptionErrors[index]?.dose
                            ? "prescription-field-error"
                            : ""
                        }
                      >
                        <Select
                          label="Dose"
                          required
                          value={item.dose}
                          data={getDoseOptions(item.medicineType)}
                          onChange={(value) =>
                            updatePrescription(index, "dose", value)
                          }
                        />
                      </div>
                      <div
                        className={
                          prescriptionErrors[index]?.frequency
                            ? "prescription-field-error"
                            : ""
                        }
                      >
                        <Select
                          label="Frequency"
                          required
                          value={item.frequency}
                          data={[
                            "1-0-0",
                            "1-1-1",
                            "1-0-1",
                            "0-1-0",
                            "0-0-1",
                            "SOS",
                          ]}
                          onChange={(value) =>
                            updatePrescription(index, "frequency", value)
                          }
                        />
                      </div>
                      <div
                        className={
                          prescriptionErrors[index]?.timing
                            ? "prescription-field-error"
                            : ""
                        }
                      >
                        <Select
                          label="When"
                          required
                          value={item.timing}
                          data={[
                            "Before food",
                            "After food",
                            "With food",
                            "At bedtime",
                            "Empty stomach",
                          ]}
                          onChange={(value) =>
                            updatePrescription(index, "timing", value)
                          }
                        />
                      </div>
                      <div
                        className={
                          prescriptionErrors[index]?.route
                            ? "prescription-field-error"
                            : ""
                        }
                      >
                        <Select
                          label="Route"
                          required
                          value={item.route}
                          data={[
                            "Oral",
                            "Topical",
                            "Inhalation",
                            "IV",
                            "IM",
                            "Subcutaneous",
                          ]}
                          onChange={(value) =>
                            updatePrescription(index, "route", value)
                          }
                        />
                      </div>
                      <div
                        className={
                          prescriptionErrors[index]?.duration
                            ? "prescription-field-error"
                            : ""
                        }
                      >
                        <TextInput
                          label="Duration"
                          required
                          value={item.duration}
                          placeholder="14 days"
                          onChange={(value) =>
                            updatePrescription(index, "duration", value)
                          }
                        />
                      </div>
                      <div
                        className={
                          prescriptionErrors[index]?.quantity
                            ? "prescription-field-error"
                            : ""
                        }
                      >
                        <NumInput
                          label="Qty"
                          value={item.quantity}
                          placeholder="Enter quantity"
                          required={
                            !/^as\s*directed$/i.test(String(item.dose || ""))
                          }
                          readOnly={
                            isAutoQuantityMedicine(item) ||
                            /^as\s*directed$/i.test(String(item.dose || ""))
                          }
                          onChange={(value) =>
                            updatePrescription(index, "quantity", value)
                          }
                        />
                      </div>
                      <div>
                        <TextInput
                          label="Note"
                          value={item.note}
                          placeholder="Optional"
                          onChange={(value) =>
                            updatePrescription(index, "note", value)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger prescription-delete"
                        aria-label={`Remove ${item.medicine}`}
                        title="Remove medicine"
                        onClick={() =>
                          setPrescriptions((current) =>
                            current.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {prescriptions.length === 0 && (
                    <div className="prescription-empty">No medicines added</div>
                  )}
                </div>
                <div className="prescription-search-wrap">
                  <TextInput
                    label=""
                    value={medicineSearch}
                    placeholder="Search medicines (minimum 2 letters)..."
                    onChange={setMedicineSearch}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        availableMedicines.length > 0
                      ) {
                        addPrescription(
                          availableMedicines[0].name ||
                            availableMedicines[0].genericName ||
                            "",
                          availableMedicines[0],
                        );
                      }
                    }}
                  />
                  {medicineSearch.trim().length >= 2 && (
                    <div className="prescription-suggestions">
                      {isSearchingMedicines ? (
                        <div className="prescription-suggestion text-muted">
                          Searching medicines...
                        </div>
                      ) : availableMedicines.length > 0 ? (
                        availableMedicines.map((medicine) => (
                          <button
                            type="button"
                            className="prescription-suggestion"
                            key={medicine.id || medicine.name}
                            onClick={() =>
                              addPrescription(
                                medicine.name || medicine.genericName || "",
                                medicine,
                              )
                            }
                          >
                            <span className="fw-semibold d-block">
                              {medicine.name}
                            </span>
                            {(medicine.genericName ||
                              medicine.manufacturer) && (
                              <span className="small text-muted">
                                {[medicine.genericName, medicine.manufacturer]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="prescription-suggestion text-muted">
                          No new medicines found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </details>
              {consultationSections.map((section, index) => (
                <details
                  key={section.title}
                  className="consult-section mb-2"
                  open
                >
                  <summary className="fw-semibold">
                    <span className="d-flex align-items-center gap-2">
                      <span className="consult-index small fw-bold">
                        {index + 1}
                      </span>
                      {section.title}
                    </span>
                    <span className="consult-summary-meta">
                      <span className="consult-toggle" aria-hidden="true" />
                      <span className="consult-count">
                        {section.fields.length} fields
                      </span>
                    </span>
                  </summary>
                  <div className="row gx-2 gy-2 p-2">
                    {section.fields.map((field) => (
                      <div className="col-12" key={field.key}>
                        {field.type === "history" ? (
                          <div className="consult-history-list">
                            {patientData.consultationHistory?.length ? (
                              patientData.consultationHistory.map((item) => (
                                <div
                                  className="consult-history-item small"
                                  key={item.id || item.date}
                                >
                                  Consultation #{item.id} · {item.date}
                                </div>
                              ))
                            ) : (
                              <div className="text-muted small">
                                No previous consultations found.
                              </div>
                            )}
                          </div>
                        ) : field.type === "date" ? (
                          <DateInput
                            label={null}
                            value={consultationNotes[field.key] || ""}
                            minDate={new Date().toISOString().split("T")[0]}
                            onChange={(value) =>
                              setConsultationNotes((currentNotes) => ({
                                ...currentNotes,
                                [field.key]: value,
                              }))
                            }
                          />
                        ) : (
                          <>
                            <label
                              className="form-label small fw-semibold mb-1"
                              htmlFor={`consult-${field.key}`}
                            >
                              {field.label}
                            </label>
                            <textarea
                              id={`consult-${field.key}`}
                              className="form-control form-control-sm consult-note"
                              placeholder={field.placeholder}
                              value={consultationNotes[field.key] || ""}
                              onChange={(event) =>
                                setConsultationNotes((currentNotes) => ({
                                  ...currentNotes,
                                  [field.key]: event.target.value,
                                }))
                              }
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              ))}
              <div className="d-grid d-sm-flex justify-content-sm-end gap-2 mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary consult-action"
                  disabled={isSavingConsultation}
                  onClick={() => saveConsultation("draft")}
                >
                  {isSavingConsultation ? "Saving..." : "Save Draft"}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger consult-action text-light"
                  disabled={isSavingConsultation}
                  onClick={() => saveConsultation("completed")}
                >
                  {isSavingConsultation ? "Saving..." : "Complete Consultation"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-muted">No current consultation found.</div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Consult;
