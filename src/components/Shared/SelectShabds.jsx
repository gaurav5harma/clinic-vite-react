import React, { useState, useEffect } from "react";
import Colors from "../../assets/theme/Colors";
import { fetchAllShabdsService } from "../../services/HTTPService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Checkbox, Select, TextInput } from "./Elements";
import { FaTimes, FaTimesCircle } from "react-icons/fa";

const SelectShabds = (props) => {
  var current = new Date();
  current.setDate(current.getDate());
  var date = current.toISOString().substring(0, 10);

  const navigate = useNavigate();
  const [tableData, setTableData] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [update, setUpdate] = useState(1);
  const [productionStatus, setProductionStatus] = useState(false);
  const [payload, setPayload] = useState([]);

  const columns = [
    {
      title: "",
      width: "5%",
      ailgn: "left",
    },
    {
      title: "Shabd",
      ailgn: "left",
    },
    {
      title: "Baani",
      ailgn: "left",
    },
    {
      title: "Book",
      ailgn: "left",
    },
    {
      title: "Page",
      ailgn: "left",
    },
  ];
  const options = {
    theme: "",
    rows: [5, 10, 20, 50, 100],
    pagination: false,
    globalFilter: false,
  };
  const cusFilter = {
    page: 1,
    globalFilter: "",
    rows: 100,
    sortOrder: -1,
    sortField: "id",
  };
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
  const [filter, setFilter] = useState(cusFilter);
  const [searchFilter, setSearchFilter] = useState({ name: "", keyword: "" });

  useEffect(() => {
    onLoad(filter);
  }, []);

  const updateValue = () => {
    let val = update;
    val += 1;
    setUpdate(val);
  };

  const onLoad = () => {
    fetchAllShabdsService().then((res) => {
      if (res.status === 200) {
        let dta = res.data;
        dta.forEach((el) => {
          if (props.selected && props.selected.length > 0) {
            if (props.selected.findIndex((v) => v.id === el.id) !== -1) {
              el.selected = true;
            } else {
              el.selected = false;
            }
          } else {
            el.selected = false;
          }
        });
        // setPayload(dta);
        props.setData(dta);
      } else {
        toast.error("Something went wrong.");
      }
    });
  };

  const materialData = () => {
    let payL = [];
    let items = props.data.filter((ob) =>
      ob.shabd
        ? ob.shabd.toLowerCase().includes(searchFilter.keyword) ||
          ob.page.toLowerCase().includes(searchFilter.keyword)
        : ""
    );

    for (let i = 0; i < items.length; i++) {
      let item = (
        <tr className={i % 2 === 0 ? "" : "odd-row"} key={i}>
          <td style={{ height: "40px", padding: "5px" }}>
            <Checkbox
              checked={items[i].selected}
              onChange={(val) => {
                let itm = props.data;
                if (props.singleSelect && props.singleSelect === true) {
                  itm.forEach((el) => {
                    el.selected = false;
                  });
                }
                if (
                  items[i]["hsnCode"] === 0 ||
                  items[i]["hsnCode"] === "0" ||
                  items[i]["hsnCode"] === "" ||
                  items[i]["hsnCode"] === null
                ) {
                  toast.warning("Can't select this item. Invalid HSN Code");
                } else {
                  items[i]["selected"] = val;
                  items[i]["poQuantity"] = 0;
                  props.setData(itm);
                  updateValue();
                }
              }}
            />
          </td>
          <td style={{ height: "40px", padding: "5px" }}>{items[i].shabd}</td>
          <td style={{ height: "40px", padding: "5px" }}>{items[i].sant}</td>
          <td style={{ height: "40px", padding: "5px" }}>{items[i].book}</td>
          <td style={{ height: "40px", padding: "5px" }}>{items[i].page}</td>
        </tr>
      );
      payL.push(item);
    }
    return payL;
  };
  //
  return (
    <div className="row card p-3">
      {productionStatus === false || productionStatus === true ? (
        <div className="row">
          <div className="col-12">
            <div className="row mb-3">
              <div className="col-11 col-md-3">
                <TextInput
                  placeholder="Search"
                  value={searchFilter.keyword}
                  autoFocus
                  onChange={(val) =>
                    setSearchFilter({ ...searchFilter, keyword: val })
                  }
                />
              </div>
              <div className="col-1">
                <FaTimesCircle
                  style={{
                    color: "maroon",
                    cursor: "pointer",
                    marginTop: "7px",
                  }}
                  onClick={() =>
                    setSearchFilter({ ...searchFilter, keyword: "" })
                  }
                />
              </div>
            </div>
          </div>
          <div
            className="col-12 app-card-settings app-card"
            style={{ overflowX: "auto" }}
          >
            <table style={{ minWidth: "100%" }}>
              <thead>
                <tr style={styles.headerStyle}>
                  {columns.map((cols) => {
                    return (
                      <th
                        key={Math.random()}
                        style={{
                          width: cols.width ? cols.width : "auto",
                          textAlign: cols.align ? cols.align : "",
                          cursor: "pointer",
                          padding: "6px 4px",
                          fontWeight: "600",
                        }}
                      >
                        {cols.title}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>{materialData()}</tbody>
              <tfoot></tfoot>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SelectShabds;
