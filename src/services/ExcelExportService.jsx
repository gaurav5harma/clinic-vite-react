import React from "react";
import Colors from "../assets/theme/Colors";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";

const ExcelExportService = ({ excelData, fileName, title }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button
      className="btn btn-theme"
      style={{
        marginTop: "32px",
        marginRight: "0px",
        background: "darkgreen",
        color: "white",
      }}
      onClick={() => {
        exportToExcel(fileName);
      }}
    >
      <FaFileExcel style={{ marginRight: "10px" }} />
      {title && title !== "" ? title : "Export"}
    </button>
  );
};

export default ExcelExportService;
