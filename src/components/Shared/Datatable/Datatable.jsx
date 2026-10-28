import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Colors from "../../../assets/theme/Colors";
import "./datatable.css";
import { useReactToPrint } from "react-to-print";
import debounce from "lodash.debounce";

export default function Datatable(props) {
  const dataRef = useRef();

  const defaultColumns = [
    { name: "col1", title: "Column 1", sorting: true, width: 50 },
    { name: "col2", title: "Column 2", sorting: true, width: 50 },
  ];

  const defaultOptions = {
    theme: Colors.defaultThemeColor,
    rows: [10, 50, 100, 250, 500],
    pagination: true,
    print: true,
    globalFilter: true,
    rowPointer: false,
    autoSearch: false,
  };
  const columns = props.columns || defaultColumns;

  const defaultFilter = {
    page: 1,
    rows: 10,
    sortOrder: -1,
    sortField: columns[0]?.name,
    globalFilter: "",
  };

  const options = props.options || defaultOptions;
  const hideColumns = props.hideColumns || [];
  const data = props.data || [];
  const totalRows = props.totalRows || 0;
  const lazyLoad = props.lazyLoad;

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filter, setFilter] = useState(props.filter || defaultFilter);

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

  useEffect(() => {
    lazyLoad(filter);
    // eslint-disable-next-line
  }, []);

  /* ---------- Debounced search ---------- */
  const debouncedSearch = useCallback(
    debounce((updated) => lazyLoad(updated), 400),
    [],
  );

  const globalFilterChanged = (e) => {
    const val = e.target.value;
    const updated = { ...filter, globalFilter: val, page: 1 };
    setFilter(updated);

    if (options.autoSearch !== false) {
      debouncedSearch(updated);
    }
  };

  /* ---------- Pagination / sorting ---------- */
  const rowsChanged = (e) => {
    const updated = { ...filter, rows: +e.target.value, page: 1 };
    setFilter(updated);
    lazyLoad(updated);
  };

  const pageChanged = (e) => {
    const val = +e.target.value;
    if (val > 0 && val <= Math.ceil(totalRows / filter.rows)) {
      const updated = { ...filter, page: val };
      setFilter(updated);
      lazyLoad(updated);
    }
  };

  const next = () => {
    if (totalRows - filter.rows * filter.page > 0) {
      const updated = { ...filter, page: filter.page + 1 };
      setFilter(updated);
      lazyLoad(updated);
    }
  };

  const prev = () => {
    if (filter.page > 1) {
      const updated = { ...filter, page: filter.page - 1 };
      setFilter(updated);
      lazyLoad(updated);
    }
  };

  const sortOrderChanged = (field) => {
    const updated = {
      ...filter,
      sortField: field,
      sortOrder: filter.sortOrder * -1,
      page: 1,
    };
    setFilter(updated);
    lazyLoad(updated);
    setSelectedIndex(null);
    props.handleDoubleClick?.(null);
  };

  /* ---------- Memoized table body ---------- */
  const tableBody = useMemo(() => {
    return data.map((row, i) => (
      <tr
        key={row.id || i}
        className={i % 2 === 0 ? "" : "odd-row"}
        style={{
          cursor: options.rowPointer ? "pointer" : "",
          color: row.color || "",
        }}
        onClick={() => {
          if (options.rowPointer) props.handleClick?.(row);
          setSelectedIndex(i);
        }}
        onDoubleClick={() => {
          props.handleDoubleClick?.(row);
          setSelectedIndex(i);
        }}
      >
        {columns
          .filter((c) => !hideColumns.includes(c.name))
          .map((col) => (
            <td
              key={col.name}
              style={{
                fontWeight: selectedIndex === i ? "bold" : "",
              }}
            >
              {row[col.name]}
            </td>
          ))}
      </tr>
    ));
  }, [data, selectedIndex, columns, hideColumns, options.rowPointer]);

  const printData = useReactToPrint({
    content: () => dataRef.current,
  });

  return (
    <>
      {/* 🔹 TOP CONTROLS – SAME STRUCTURE */}
      <div
        className="row g-2 align-items-center"
        style={{
          padding:
            (options.pagination && options.globalFilter) === true
              ? "12px 0px"
              : "0px",
        }}
      >
        <div className="col-6 col-md-2">
          {options.pagination && (
            <select
              className="form-select"
              value={filter.rows}
              onChange={rowsChanged}
            >
              {options.rows.map((el) => (
                <option key={el} value={el}>
                  {el} Rows
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="col-6 col-md-2">
          {options.print && (
            <button
              type="button"
              className="btn btn-theme w-100"
              onClick={printData}
            >
              Print
            </button>
          )}
        </div>

        <div className="d-none d-md-block col-md-5"></div>

        <div className="col-12 col-md-3">
          {options.globalFilter && (
            <div className="row">
              <div
                className={options.autoSearch === false ? "col-9" : "col-12"}
              >
                <input
                  className="form-control"
                  placeholder="Search"
                  value={filter.globalFilter}
                  onChange={globalFilterChanged}
                />
              </div>

              {options.autoSearch === false && (
                <div className="col-3">
                  <button
                    className="btn btn-theme"
                    style={{ height: "30px" }}
                    onClick={() => {
                      const updated = {
                        ...filter,
                        globalFilter: filter.globalFilter.trim(),
                      };
                      setFilter(updated);
                      lazyLoad(updated);
                    }}
                  >
                    Go
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <hr className="m-0" />

      {/* 🔹 TABLE */}
      <div className="row">
        <div className="col-12 table-container printable-data" ref={dataRef}>
          <span className="text-center full-width printable-data-heading">
            {options.printHeading}
          </span>

          <table className="data-table" style={{ minWidth: "100%" }}>
            <thead>
              <tr style={styles.headerStyle}>
                {columns
                  .filter((c) => !hideColumns.includes(c.name))
                  .map((col) => (
                    <th
                      key={col.name}
                      style={{ width: col.width || "auto", cursor: "pointer" }}
                      onClick={() => sortOrderChanged(col.name)}
                    >
                      {col.title}
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {data.length ? (
                tableBody
              ) : (
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
              {totalRows} records
            </h6>
          ) : null}
        </div>

        <div className="col-12 col-md-6" style={{ paddingRight: "20px" }}>
          {options.pagination === true ? (
            <nav>
              <ul className="pagination justify-content-end">
                <li
                  className={[
                    "page-item",
                    filter.page > 1 ? "" : "disabled",
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
