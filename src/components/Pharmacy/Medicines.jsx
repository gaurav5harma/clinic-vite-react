import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllMedicinesServices,
  addNewMedicineService,
  updateMedicineService,
  requestPoliciesService,
} from "../../services/HTTPService";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getUserData, logout } from "../../services/AuthService";
import PageWrapper from "../../hoc/PageWrapper";
import Icons from "../../assets/theme/Icons";
import Datatable from "../Shared/Datatable/Datatable";
import { Checkbox, NumInput, Select, TextInput } from "../Shared/Elements";
import { FaEdit } from "react-icons/fa";
import Colors from "../../assets/theme/Colors";
import "./Medicines.css";

const Medicines = (props) => {
  const navigate = useNavigate();
  //
  const defaultPayload = {
    updateKey: "",
    name: "",
    genericName: "",
    manufacturer: "",
    category: "",
    type: "",
    schedule: "",
    baseUnit: "",
    location: "",
    barcode: "",
    hsn: "",
    tax: "",
    minStock: "",
    maxStock: "",
    hasExpiry: false,
    forSale: true,
    isActive: true,
  };
  const columns = [
    { name: "name", title: "Name", sorting: true },
    { name: "genericName", title: "Generic Name", sorting: true },
    { name: "manufacturer", title: "Manufacturer", sorting: true },
    { name: "category", title: "Category", sorting: true },
    { name: "type", title: "Type", sorting: true },
    { name: "schedule", title: "Schedule", sorting: true },
    { name: "baseUnit", title: "Base Unit", sorting: true },
    { name: "location", title: "Location", sorting: true },
    { name: "barcode", title: "Barcode", sorting: false },
    { name: "action", title: "", sorting: false },
  ];
  const options = {
    theme: "",
    rows: [5, 10, 20, 50, 100, 200, 500],
    print: true,
    pagination: true,
    globalFilter: true,
    autoSearch: false,
  };
  const cusFilter = {
    page: 1,
    globalFilter: "",
    rows: 20,
    sortOrder: -1,
    sortField: "id",
  };
  const [formsData, setFormsData] = useState(defaultPayload);
  const [toggleAddNew, setAddNew] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filter, setFilter] = useState(cusFilter);
  const [userData, setUsersData] = useState([]);
  const [policies, setPolicies] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [showDataTable, setShowDataTable] = useState(true);
  //
  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = () => {
    requestPoliciesService({
      policies: ["itemCategories", "itemType", "schedule", "baseUnit"],
    })
      .then((res) => {
        if (res.status === 200 && res.data) {
          setPolicies(res.data.data || res.data);
        } else {
          toast.error(res.data?.msg || "Unable to load medicine options.");
        }
      })
      .catch(() => {
        toast.error("Unable to load medicine options.");
      });
  };

  const toBoolean = (value, fallback = false) => {
    if (typeof value === "boolean") return value;
    if (value === 1 || value === "1" || value === "true") return true;
    if (value === 0 || value === "0" || value === "false") return false;
    return fallback;
  };

  const editSelectHandler = (selData) => {
    setFormsData({
      updateKey: selData.id,
      name: selData.name || "",
      genericName: selData.genericName || "",
      manufacturer: selData.manufacturer || "",
      category: selData.category || "",
      type: selData.type || "",
      schedule: selData.schedule || "",
      baseUnit: selData.baseUnit || "",
      location: selData.location || "",
      barcode: selData.barcode || "",
      hsn: selData.hsn || "",
      tax: selData.tax ?? "",
      minStock: selData.minStock ?? "",
      maxStock: selData.maxStock ?? "",
      hasExpiry: toBoolean(selData.hasExpiry),
      forSale: toBoolean(selData.forSale, true),
      isActive: toBoolean(selData.isActive, true),
    });
    setAddNew(true);
    setEditMode(true);
  };
  const onLoad = (filterVal) => {
    getAllMedicinesServices(filterVal).then((res) => {
      if (res.data.response === "success") {
        let dta = res.data.data;
        let selectedData = dta;
        dta.map((el, key) => {
          dta[key].actionStatus = el.isActive;
          let status = (
            <div key={key} className="medicine-status-cell">
              {/* Select Action Status Start */}
              <OverlayTrigger
                placement="center"
                delay={{ show: 200, hide: 200 }}
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    {toBoolean(el.isActive, true) ? "Active" : "Inactive"}
                  </Tooltip>
                }
              >
                <div>
                  <span
                    className={`medicine-status-badge badge ${
                      toBoolean(el.isActive, true) ? "bg-success" : "bg-danger"
                    } me-1`}
                  >
                    {toBoolean(el.isActive, true) ? "Active" : "Inactive"}
                  </span>
                </div>
              </OverlayTrigger>
              {/* Select Action Status End */}
            </div>
          );
          let action = (
            <button
              key={key}
              type="button"
              className="btn btn-sm btn-light border"
              title="Edit Medicine"
              aria-label="Edit Medicine"
              onClick={() => editSelectHandler(selectedData[key])}
            >
              <FaEdit className="me-1" />
              Edit
            </button>
          );
          dta[key].status = status;
          dta[key].action = action;
        });
        setUsersData(dta);
        setTotalRows(res.data.total);
        setFilter(filterVal);
        // console.log(userData);
      } else {
        toast.error(res.data.msg);
        // navigate("/dashboard");
      }
    });
  };

  const cancel = () => {
    setFormsData(defaultPayload);
    setEditMode(false);
    setAddNew(false);
  };
  const resetForm = () => {
    setFormsData(defaultPayload);
  };
  const submitHandler = () => {
    const requiredFields = [
      { key: "name", label: "Medicine Name", type: "text" },
      { key: "manufacturer", label: "Manufacturer", type: "text" },
      { key: "genericName", label: "Generic Name", type: "text" },
      { key: "category", label: "Category", type: "select" },
      { key: "type", label: "Type", type: "select" },
      { key: "schedule", label: "Schedule", type: "select" },
      { key: "baseUnit", label: "Base Unit", type: "select" },
    ];

    for (const field of requiredFields) {
      const value = formsData[field.key];
      if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
      ) {
        toast.error(
          field.type === "select"
            ? `Please select ${field.label}!`
            : `Please enter ${field.label}!`,
        );
        return;
      }
    }

    const payload = {
      ...formsData,
      name: formsData.name.trim(),
      manufacturer: formsData.manufacturer.trim(),
      genericName: formsData.genericName.trim(),
    };

    if (!editMode) {
      addActionHandler(payload);
    } else {
      updateActionHandler(payload);
    }
  };
  const addActionHandler = (payload) => {
    addNewMedicineService(payload)
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg);
          resetForm();
          setEditMode(false);
          setAddNew(false);
        } else if (response.data.status === "warning") {
          toast.warning(response.data.msg);
        } else if (response.data.status === "error") {
          toast.error(response.data.msg);
        } else if (response.data.status === "logout") {
          logout();
          navigate("/login");
        } else {
          toast.error(
            "Error in Registering, Something went wrong. " +
              response.data.status,
          );
        }
        setShowDataTable(true);
      })
      .catch((res) => {
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
      });
    setShowDataTable(false);
  };
  const updateActionHandler = (payload) => {
    updateMedicineService(payload)
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg);
          resetForm();
          setEditMode(false);
          setAddNew(false);
        } else if (response.data.status === "warning") {
          toast.warning(response.data.msg);
        } else if (response.data.status === "error") {
          toast.error(response.data.msg);
        } else if (response.data.status === "logout") {
          logout();
          navigate("/login");
        } else {
          toast.error(
            "Error in Registering, Something went wrong. " +
              response.data.status,
          );
        }
        setShowDataTable(true);
      })
      .catch((res) => {
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
      });
    setShowDataTable(false);
  };
  // console.log("formsData:>>>", formsData);
  return (
    <PageWrapper
      title={"Medicines"}
      showBackButton={true}
      showAddNewButton={true}
    >
      <div className="row card">
        {toggleAddNew === true ? (
          <div className="col-12 p-3">
            <div className="rounded-3 border bg-white shadow-sm">
              <div
                className="medicine-form-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom"
              >
                <h5 className="mb-0 fw-bold text-light">
                  {editMode ? "Update Medicine" : "Add Medicine"}
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-light border"
                  title="Close"
                  onClick={cancel}
                >
                  ✕
                </button>
              </div>

              <div className="medicine-form-body px-3 py-3">
                <div className="row g-2">
                  <div className="col-lg-4 col-md-6 col-12 mb-2">
                    <TextInput
                      label="Medicine Name"
                      value={formsData.name}
                      onChange={(value) =>
                        setFormsData({ ...formsData, name: value })
                      }
                      required
                      autoFocus
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-12 mb-2">
                    <TextInput
                      label="Generic Name"
                      required
                      value={formsData.genericName}
                      onChange={(value) =>
                        setFormsData({ ...formsData, genericName: value })
                      }
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-12 mb-2">
                    <TextInput
                      label="Manufacturer"
                      required
                      value={formsData.manufacturer}
                      onChange={(value) =>
                        setFormsData({ ...formsData, manufacturer: value })
                      }
                    />
                  </div>

                  <div className="col-lg-3 col-md-6 col-12 mb-2">
                    <Select
                      label="Category"
                      required
                      value={formsData.category}
                      data={policies.itemCategories || []}
                      onChange={(value) =>
                        setFormsData({ ...formsData, category: value })
                      }
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 col-12 mb-2">
                    <Select
                      label="Type"
                      required
                      value={formsData.type}
                      data={policies.itemType || []}
                      onChange={(value) =>
                        setFormsData({ ...formsData, type: value })
                      }
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 col-12 mb-2">
                    <Select
                      label="Schedule"
                      required
                      value={formsData.schedule}
                      data={policies.schedule || []}
                      onChange={(value) =>
                        setFormsData({ ...formsData, schedule: value })
                      }
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 col-12 mb-2">
                    <Select
                      label="Base Unit"
                      required
                      value={formsData.baseUnit}
                      data={policies.baseUnit || []}
                      onChange={(value) =>
                        setFormsData({ ...formsData, baseUnit: value })
                      }
                    />
                  </div>

                  <div className="col-lg-3 col-md-6 col-12 mb-2">
                    <TextInput
                      label="Location"
                      value={formsData.location}
                      onChange={(value) =>
                        setFormsData({ ...formsData, location: value })
                      }
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 col-12 mb-2">
                    <TextInput
                      label="Barcode"
                      value={formsData.barcode}
                      onChange={(value) =>
                        setFormsData({ ...formsData, barcode: value })
                      }
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 col-12 mb-2">
                    <TextInput
                      label="HSN"
                      value={formsData.hsn}
                      onChange={(value) =>
                        setFormsData({ ...formsData, hsn: value })
                      }
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 col-12 mb-2">
                    <NumInput
                      label="Tax %"
                      value={formsData.tax}
                      onChange={(value) =>
                        setFormsData({ ...formsData, tax: value })
                      }
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 col-12 mb-2">
                    <NumInput
                      label="Minimum Stock"
                      value={formsData.minStock}
                      onChange={(value) =>
                        setFormsData({ ...formsData, minStock: value })
                      }
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 col-12 mb-2">
                    <NumInput
                      label="Maximum Stock"
                      value={formsData.maxStock}
                      onChange={(value) =>
                        setFormsData({ ...formsData, maxStock: value })
                      }
                    />
                  </div>
                  <div className="col-lg-6 col-12 mb-2 d-flex align-items-end gap-4 pb-2">
                    <Checkbox
                      label="Has Expiry"
                      checked={formsData.hasExpiry}
                      onChange={(value) =>
                        setFormsData({ ...formsData, hasExpiry: value })
                      }
                    />
                    <Checkbox
                      label="For Sale"
                      checked={formsData.forSale}
                      onChange={(value) =>
                        setFormsData({ ...formsData, forSale: value })
                      }
                    />
                    <Checkbox
                      label="Active"
                      checked={formsData.isActive}
                      onChange={(value) =>
                        setFormsData({ ...formsData, isActive: value })
                      }
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 border-top pt-2 mt-1">
                  <button
                    type="button"
                    className="medicine-form-action btn btn-sm btn-light border px-3"
                    onClick={cancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="medicine-form-action btn btn-sm btn-theme px-3"
                    onClick={submitHandler}
                  >
                    {editMode ? (
                      <Icons.BsCheck2Square className="me-2" />
                    ) : (
                      <Icons.BsPlusCircle className="me-2" />
                    )}
                    {editMode ? "Update Medicine" : "Add Medicine"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {!toggleAddNew && (
          <div className="col-12 d-flex justify-content-end p-3 border-bottom">
            <button
              type="button"
              className="btn btn-theme px-3"
              onClick={() => {
                setFormsData(defaultPayload);
                setEditMode(false);
                setAddNew(true);
              }}
            >
              <Icons.BsPlusCircle className="me-2" />
              Add New Medicine
            </button>
          </div>
        )}
        {showDataTable && (
          <div className="col-12">
            {toggleAddNew === true ? <h3>All Medicines</h3> : null}
            <Datatable
              options={options}
              columns={columns}
              filter={filter}
              data={userData}
              totalRows={totalRows}
              lazyLoad={onLoad}
            ></Datatable>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Medicines;
