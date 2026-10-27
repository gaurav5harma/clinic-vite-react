import { useEffect, useState } from "react";
import { FaCheck, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import PageWrapper from "../../hoc/PageWrapper";
import { getCurrentConsultationService } from "../../services/HTTPService";

const Consult = () => {
  const [patientData, setPatientData] = useState(null);
  const [editingVitals, setEditingVitals] = useState({});
  const [consultationNotes, setConsultationNotes] = useState({});

  useEffect(() => {
    getCurrentConsultationService({})
      .then((response) => {
        if (response.data?.status === "success" && response.data.patientData) {
          setPatientData(response.data.patientData);
        } else {
          toast.error(
            response.data?.msg || "Unable to fetch current consultation."
          );
        }
      })
      .catch(() => {
        toast.error("Unable to fetch current consultation.");
      });
  }, []);

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
            ["Patient ID", patientData.id],
            ["Date", patientData.date],
            ["Token", patientData.token],
            ["Doctor ID", patientData.doctorId],
            ["Created By", patientData.createdBy],
            ["Created At", patientData.createdAt],
            ["Remarks", patientData.remarks],
            ["Reception Remarks", patientData.receptionRemarks],
            ["Status", patientData.status],
            ["Queue", patientData.queue],
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
          key: "previousConsultations",
          label: "Consultation History",
          placeholder: "Add relevant previous consultation details",
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
      title: "Prescription",
      fields: [
        {
          key: "prescription",
          label: "Prescription",
          placeholder: "Add prescription details",
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
              <style>{`
                .consult-section {
                  overflow: hidden;
                  border: 1px solid #dfe6ed !important;
                  border-radius: 8px !important;
                  background: #fff;
                  transition: border-color 0.2s ease;
                }

                .consult-section:hover {
                  border-color: #91aaa9 !important;
                }

                .consult-section summary {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  gap: 12px;
                  padding: 10px 12px !important;
                  background: #f2f5f8;
                  color: #2f8374;
                  cursor: pointer;
                  list-style: none;
                  transition: background 0.2s ease, color 0.2s ease;
                }

                .consult-section summary::-webkit-details-marker {
                  display: none;
                }

                .consult-section summary:hover,
                .consult-section[open] summary {
                  background: #2f8374;
                  color: #fff;
                }

                .consult-section summary:focus-visible {
                  outline: 2px solid #248f86;
                  outline-offset: -3px;
                }

                .consult-summary-meta {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-left: auto;
                }

                .consult-toggle {
                  flex: 0 0 auto;
                  color: #60758a;
                  font-size: 17px;
                  line-height: 1;
                }

                .consult-toggle::before {
                  content: "+";
                }

                .consult-section[open] .consult-toggle {
                  color: #fff;
                }

                .consult-section[open] .consult-toggle::before {
                  content: "-";
                }

                .consult-count {
                  min-width: 62px;
                  padding: 3px 8px;
                  border: 1px solid #d5dee6;
                  border-radius: 6px;
                  background: #fff;
                  color: #526579;
                  font-size: 11px;
                  font-weight: 500;
                  text-align: center;
                  white-space: nowrap;
                }

                .consult-section[open] .consult-count {
                  border-color: rgba(255, 255, 255, 0.35);
                  background: rgba(255, 255, 255, 0.12);
                  color: #fff;
                }

                .consult-field {
                  min-height: 48px;
                  padding: 7px 8px;
                  border-bottom: 1px solid #e9edf1;
                  transition: background 0.15s ease;
                }

                .consult-field:hover {
                  background: #f5f8fa;
                }

                .consult-note {
                  min-height: 90px;
                  resize: vertical;
                }

                .consult-action {
                  min-height: 38px;
                  border-radius: 6px;
                  font-weight: 600;
                  transition: background 0.15s ease, transform 0.15s ease;
                }

                .consult-action:hover {
                  transform: translateY(-1px);
                }

                @media (max-width: 575px) {
                  .consult-section summary {
                    padding: 10px !important;
                  }

                  .consult-field {
                    min-height: auto;
                  }
                }
              `}</style>
              {detailGroups.map((group, index) => (
                <details
                  key={group.title}
                  className="consult-section mb-2"
                  open
                >
                  <summary className="fw-semibold">
                    <span className="d-flex align-items-center gap-2">
                      <span
                        className="small fw-bold"
                        style={{
                          width: "24px",
                          height: "24px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "6px",
                          background: "rgba(91, 130, 160, 0.16)",
                          color: "inherit",
                        }}
                      >
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
                        <div
                          className="col-12 col-sm-6 col-lg-3"
                          key={label}
                        >
                          <div className="consult-field" style={{ minWidth: 0 }}>
                            <span className="text-muted small d-block">
                              {label}
                            </span>
                            {fieldName ? (
                              editingVitals[fieldName] ? (
                                <div className="d-flex align-items-center gap-1">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    aria-label={label}
                                    value={value ?? ""}
                                    autoFocus
                                    onChange={(event) =>
                                      setPatientData((currentData) => ({
                                        ...currentData,
                                        [fieldName]: event.target.value,
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
              {consultationSections.map((section, index) => (
                <details
                  key={section.title}
                  className="consult-section mb-2"
                  open
                >
                  <summary className="fw-semibold">
                    <span className="d-flex align-items-center gap-2">
                      <span
                        className="small fw-bold"
                        style={{
                          width: "24px",
                          height: "24px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "6px",
                          background: "rgba(91, 130, 160, 0.16)",
                          color: "inherit",
                        }}
                      >
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
                      </div>
                    ))}
                  </div>
                </details>
              ))}
              <div className="d-grid d-sm-flex justify-content-sm-end gap-2 mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary consult-action"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger consult-action"
                >
                  End Consultation
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