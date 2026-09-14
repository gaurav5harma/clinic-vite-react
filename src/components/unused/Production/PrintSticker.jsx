import React, { useState, useEffect, useRef } from "react";
import PageWrapper from "../../hoc/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import SweetAlert from "react-bootstrap-sweetalert";
import Icons from "../../assets/theme/Icons";
import Colors from "../../assets/theme/Colors";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  getProductionDetailsService,
  savePrintStyleService,
} from "../../services/HTTPService";
import sty from "./PrintSheet.module.css";
import { useReactToPrint } from "react-to-print";
import { Select, TextInput } from "../Shared/Elements";
import styled from "styled-components";
import {
  BsArrowDownCircle,
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsArrowUp,
  BsArrowUpCircle,
  BsFileEarmarkArrowUp,
  BsFillPatchMinusFill,
  BsFillPatchPlusFill,
  BsFillPlusCircleFill,
} from "react-icons/bs";

const PrintSticker = (props) => {
  const key = useParams().ref;
  const componentRef = useRef();
  const navigate = useNavigate();
  const [prodData, setProdData] = useState(null);
  const [payload, setPayload] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStyle, toggleStyle] = useState(false);
  const [fields, setFields] = useState([]);
  const [additionalStyle, setAdditionalStyle] = useState([]);
  const [viewType, setViewType] = useState("normal");
  const [selectedCard, setSelectedCard] = useState(null);

  const fixedFields = [
    { name: "School Title", value: "schoolTitle" },
    { name: "School Logo", value: "schoolLogo" },
    { name: "School Image", value: "schoolImage" },
    { name: "School Subtitle", value: "schoolSubtitle" },
    { name: "School Address", value: "schoolAddress" },
    { name: "Session", value: "session" },
    { name: "Signature", value: "signature" },
    { name: "Signature Title", value: "signatureTitle" },
    { name: "Data Title", value: "dataTitle" },
    { name: "Image", value: "image" },
    { name: "Table", value: "table" },
    { name: "Table Head", value: "tableHead" },
    { name: "Table Data", value: "tableData" },
  ];
  const defaultInnerStyle = {
    schoolTitle: {
      isVisible: false,
      showTitle: false,
      position: "absolute",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    schoolSubtitle: {
      isVisible: false,
      showTitle: false,
      position: "absolute",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    schoolLogo: {
      isVisible: true,
      showTitle: true,
      type: "image",
      position: "relative",
      fontSize: "15px",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      height: "100px",
      width: "auto",
    },
    schoolImage: {
      isVisible: true,
      showTitle: true,
      type: "image",
      position: "relative",
      fontSize: "15px",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      height: "100px",
      width: "auto",
    },
    schoolAddress: {
      isVisible: true,
      showTitle: false,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    session: {
      isVisible: false,
      showTitle: false,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    dataTitle: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    name: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    class: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    department: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    blood_group: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    father: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    mother: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    mobile: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    aadhar: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    address: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    regNumber: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    ref: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      textAlign: "left",
      textDecoration: "none",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "bold",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      color: "black",
      fontFamily: "Poppins",
      lineHeight: "15px",
    },
    image: {
      isVisible: true,
      showTitle: true,
      type: "image",
      position: "relative",
      fontSize: "15px",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      height: "100px",
      width: "auto",
    },
    signatureTitle: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      fontSize: "15px",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      height: "100px",
      width: "auto",
    },
    signature: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      fontSize: "15px",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      height: "100px",
      width: "auto",
    },
    table: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      fontSize: "15px",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      height: "100px",
      width: "auto",
    },
    tableHead: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      fontSize: "15px",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      height: "100px",
      width: "auto",
    },
    tableData: {
      isVisible: true,
      showTitle: true,
      position: "relative",
      fontSize: "15px",
      top: "0px",
      bottom: "0px",
      right: "0px",
      left: "0px",
      padding: "0px",
      margin: "0px",
      height: "100px",
      width: "auto",
    },
  };

  const toggleToolbar = (idx) => {
    if (selectedCard === idx) {
      setSelectedCard(null);
    } else {
      setSelectedCard(idx);
    }
  };
  const [innerStyle, setInnerStyle] = useState(defaultInnerStyle);
  const [selectedField, setSelectedField] = useState("");
  const [update, setUpdateVal] = useState(0);
  const getDetails = () => {
    if (loading === true) {
      setLoading(false);
      getProductionDetailsService({ key: key }).then((res) => {
        if (res.status === 200) {
          if (res.data.status === "success") {
            let dta = res.data.data.data;
            dta.forEach((el) => {
              el.imgStyle = {
                top: res.data.data.prodData.innerStyle.image.top,
                left: res.data.data.prodData.innerStyle.image.left,
                fontSize: res.data.data.prodData.innerStyle.image.fontSize,
              };
            });
            setPayload(dta);
            setProdData(res.data.data.prodData);
            // setInnerStyle(res.data.data.prodData.innerStyle !== null ? res.data.data.prodData.innerStyle : defaultInnerStyle)
            setInnerStyle({
              ...innerStyle,
              ...res.data.data.prodData.innerStyle,
            });
            // if (res.data.data.prodData.additionalStyle && res.data.data.prodData.additionalStyle.length>0){
            //     setAdditionalStyle({ ...innerStyle, ...res.data.data.prodData.additionalStyle })
            // }
            // else{
            //     let addSty = [];

            // }
            let flds = [];
            res.data.data.prodData.fields.split(",").forEach((element) => {
              let el = { name: element.replace("_", " "), value: element };
              flds.push(el);
            });
            setFields([...fixedFields, ...flds]);
          } else {
            toast.error(res.data.msg);
          }
        } else {
          toast.error("Something went wrong.");
        }
      });
    }
  };

  useEffect(() => {
    if (key) {
      getDetails();
    } else {
      history.back();
    }
  }, [innerStyle]);

  const printReport = useReactToPrint({
    content: () => componentRef.current,
  });

  const updateVal = () => {
    let upd = update;
    upd += 1;
    setUpdateVal(upd);
  };
  const [cardStyle, setCardStyle] = useState({
    height: 56,
    width: 88,
    unit: "mm",
  });

  const styles = {
    cardContainer: {
      display: "block",
      float: "left",
      margin: "1px",
      pageBreakInside: "avoid",
    },
    inline: {
      width: cardStyle.width + cardStyle.unit,
      height: cardStyle.height + cardStyle.unit,
      color: "black",
      position: "relative",
    },
    templateStyle: {
      cursor: "pointer",
      border: ".5px solid lightgrey",
      width: cardStyle.width + cardStyle.unit,
      height: "100%",
      position: "absolute",
      zIndex: 1,
    },
  };

  const exportAsImage = async () => {
    const canvas = await html2canvas(componentRef.current);
    const image = canvas.toDataURL("image/jpg");

    // Download the image
    const link = document.createElement("a");
    link.href = image;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const moveUp = (pay) => {
    if (selectedCard !== null) {
      let payL = payload;
      let size = payL[selectedCard].imgStyle.top;
      size = size.replace("px", "");
      size = Number(size);
      size -= 1;
      payL[selectedCard].imgStyle.top = size + "px";
      updateVal();
    } else if (selectedField !== "") {
      let inStyle = innerStyle[selectedField];
      let size = inStyle.top;
      size = size.replace("px", "");
      size = Number(size);
      size -= 1;
      inStyle.top = size + "px";
      setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
    }
  };

  const moveDown = (payL) => {
    if (selectedCard !== null) {
      let payL = payload;
      let size = payL[selectedCard].imgStyle.top;
      size = size.replace("px", "");
      size = Number(size);
      size += 1;
      payL[selectedCard].imgStyle.top = size + "px";
      updateVal();
    } else if (selectedField !== "") {
      let inStyle = innerStyle[selectedField];
      let size = inStyle.top;
      size = size.replace("px", "");
      size = Number(size);
      size += 1;
      inStyle.top = size + "px";
      setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
    }
  };

  const moveLeft = () => {
    if (selectedCard !== null) {
      let payL = payload;
      let size = payL[selectedCard].imgStyle.left;
      size = size.replace("px", "");
      size = Number(size);
      size -= 1;
      payL[selectedCard].imgStyle.left = size + "px";
      updateVal();
    } else if (selectedField !== "") {
      let inStyle = innerStyle[selectedField];
      let size = inStyle.left;
      size = size.replace("px", "");
      size = Number(size);
      size -= 1;
      inStyle.left = size + "px";
      setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
    }
  };

  const moveRight = () => {
    if (selectedCard !== null) {
      let payL = payload;
      let size = payL[selectedCard].imgStyle.left;
      size = size.replace("px", "");
      size = Number(size);
      size += 1;
      payL[selectedCard].imgStyle.left = size + "px";
      updateVal();
    } else if (selectedField !== "") {
      let inStyle = innerStyle[selectedField];
      let size = inStyle.left;
      size = size.replace("px", "");
      size = Number(size);
      size += 1;
      inStyle.left = size + "px";
      setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
    }
  };

  const zoomIn = () => {
    if (selectedCard !== null) {
      let payL = payload;
      let size = payL[selectedCard].imgStyle.fontSize;
      size = size.replace("px", "");
      size = Number(size);
      size += 1;
      payL[selectedCard].imgStyle.fontSize = size + "px";
      updateVal();
    } else if (selectedField !== "") {
      let inStyle = innerStyle[selectedField];
      let size = inStyle.fontSize;
      size = size.replace("px", "");
      size = Number(size);
      size += 1;
      inStyle.fontSize = size + "px";
      inStyle.lineHeight = size + "px";
      setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
    }
  };

  const zoomOut = () => {
    if (selectedCard !== null) {
      let payL = payload;
      let size = payL[selectedCard].imgStyle.fontSize;
      size = size.replace("px", "");
      size = Number(size);
      size -= 1;
      payL[selectedCard].imgStyle.fontSize = size + "px";
      updateVal();
    } else if (selectedField !== "") {
      let inStyle = innerStyle[selectedField];
      let size = inStyle.fontSize;
      size = size.replace("px", "");
      size = Number(size);
      size -= 1;
      inStyle.fontSize = size + "px";
      inStyle.lineHeight = size + "px";
      setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
    }
  };

  const getTabularData = (el) => {
    let data = fields;
    let tData = [];
    for (let i = 0; i < data.length; i++) {
      const elName = data[i].value;
      let row = null;
      if (innerStyle[elName].tableElement === true) {
        // if (elName !== "schoolTitle" && elName !== "schoolSubtitle" && elName !== "schoolAddress" && elName !== "signatureTitle" && elName !== "schoolTitle" && elName !== "image" && elName !== "schoolImage" && elName !== "schoolLogo" && elName !== "signature" && elName !== "table" && elName !== "tableHead" && elName !== "tableData"){
        row =
          el[elName] !== "" ? (
            <tr key={i}>
              <td
                style={{
                  fontSize: innerStyle.tableHead.fontSize,
                  fontWeight: innerStyle.tableHead.fontWeight,
                  fontFamily: innerStyle.tableHead.fontFamily,
                  textAlign: innerStyle.tableHead.textAlign,
                  textSize: innerStyle.tableHead.textSize,
                  textDecoration: innerStyle.tableHead.textDecoration,
                  padding: innerStyle.tableHead.padding,
                  width: innerStyle.tableHead.width,
                  border: innerStyle.tableHead.border,
                }}
              >
                {elName === "blood_group"
                  ? "B. GROUP"
                  : elName.replace("_", " ").toUpperCase()}
                <span style={{ float: "right", marginRight: "5px" }}>:</span>
              </td>
              <td
                style={{
                  wordWrap: "break",
                  whiteSpace: "normal",
                  fontSize: innerStyle.tableData.fontSize,
                  fontWeight: innerStyle.tableData.fontWeight,
                  fontFamily: innerStyle.tableData.fontFamily,
                  textAlign: innerStyle.tableData.textAlign,
                  textSize: innerStyle.tableData.textSize,
                  textDecoration: innerStyle.tableData.textDecoration,
                  padding: innerStyle.tableData.padding,
                  width: innerStyle.tableData.width,
                  border: innerStyle.tableData.border,
                }}
              >
                {el[elName]}
              </td>
            </tr>
          ) : null;
        tData.push(row);
      }
    }
    return tData;
  };

  const generateData = () => {
    let items = payload;
    let tData = [];
    for (let i = 0; i < items.length; i++) {
      let el = items[i];
      let row = (
        <div key={i} style={{ background: "#000" }}>
          <div style={styles.cardContainer}>
            <div style={styles.inline} id="right">
              <img
                src={prodData.template}
                style={styles.templateStyle}
                onClick={() => {
                  toggleToolbar(i);
                }}
              />

              <>
                <div style={{ position: "relative", width: "100%", zIndex: 2 }}>
                  {viewType === "tabular" ? (
                    <table
                      style={{
                        position: innerStyle.table.position,
                        tableLayout: "fixed",
                        top: innerStyle.table.top,
                        bottom: innerStyle.table.bottom,
                        right: innerStyle.table.right,
                        left: innerStyle.table.left,
                        margin: innerStyle.table.margin,
                        padding: innerStyle.table.padding,
                        width: innerStyle.table.width,
                        height: innerStyle.table.fontSize,
                        border: innerStyle.table.border,
                        textShadow: innerStyle.table.textShadow,
                      }}
                    >
                      <tbody>{getTabularData(el)}</tbody>
                    </table>
                  ) : null}
                  {viewType !== "tabular" &&
                    fields.map((ele, key2) => {
                      let elName = ele.value;
                      if (innerStyle[elName].isVisible === true) {
                        if (
                          elName !== "image" &&
                          elName !== "schoolImage" &&
                          elName !== "schoolLogo" &&
                          elName !== "signature"
                        ) {
                          return (
                            <p
                              key={key2}
                              style={{
                                position: innerStyle[elName].position,
                                fontSize: innerStyle[elName].fontSize,
                                fontWeight: innerStyle[elName].fontWeight,
                                fontStyle: innerStyle[elName].fontStyle,
                                fontFamily: innerStyle[elName].fontFamily,
                                textAlign: innerStyle[elName].textAlign,
                                textDecoration:
                                  innerStyle[elName].textDecoration,
                                top: innerStyle[elName].top,
                                bottom: innerStyle[elName].bottom,
                                right: innerStyle[elName].right,
                                left: innerStyle[elName].left,
                                margin: innerStyle[elName].margin,
                                padding: innerStyle[elName].padding,
                                color: innerStyle[elName].color,
                                lineHeight: innerStyle[elName].lineHeight,
                                textShadow: innerStyle[elName].textShadow,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: innerStyle.dataTitle.fontSize,
                                  fontWeight: innerStyle.dataTitle.fontWeight,
                                  fontStyle: innerStyle.dataTitle.fontStyle,
                                  fontFamily: innerStyle.dataTitle.fontFamily,
                                  textDecoration:
                                    innerStyle.dataTitle.textDecoration,
                                  color: innerStyle.dataTitle.color,
                                  lineHeight: innerStyle.dataTitle.lineHeight,
                                  textShadow: innerStyle.dataTitle.textShadow,
                                }}
                              >
                                {console.log(elName)}
                                {innerStyle[elName].showTitle === true
                                  ? innerStyle[elName].tableElement === true
                                    ? ""
                                    : elName.replace("_", " ").toUpperCase() +
                                      " : "
                                  : ""}
                              </span>
                              {elName === "schoolTitle" ||
                              elName === "schoolSubtitle" ||
                              elName === "schoolAddress" ||
                              elName === "signatureTitle"
                                ? prodData[elName]
                                : innerStyle[elName].tableElement === true
                                ? ""
                                : el[elName]}
                            </p>
                          );
                        }
                      } else {
                        // console.log(elName)
                        <span key={key2}></span>;
                      }
                    })}
                </div>
                {innerStyle.image && innerStyle.image.isVisible === true ? (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        textAlign: innerStyle.image.textAlign,
                        zIndex: 0,
                      }}
                    >
                      <img
                        src={el.image}
                        style={{
                          position:
                            el.imgStyle && el.imgStyle.position
                              ? el.imgStyle.position
                              : innerStyle.image.position,
                          top:
                            el.imgStyle && el.imgStyle.top
                              ? el.imgStyle.top
                              : innerStyle.image.top,
                          bottom:
                            el.imgStyle && el.imgStyle.bottom
                              ? el.imgStyle.bottom
                              : innerStyle.image.bottom,
                          right:
                            el.imgStyle && el.imgStyle.right
                              ? el.imgStyle.right
                              : innerStyle.image.right,
                          left:
                            el.imgStyle && el.imgStyle.left
                              ? el.imgStyle.left
                              : innerStyle.image.left,
                          margin:
                            el.imgStyle && el.imgStyle.margin
                              ? el.imgStyle.margin
                              : innerStyle.image.margin,
                          padding:
                            el.imgStyle && el.imgStyle.padding
                              ? el.imgStyle.padding
                              : innerStyle.image.padding,
                          width:
                            el.imgStyle && el.imgStyle.width
                              ? el.imgStyle.width
                              : innerStyle.image.width,
                          height:
                            el.imgStyle && el.imgStyle.fontSize
                              ? el.imgStyle.fontSize
                              : innerStyle.image.fontSize,
                          border:
                            el.imgStyle && el.imgStyle.border
                              ? el.imgStyle.border
                              : innerStyle.image.border,
                          textShadow:
                            el.imgStyle && el.imgStyle.textShadow
                              ? el.imgStyle.textShadow
                              : innerStyle.image.textShadow,

                          // position: items[i].imgStyle.position,
                          // top: items[i].imgStyle.top,
                          // bottom: items[i].imgStyle.bottom,
                          // right: items[i].imgStyle.right,
                          // left: items[i].imgStyle.left,
                          // margin: items[i].imgStyle.margin,
                          // padding: items[i].imgStyle.padding,
                          // width: items[i].imgStyle.width,
                          // height: items[i].imgStyle.fontSize,
                          // border: items[i].imgStyle.border,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        textAlign: innerStyle.schoolLogo.textAlign,
                        zIndex: 3,
                      }}
                    >
                      <img
                        src={prodData.schoolLogo}
                        style={{
                          position: innerStyle.schoolLogo.position,
                          top: innerStyle.schoolLogo.top,
                          bottom: innerStyle.schoolLogo.bottom,
                          right: innerStyle.schoolLogo.right,
                          left: innerStyle.schoolLogo.left,
                          margin: innerStyle.schoolLogo.margin,
                          padding: innerStyle.schoolLogo.padding,
                          width: innerStyle.schoolLogo.width,
                          height: innerStyle.schoolLogo.fontSize,
                          color: innerStyle.table.color,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        textAlign: innerStyle.signature.textAlign,
                        zIndex: 3,
                      }}
                    >
                      <img
                        src={prodData.signature}
                        style={{
                          position: innerStyle.signature.position,
                          top: innerStyle.signature.top,
                          bottom: innerStyle.signature.bottom,
                          right: innerStyle.signature.right,
                          left: innerStyle.signature.left,
                          margin: innerStyle.signature.margin,
                          padding: innerStyle.signature.padding,
                          width: innerStyle.signature.width,
                          height: innerStyle.signature.fontSize,
                          color: innerStyle.table.color,
                        }}
                      />
                    </div>
                  </>
                ) : null}
                {innerStyle.signature &&
                innerStyle.signature.isVisible === true ? (
                  <div>
                    <table
                      style={{
                        position: innerStyle.table.position,
                        zIndex: 1,
                        tableLayout: "fixed",
                        top: innerStyle.table.top,
                        bottom: innerStyle.table.bottom,
                        right: innerStyle.table.right,
                        left: innerStyle.table.left,
                        margin: innerStyle.table.margin,
                        padding: innerStyle.table.padding,
                        width: innerStyle.table.width,
                        height: innerStyle.table.fontSize,
                        border: innerStyle.table.border,
                        color: innerStyle.table.color,
                        textShadow: innerStyle.table.textShadow,
                      }}
                    >
                      <tbody>{getTabularData(el)}</tbody>
                    </table>
                  </div>
                ) : null}
              </>
            </div>
            {/* {selectedCard !== null && selectedCard === i ? (
                            <div className="col-12 mt-2 text-center">
                                <BsArrowUpCircle onClick={() => {
                                    moveUp(items);                                    
                                }} style={{ cursor: 'pointer' }} />
                                <BsArrowDownCircle onClick={() => {
                                    moveDown(items);
                                }} style={{ marginLeft: '10px', cursor: 'pointer' }} />
                                <BsArrowLeftCircle onClick={() => {
                                    moveLeft();
                                }} style={{ marginLeft: '10px', cursor: 'pointer' }} />
                                <BsArrowRightCircle onClick={() => {
                                    moveRight();
                                }} style={{ marginLeft: '10px', cursor: 'pointer' }} />
                                <BsFillPatchPlusFill onClick={() => {
                                    zoomIn()
                                }} style={{ marginLeft: '10px', cursor: 'pointer' }} />
                                <BsFillPatchMinusFill onClick={() => {
                                    zoomOut()
                                }} style={{ marginLeft: '10px', cursor: 'pointer' }} />
                            </div>
                        ) : null} */}
          </div>
        </div>
      );
      tData.push(row);
    }
    return tData;
  };

  return (
    <>
      <PageWrapper title="Print Sheet (Sticker)">
        <div className="row card p-3">
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-md-2 mb-3">
                <Select
                  label="Select Field"
                  data={fields}
                  value={selectedField}
                  onChange={(val) => {
                    setSelectedField(val);
                  }}
                />
              </div>
              <div className="col-12 col-md-2 mb-3">
                <Select
                  label="Show Style"
                  value={showStyle === true ? "yes" : "no"}
                  data={[
                    { name: "Yes", value: "yes" },
                    { name: "No", value: "no" },
                  ]}
                  onChange={(val) => {
                    if (val === "yes") toggleStyle(true);
                    else toggleStyle(false);
                  }}
                />
              </div>
              {selectedField !== "" ? (
                <div className="col-12">
                  <div className="row">
                    <div className="col-12 col-md-2 mb-3">
                      <Select
                        label="Visibility"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].isVisible
                            : ""
                        }
                        data={[
                          { name: "Yes", value: "true" },
                          { name: "No", value: "false" },
                        ]}
                        onChange={(val) => {
                          let inStyle = innerStyle;
                          inStyle[selectedField]["isVisible"] = JSON.parse(val);
                          setInnerStyle(inStyle);
                          updateVal();
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <Select
                        label="Table Element"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].tableElement
                            : ""
                        }
                        data={[
                          { name: "Yes", value: "true" },
                          { name: "No", value: "false" },
                        ]}
                        onChange={(val) => {
                          let inStyle = innerStyle;
                          inStyle[selectedField]["tableElement"] =
                            JSON.parse(val);
                          setInnerStyle(inStyle);
                          updateVal();
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <Select
                        label="Show Title"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].showTitle
                            : ""
                        }
                        data={[
                          { name: "Yes", value: "true" },
                          { name: "No", value: "false" },
                        ]}
                        onChange={(val) => {
                          let inStyle = innerStyle;
                          inStyle[selectedField]["showTitle"] = JSON.parse(val);
                          setInnerStyle(inStyle);
                          updateVal();
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-2 mb-3">
                      <Select
                        label="Position"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].position
                            : ""
                        }
                        data={[
                          { name: "Absolute", value: "absolute" },
                          { name: "Relative", value: "relative" },
                        ]}
                        onChange={(val) => {
                          let inStyle = innerStyle;
                          inStyle[selectedField]["position"] = val;
                          setInnerStyle(inStyle);
                          updateVal();
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <Select
                        label="Weight"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].fontWeight
                            : ""
                        }
                        data={[
                          { name: "Normal", value: "normal" },
                          { name: "Bold", value: "bold" },
                          { name: "Bolder", value: "bolder" },
                          { name: "400", value: "400" },
                          { name: "500", value: "500" },
                          { name: "600", value: "600" },
                          { name: "700", value: "700" },
                        ]}
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.fontWeight = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <Select
                        label="Decoration"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].textDecoration
                            : ""
                        }
                        data={[
                          { name: "None", value: "none" },
                          { name: "Underline", value: "underline" },
                          { name: "Overline", value: "overline" },
                          { name: "Line Through", value: "line-through" },
                        ]}
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.textDecoration = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <Select
                        label="Style"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].fontStyle
                            : ""
                        }
                        data={[
                          { name: "Normal", value: "normal" },
                          { name: "Italic", value: "italic" },
                          { name: "Oblique", value: "oblique" },
                        ]}
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.fontStyle = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <Select
                        label="Align"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].textAlign
                            : ""
                        }
                        data={[
                          { name: "Left", value: "left" },
                          { name: "Center", value: "center" },
                          { name: "Right", value: "right" },
                        ]}
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.textAlign = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Width"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].width
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.width = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Border"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].border
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.border = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Size"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].fontSize
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.fontSize = val;
                          inStyle.lineHeight = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Margin"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].margin
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.margin = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Top"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].top
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.top = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Bottom"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].bottom
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.bottom = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Right"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].right
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.right = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Left"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].left
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.left = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Padding"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].padding
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.padding = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Line Height"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].lineHeight
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.lineHeight = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Color"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].color
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.color = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Font Family"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].fontFamily
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.fontFamily = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-2 mb-3">
                      <TextInput
                        label="Shadow"
                        value={
                          innerStyle[selectedField]
                            ? innerStyle[selectedField].textShadow
                            : ""
                        }
                        onChange={(val) => {
                          let inStyle = innerStyle[selectedField];
                          inStyle.textShadow = val;
                          setInnerStyle({
                            ...innerStyle,
                            [selectedField]: inStyle,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              {showStyle === true ? (
                <div className="col-12 mb-3">
                  <textarea
                    className="form-control"
                    rows={20}
                    cols={200}
                    label="Payload"
                    value={JSON.stringify(payload)}
                    onChange={(val) => {
                      // let inStyle = innerStyle[selectedField];
                      // inStyle.textShadow = val;
                      // setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                      // console.log()
                      setPayload(eval(val.target.value));
                    }}
                  />
                </div>
              ) : null}
              <div className="col-12 col-md-12 mb-3 text-right">
                <button
                  className="btn btn-theme"
                  onClick={() => {
                    savePrintStyleService({
                      key: prodData.ref,
                      style: innerStyle,
                    }).then((res) => {
                      if (res.status === 200) {
                        if (res.data.status === "success") {
                          toast.success(res.data.msg);
                        } else {
                          toast.error(res.data.msg);
                        }
                      } else {
                        toast.error("Something went wrong.");
                      }
                    });
                  }}
                >
                  Save Style
                </button>
                <button className="btn btn-theme" onClick={printReport}>
                  Print
                </button>
                <button className="btn btn-theme" onClick={exportAsImage}>
                  Export
                </button>
              </div>
            </div>
          </div>
          <h5>For center - 12x18 left (0.5mm) | A4 left (14mm)</h5>
          <hr />
          <div ref={componentRef}>
            {payload.length > 0 && fields.length > 0 ? generateData() : null}
          </div>
        </div>
      </PageWrapper>
      <div
        style={{ position: "fixed", bottom: "0px", zIndex: "3", width: "100%" }}
      >
        <div className="col-12">
          <div style={{ height: "50px", background: "#687484" }}>
            <div className="row">
              <div className="col-12 col-md-6 mt-2 text-center">
                <div style={{ width: "200px", float: "right" }}>
                  <Select
                    data={fields}
                    value={selectedField}
                    onChange={(val) => {
                      setSelectedField(val);
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 text-left">
                <BsArrowUpCircle
                  onClick={() => {
                    moveUp();
                  }}
                  style={{
                    cursor: "pointer",
                    fontSize: "30px",
                    color: "white",
                    marginTop: "10px",
                  }}
                />
                <BsArrowDownCircle
                  onClick={() => {
                    moveDown();
                  }}
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                    fontSize: "30px",
                    color: "white",
                    marginTop: "10px",
                  }}
                />
                <BsArrowLeftCircle
                  onClick={() => {
                    moveLeft();
                  }}
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                    fontSize: "30px",
                    color: "white",
                    marginTop: "10px",
                  }}
                />
                <BsArrowRightCircle
                  onClick={() => {
                    moveRight();
                  }}
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                    fontSize: "30px",
                    color: "white",
                    marginTop: "10px",
                  }}
                />
                <BsFillPatchPlusFill
                  onClick={() => {
                    zoomIn();
                  }}
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                    fontSize: "30px",
                    color: "white",
                    marginTop: "10px",
                  }}
                />
                <BsFillPatchMinusFill
                  onClick={() => {
                    zoomOut();
                  }}
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                    fontSize: "30px",
                    color: "white",
                    marginTop: "10px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintSticker;
