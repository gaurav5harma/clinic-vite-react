import React, { useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
//
export default function DialogAddRole(props) {
  const defaultPayload = {
    name: "",
    slug: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const toggleVisible = props.toggleVisible;
  //
  useEffect(() => {
    setPayload(payload);
  }, [payload]);
  //
  const cancelHandler = () => {
    setPayload(defaultPayload);
    toggleVisible();
  };
  const trigger = () => {
    props.onSubmit(payload);
    setPayload(defaultPayload);
  };
  const updateFormsData = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };
  //
  const view = () => {
    return (
      <>
        <SweetAlert
          title={
            <span>
              <label style={{ fontSize: "18px" }}>Add Role</label>
            </span>
          }
          btnSize="xs"
          showCancel
          cancelBtnBsStyle="danger"
          confirmBtnBsStyle="success"
          cancelBtnText="Cancel"
          confirmBtnText="Submit"
          onCancel={cancelHandler}
          onConfirm={trigger}
          type={"controlled"}
          focusConfirmBtn={false}
          allowOutsideClick="show"
        >
          <form>
            <div className="mt-2 mb-2" style={{ textAlign: "left" }}>
              <label className="form-label" htmlFor="">
                Role Name
              </label>
              <input
                className="form-control"
                type={"text"}
                name="name"
                value={payload.name}
                placeholder="Role Name"
                onChange={updateFormsData}
                required={true}
              ></input>
            </div>
            <div className="mt-2 mb-2" style={{ textAlign: "left" }}>
              <label className="form-label" htmlFor="">
                Description
              </label>
              <input
                className="form-control"
                type={"text"}
                name="slug"
                value={payload.slug}
                placeholder="Description"
                onChange={updateFormsData}
              ></input>
            </div>
          </form>
        </SweetAlert>
      </>
    );
  };
  return <div>{props.isVisible ? view() : ""}</div>;
}
