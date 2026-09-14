import React, { useState } from "react";

export default function UpdatePasswordDialog(props) {
  let visibility = props.isVisible;
  if (visibility === undefined) {
    visibility = false;
  }
  const [payload, setPayload] = useState(props.payload);
  const toggleVisible = props.toggleVisible;
  const trigger = () => {
    props.onSubmit(payload);
    let payL = payload;
    payL["new"] = "";
    payL["old"] = "";
    setPayload({ ...payL });
  };

  const oldPasswordChanged = (event) => {
    let val = event.target.value;
    let payL = payload;
    payL["old"] = val;
    setPayload({ ...payL });
  };

  const newPasswordChanged = (event) => {
    let val = event.target.value;
    let payL = payload;
    payL["new"] = val;
    setPayload({ ...payL });
  };

  const view = () => {
    return (
      <>
        <div className="dialog-container">
          <div className="">
            <h3>Update Password!</h3>
            <input
              type="password"
              value={payload.old}
              className="form-control mt-4 mb-4"
              placeholder="Old Password"
              onChange={oldPasswordChanged}
            ></input>
            <input
              type="password"
              value={payload.new}
              className="form-control mt-4 mb-4"
              placeholder="New Password"
              onChange={newPasswordChanged}
            ></input>
          </div>
          <div className="button-container">
            <button
              className="btn app-btn-secondary"
              onClick={() => toggleVisible()}
            >
              Cancel
            </button>
            <button className="btn app-btn-primary" onClick={trigger}>
              Update
            </button>
          </div>
        </div>
        <div className="confirm-bg"></div>
      </>
    );
  };

  return <div>{visibility ? view() : ""}</div>;
}
