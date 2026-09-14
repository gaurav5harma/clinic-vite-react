import React from "react";
import { toast } from "react-toastify";
import swal from "sweetalert";
import Colors from "../../../assets/theme/Colors";
import { logout } from "../../../services/AuthService";
import {
  delDataByID,
  deleteCostingService,
} from "../../../services/HTTPService";
import { FaTrash } from "react-icons/fa";
//
export default function DialogDeleteData(props) {
  const filter = props.filter;
  const lazyLoad = props.lazyLoad;
  const tablename = {
    table: "",
  };
  const deleteData = (id) => {
    //
    switch (props.whats) {
      case "item":
        // tablename.table = delContact;
        tablename.table = delDataByID;
        break;
      case "client":
        tablename.table = delDataByID;
        break;
      case "costing":
        tablename.table = delDataByID;
        break;
      case "processPlan":
        tablename.table = delDataByID;
        break;
      default:
        break;
    }
    //
    swal({
      title: "Are you sure ?",
      text: "Once deleted, you will not be able to recover this data !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        tablename
          .table({ id: id, table: props.whats })
          .then((response) => {
            if (response.data.status === "success") {
              // swal("Data Deleted", response.data.msg, "success");
              toast.success(response.data.msg);
              lazyLoad(filter);
            } else if (response.data.status === "warning") {
              toast.warning(response.data.msg);
            } else if (response.data.status === "error") {
              toast.error(response.data.msg);
            } else if (response.data.status === "logout") {
              logout();
            } else {
              toast.error(
                "Error in Registering, Something went wrong. " +
                  response.data.status
              );
            }
          })
          .catch((res) => {
            console.log("Error in deletion");
          });
      } else {
        console.log("Your Data is safe and not delete.!");
        // toast("Your Data is safe and not delete.!");
      }
    });
  };

  return (
    <>
      {props.id ? (
        <span
          style={{
            marginRight: "5px",
            cursor: "pointer",
            width: "100%",
          }}
          onClick={() => deleteData(props.id)}
        >
          <FaTrash size={13} color="maroon" />{" "}
          {props.text ? (
            <span style={{ marginLeft: "10px" }}>{props.text}</span>
          ) : (
            ""
          )}
        </span>
      ) : null}
    </>
  );
}
