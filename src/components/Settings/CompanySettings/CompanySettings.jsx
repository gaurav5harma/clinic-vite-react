import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../hoc/PageWrapper";
import {
  getCompanySettingsService,
  setCompanySettingsService,
} from "../../../services/HTTPService";
import { toast } from "react-toastify";
//
const CompanySettings = (props) => {
  const navigate = useNavigate();

  const defaultCompanySettings = {
    title: "",
    address: "",
    billPrefix: "",
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
    financialYear: "",
  };
  const [companySettings, setCompanySettings] = useState(
    defaultCompanySettings
  );
  const [loading, setLoading] = useState(true);

  const getSettings = () => {
    if (loading === true) {
      setLoading(false);
      getCompanySettingsService().then((res) => {
        if (res.status === 200) {
          if (res.data === "" || res.data === null) {
            setCompanySettings(defaultCompanySettings);
          } else {
            setCompanySettings(res.data);
          }
        } else {
          toast.error(res.data.msg);
          if (res.data.status === "logout") {
            logout();
          }
        }
      });
    }
  };
  useEffect(() => {
    getSettings();
  }, []);

  const formDataHandler = (e) => {
    const { name, value } = e.target;
    setCompanySettings((preState) => ({
      ...preState,
      [name]: value,
    }));
  };
  //
  const checkValidation = () => {
    updateAPIHandler(companySettings);
  };
  const updateAPIHandler = (payload) => {
    setCompanySettingsService(payload)
      .then((response) => {
        if (response.data.status === "success") {
          toast.success(response.data.msg);
        } else if (response.data.status === "error") {
          toast.error("Error ? " + response.data.msg);
        } else if (response.data.status === "logout") {
          logout();
          navigate("/login");
        } else {
          toast.error("Error, Something went wrong. " + response.data.status);
        }
      })
      .catch((res) => {
        navigate("/dashboard");
        toast.error("Catch Error, Something went wrong");
      });
  };

  // console.log("companySettings", companySettings);
  //
  //
  return (
    <PageWrapper title="Company Settings Master">
      <div className="row card p-3">
        <div className="col-12">
          <div className="row">
            <div className="row g-2 settings-section">
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
                        name="title"
                        className="form-control"
                        value={companySettings.title}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="setting-input-1" className="form-label">
                        Website Url
                      </label>
                      <input
                        type="text"
                        name="url"
                        className="form-control"
                        value={companySettings.url}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="setting-input-1" className="form-label">
                        Company's Logo URL
                      </label>
                      <input
                        type="text"
                        name="image"
                        className="form-control"
                        value={companySettings.image}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="setting-input-1" className="form-label">
                        Company's E-mail
                      </label>
                      <input
                        type="text"
                        name="email"
                        className="form-control"
                        value={companySettings.email}
                        onChange={formDataHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="setting-input-1" className="form-label">
                        Current Session
                      </label>
                      <input
                        type="text"
                        name="financialYear"
                        className="form-control"
                        placeholder="YYYY-YYYY"
                        minLength="9"
                        maxLength="9"
                        value={companySettings.financialYear}
                        onChange={formDataHandler}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="m-2" />
            <div className="row g-2 settings-section">
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
                        name="billPrefix"
                        className="form-control"
                        value={companySettings.billPrefix}
                        onChange={formDataHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="setting-input-1" className="form-label">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={companySettings.address}
                        onChange={formDataHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="setting-input-1" className="form-label">
                        District
                      </label>
                      <input
                        type="text"
                        name="district"
                        className="form-control"
                        value={companySettings.district}
                        onChange={formDataHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="setting-input-1" className="form-label">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        className="form-control"
                        value={companySettings.state}
                        onChange={formDataHandler}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="m-2" />
            <div className="row g-2 settings-section">
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
                        name="gstin"
                        className="form-control"
                        value={companySettings.gstin}
                        onChange={formDataHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="setting-input-1" className="form-label">
                        State Code
                      </label>
                      <input
                        type="text"
                        name="stateCode"
                        className="form-control"
                        value={companySettings.stateCode}
                        onChange={formDataHandler}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="m-2" />
            <div className="row g-2 settings-section">
              <div className="col-12 col-md-4">
                <h3 className="section-title">Bank Details</h3>
                <div className="section-intro">
                  Company's Bank account details
                </div>
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
                        name="bank"
                        className="form-control"
                        value={companySettings.bank}
                        onChange={formDataHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="setting-input-1" className="form-label">
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        className="form-control"
                        value={companySettings.accountNumber}
                        onChange={formDataHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="setting-input-1" className="form-label">
                        Branch
                      </label>
                      <input
                        type="text"
                        name="branch"
                        className="form-control"
                        value={companySettings.branch}
                        onChange={formDataHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="setting-input-1" className="form-label">
                        IFS Code
                      </label>
                      <input
                        type="text"
                        name="ifsc"
                        className="form-control"
                        value={companySettings.ifsc}
                        onChange={formDataHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="setting-input-1" className="form-label">
                        UPI
                      </label>
                      <input
                        type="text"
                        name="upi"
                        className="form-control"
                        value={companySettings.upi}
                        onChange={formDataHandler}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="mb-3 mt-3" style={{ float: "right" }}>
                  <button
                    className="btn app-btn-primary"
                    onClick={checkValidation}
                  >
                    Update Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CompanySettings;
