import React, { useState } from "react";

export default function StockEditDialog(props) {
  let visibility = props.isVisible;
  if (visibility === undefined) {
    visibility = false;
  }
  const [payload, setPayload] = useState(props.val);
  const toggleVisible = props.toggleVisible;
  const trigger = () => {
    props.onSubmit(payload);
  };

  const valueChanged = (event) => {
    let val = event.target.value;
    setPayload(val);
  };

  const view = () => {
    return (
      <>
        <div className="dialog-container">
          <div className="">
            <h3>Add Opening Stock!</h3>
            <input
              type="number"
              value={payload.val}
              className="form-control mt-4 mb-4"
              placeholder="Enter Stock Quantity"
              onChange={valueChanged}
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
