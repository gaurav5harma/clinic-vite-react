import React, { useEffect, useState, useRef } from "react";
import Colors from "../../../assets/theme/Colors";
import "./datatable.css";
import { useReactToPrint } from "react-to-print";

export default function Datatable(props) {
  const dataRef = useRef();
  const defaultColumns = [
    {
      name: "col1",
      title: "Column 1",
      sorting: true,
      sort: 1,
      width: 50,
    },
    {
      name: "col2",
      title: "Column 2",
      sorting: true,
      sort: 1,
      width: 50,
    },
  ];
  const defaultOptions = {
    // theme: "#009f56",
    theme: Colors.defaultThemeColor,
    rows: [10, 50, 100, 250, 500],
    pagination: true,
    print: true,
    globalFilter: true,
    rowPointer: false,
    autoSearch: false,
  };
  const defaultData = [];
  const columns = props.columns ? props.columns : defaultColumns;
  const hideColumns =
    props.hideColumns && props.hideColumns.length > 0 ? props.hideColumns : [];
  const defaultFilter = {
    page: 1,
    rows: 10,
    sortOrder: -1,
    sortField: columns[0].name,
    globalFilter: "",
  };
  const [filter, setFilter] = useState(
    props.filter ? props.filter : defaultFilter
  );
  const [selectedIndex, setSelectedIndex] = useState(null);
  const options = props.options ? props.options : defaultOptions;
  const data = props.data ? props.data : defaultData;
  const lazyLoad = props.lazyLoad; //Function to be called from parent component to get lazy loaded data
  const totalRows = props.totalRows;
  useEffect(() => {
    lazyLoad(filter);
    setSelectedIndex(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageChanged = (event) => {
    let val = event.target.value;
    if (val > 0 && val <= Math.ceil(totalRows / filter.rows)) {
      let changedFilter = filter;
      changedFilter.page = val;
      lazyLoad(changedFilter);
    }
  };
  const next = () => {
    if (totalRows - filter.rows * filter.page) {
      let changedFilter = filter;
      changedFilter.page++;
      lazyLoad(changedFilter);
    }
  };
  const prev = () => {
    if (filter.page >= 2) {
      let changedFilter = filter;
      changedFilter.page--;
      lazyLoad(changedFilter);
    }
  };
  const globalFilterChanged = (event) => {
    let val = event.target.value;
    let changedFilter = filter;
    setFilter({ ...filter, globalFilter: val });
    if (val.trim().length >= 0) {
      changedFilter.globalFilter = val.trim();
      lazyLoad(changedFilter);
    }
  };
  const rowsChanged = (event) => {
    let changedFilter = filter;
    changedFilter.rows = event.target.value;
    changedFilter.page = 1;
    lazyLoad(changedFilter);
  };
  const sortOrderChanged = (col) => {
    // console.log('yes')
    let changedFilter = filter;
    changedFilter.sortField = col;
    changedFilter.sortOrder = changedFilter.sortOrder * -1;
    lazyLoad(changedFilter);
  };

  const styles = {
    headerStyle: {
      color: "#fff",
      background: options.theme ? options.theme : defaultOptions.theme,
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    paginatorInput: {
      width: "100px",
      textAlign: "center",
    },
  };

  const generateData = () => {
    let tblData = [];
    for (let i = 0; i < data.length; i++) {
      let row = (
        <tr
          className={i % 2 === 0 ? "" : "odd-row"}
          key={i}
          onDoubleClick={() => {
            props.handleDoubleClick(data[i]);
            setSelectedIndex(i);
          }}
          onClick={() => {
            if (options.rowPointer === true) {
              props.handleClick(data[i]);
            }
            setSelectedIndex(i);
          }}
          style={{ cursor: options.rowPointer === true ? "Pointer" : "" }}
        >
          {columns
            .filter((fl) => !hideColumns.includes(fl.name))
            .map((col) => {
              return (
                <td
                  key={Math.random()}
                  style={{
                    fontWeight: selectedIndex === i ? "bold" : "",
                  }}
                >
                  {data[i][col.name]}
                </td>
              );
            })}
        </tr>
      );
      tblData.push(row);
    }
    return tblData;
  };

  const printData = useReactToPrint({
    content: () => dataRef.current,
  });

  return (
    <>
      <div
        className="row"
        style={{
          padding:
            (options.pagination && options.globalFilter) === true
              ? "20px 0px"
              : "0px",
        }}
      >
        <div className="col-12 col-md-2">
          {options.pagination === true ? (
            <select
              className="form-select"
              value={filter.rows}
              onChange={rowsChanged}
            >
              {options.rows.map((el, k) => {
                return (
                  <option key={k} value={el}>
                    {el} Rows
                  </option>
                );
              })}
            </select>
          ) : null}
        </div>
        <div className="col-12 col-md-2">
          {options.print === true ? (
            <button className="btn btn-theme" onClick={printData}>
              Print
            </button>
          ) : null}
        </div>
        <div className="col-12 col-md-5"></div>
        <div className="col-12 col-md-3">
          {options.globalFilter === true ? (
            <>
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={filter.globalFilter}
                onChange={globalFilterChanged}
                autoFocus={options.searchFocus ? options.searchFocus : false}
              />
            </>
          ) : null}
        </div>
      </div>
      <hr className="m-0" />
      <div className="row">
        <div
          className="col-12 table-container printable-data"
          style={{ minHeight: data.length > 0 ? "200px" : "0px" }}
          ref={dataRef}
        >
          <span className="text-center full-width printable-data-heading">
            {options.printHeading}
          </span>
          <table className="data-table" style={{ minWidth: "100%" }}>
            <thead>
              <tr style={styles.headerStyle}>
                {columns
                  .filter((fl) => !hideColumns.includes(fl.name))
                  .map((cols) => {
                    return (
                      <th
                        key={Math.random()}
                        style={{
                          width: cols.width ? cols.width : "auto",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          sortOrderChanged(cols.name);
                          setSelectedIndex(null);
                          props.handleDoubleClick(null);
                        }}
                      >
                        {cols.title}
                        <span
                          className={[
                            "mt-1",
                            cols.sorting === true
                              ? filter.sortField === cols.name &&
                                filter.sortOrder === 1
                                ? "fas fa-sort-amount-down-alt"
                                : filter.sortField === cols.name &&
                                  filter.sortOrder === -1
                                ? "fas fa-sort-amount-down"
                                : "fas fa-sort"
                              : "",
                          ].join(" ")}
                          style={{ marginLeft: "10px", whiteSpace: "pre" }}
                        ></span>
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                generateData()
              ) : (
                // data.map((row, key) => {
                //   return (
                //     <tr
                //       className={key % 2 === 0 ? "" : "odd-row"}
                //       key={Math.random()}
                //     >
                //       {columns.map((col) => {
                //         return <td key={Math.random()}>{row[col.name]}</td>;
                //       })}
                //     </tr>
                //   );
                // })
                <tr>
                  <td>No Records Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="col-12">
          {options.pagination === true ? <hr className="mt-0" /> : null}
        </div>
        <div className="col-12 col-md-6" style={{ paddingLeft: "20px" }}>
          {options.pagination === true ? (
            <h6 className="m-0">
              Showing {(filter.page - 1) * filter.rows + data.length} of{" "}
              {props.totalRows} records
            </h6>
          ) : null}
        </div>
        <div className="col-12 col-md-6" style={{ paddingRight: "20px" }}>
          {options.pagination === true ? (
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-end">
                <li
                  className={[
                    "page-item",
                    filter.page >= 2 ? "" : "disabled",
                  ].join(" ")}
                >
                  <button className="page-link" onClick={prev}>
                    Prev
                  </button>
                </li>
                <li className="page-item">
                  <input
                    type="number"
                    value={filter.page}
                    onChange={pageChanged}
                    className="form-control"
                    style={styles.paginatorInput}
                  />
                </li>
                <li
                  className={[
                    "page-item",
                    totalRows - filter.rows * filter.page > 0 ? "" : "disabled",
                  ].join(" ")}
                >
                  <button className="page-link" onClick={next}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </>
  );
}
