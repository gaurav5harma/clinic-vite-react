import React, { useState, useEffect } from "react";
import { getQueryStatusList } from "../../../services/HTTPService";
import { toast } from "react-toastify";
import SweetAlert from "react-bootstrap-sweetalert";
//
export default function DialogQueryStatus(props) {
  const defaultPayload = {
    id: "",
    status: "",
    qryStatus: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [queryStatus, setQueryStatus] = useState([]);
  const toggleVisible = props.toggleVisible;
  const [loading, setLoading] = useState(true);
  //
  useEffect(() => {
    setPayload(props.payload);
  }, [props.payload]);
  //
  const cancelHandler = () => {
    toggleVisible();
  };
  const trigger = () => {
    props.onSubmit(payload);
  };
  const updateFormsData = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };
  const getQueryStatus = () => {
    if (loading === true) {
      setLoading(false);
      getQueryStatusList().then((response) => {
        // console.log("response.data", response.data);
        if (response.status === 200) {
          setQueryStatus(response.data);
        } else {
          toast.error(response.data.msg);
        }
      });
    }
  };
  useEffect(() => {
    getQueryStatus();
  });
  //
  const view = () => {
    return (
      <>
        <SweetAlert
          title={
            <span>
              <label style={{ fontSize: "18px" }}>Update Query Status</label>
            </span>
          }
          btnSize="sm"
          showCancel
          cancelBtnText="Cancel"
          cancelBtnBsStyle="danger"
          onCancel={cancelHandler}
          confirmBtnText="Update"
          onConfirm={trigger}
        >
          <form>
            <div className="mt-2 mb-2" style={{ textAlign: "left" }}>
              <label className="form-label" htmlFor="">
                Already Assigned
              </label>
              <input
                type="text"
                name="qryStatus"
                value={payload.qryStatus}
                className="form-control"
                placeholder="Already Status"
                onChange={updateFormsData}
                disabled
              ></input>
            </div>
            <div className="mt-3 mb-2" style={{ textAlign: "left" }}>
              <label className="form-label" htmlFor="">
                Assign New Status <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="form-select"
                name="status"
                value={payload.status}
                onChange={updateFormsData}
              >
                <option value="">Select Status</option>
                {queryStatus.map((val, key) => {
                  return (
                    <option key={key} value={val.id}>
                      {val.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </form>
        </SweetAlert>
      </>
    );
  };

  return <div>{props.isVisible ? view() : ""}</div>;
}
