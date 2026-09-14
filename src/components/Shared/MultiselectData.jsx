import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Colors from "../../assets/theme/Colors";

const MultiselectData = (props) => {
  const key = useParams().id;
  const navigate = useNavigate();
  const defaultPayload = {
    name: "",
  };
  const [payload, setPayload] = useState(defaultPayload);
  const [loading, setLoading] = useState(true);
  const getDetails = () => {
    if (loading === true) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDetails();
  }, []);
  const styles = {
    headerStyle: {
      color: "#fff",
      background: Colors.defaultThemeColor,
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    paginatorInput: {
      width: "100px",
      textAlign: "center",
    },
  };

  const toggleSelection = (val) => {
    let itm = props.data;
    if (props.data.length > 0) {
      itm.forEach((el) => {
        el.selected = val;
      });
    }
    props.setData(itm);
  };
  const tableData = () => {
    let payL = [];
    let items = props.data;
    let selected = props.selected;
    items.forEach((el) => {
      el.selected = false;
      selected.forEach((sl) => {
        if (el.value === sl) {
          el.selected = true;
        } else {
          // el.selected = false;
        }
      });
    });
    for (let i = 0; i < items.length; i++) {
      let item = (
        <tr className={i % 2 === 0 ? "" : "odd-row"} key={i}>
          <td style={{ height: "40px", padding: "5px" }}>
            <input
              type="checkbox"
              className="form-check-input"
              placeholder=""
              checked={items[i].selected}
              onChange={(e) => {
                let val = e.target.checked;
                let itm = props.data;
                if (props.singleSelect && props.singleSelect === true) {
                  itm.forEach((el) => {
                    el.selected = false;
                  });
                }
                itm[i]["selected"] = val;
                // itm[i]["poQuantity"] = 0;
                // setPayload(itm);
                props.setData(itm);
                // updateValue();
              }}
            />
          </td>
          <td style={{ height: "40px", padding: "5px" }}>{items[i].value}</td>
        </tr>
      );
      payL.push(item);
    }
    return payL;
  };
  return (
    <div className="row card p-3">
      <div className="col-12">
        <table style={{ minWidth: "100%" }}>
          <thead>
            <tr style={styles.headerStyle}>
              <th>
                <input
                  type="checkbox"
                  className="form-check-input"
                  placeholder=""
                  checked={
                    props.data.filter((ob) => ob.selected === true).length ===
                      props.data.length && props.data.length > 0
                  }
                  onChange={(e) => {
                    let val = e.target.checked;
                    toggleSelection(val);
                    // let itm = props.data;
                    // if (props.singleSelect && props.singleSelect === true) {
                    //   itm.forEach((el) => {
                    //     el.selected = false;
                    //   });
                    // }
                    // itm[i]["selected"] = val;
                    // itm[i]["poQuantity"] = 0;
                    // setPayload(itm);
                    // props.setData(itm);
                    // updateValue();
                  }}
                />
              </th>
              <th>{props.title}</th>
            </tr>
          </thead>
          <tbody>{tableData()}</tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </div>
  );
};

export default MultiselectData;
