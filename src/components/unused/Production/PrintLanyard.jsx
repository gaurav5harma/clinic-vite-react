import React, {useState, useEffect, useRef} from 'react'
import PageWrapper from '../../hoc/PageWrapper';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
import Icons from '../../assets/theme/Icons';
import Colors from '../../assets/theme/Colors';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getLanyardProductionDetailsService, getProductionDetailsService, savePrintStyleService } from '../../services/HTTPService';
import sty from './PrintSheet.module.css';
import { useReactToPrint } from 'react-to-print';
import { NumInput, Select, TextInput } from '../Shared/Elements';
import styled from "styled-components";
import { BsArrowDownCircle, BsArrowLeftCircle, BsArrowRightCircle, BsArrowUp, BsArrowUpCircle, BsBootstrapReboot, BsFileEarmarkArrowUp, BsFillPatchMinusFill, BsFillPatchPlusFill, BsFillPlusCircleFill } from 'react-icons/bs';


const PrintLanyard = (props) => {
    const key = useParams().ref;
    const componentRef = useRef();
    const navigate = useNavigate();
    const [prodData, setProdData] = useState(null);
    const [payload, setPayload] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStyle, toggleStyle] = useState(false);
    const [additionalStyle, setAdditionalStyle] = useState([]);
    const [viewType, setViewType] = useState("normal");
    const [page, setPage] = useState(1);
    const [printType, setPrintType] = useState("all");
    const [selectedCard, setSelectedCard] = useState(null);
    
    const fixedFields = [
        { name: "School Title", value: "schoolTitle" },
        { name: "School Title Right", value: "schoolTitleRight" },
        { name: "School Logo", value: "schoolLogo" },
        { name: "School Logo Right", value: "schoolLogoRight" },
        { name: "School Image", value: "schoolImage" },
        { name: "School Image Right", value: "schoolImageRight" },
        { name: "School Subtitle", value: "schoolSubtitle" },
        { name: "School Subtitle Right", value: "schoolSubtitleRight" },
        { name: "School Address", value: "schoolAddress" },
        { name: "School Address Right", value: "schoolAddressRight" },
        { name: "Session", value: "session" },
        { name: "Session Right", value: "sessionRight" }
    ];
    const [fields, setFields] = useState(fixedFields);
    const defaultInnerStyle = {
        schoolTitle: {
            isVisible: false,
            showTitle: false,
            position: 'absolute',
            textAlign: 'left',
            textDecoration: 'none',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            padding: '0px',
            margin: '0px',
            color: 'black',
            fontFamily: 'Poppins',
            lineHeight: '15px',
        },
        schoolSubtitle: {
            isVisible: false,
            showTitle: false,
            position: 'absolute',
            textAlign: 'left',
            textDecoration: 'none',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            padding: '0px',
            margin: '0px',
            color: 'black',
            fontFamily: 'Poppins',
            lineHeight: '15px',
        },
        schoolLogo: {
            isVisible: true,
            showTitle: true,
            type: 'image',
            position: 'absolute',
            fontSize: '15px',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            padding: '0px',
            margin: '0px',
            height: '100px',
            width: 'auto'
        },
        schoolImage: {
            isVisible: true,
            showTitle: true,
            type:'image',
            position: 'absolute',
            fontSize: '15px',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            padding: '0px',
            margin: '0px',
            height: '100px',
            width: 'auto'
        },
        schoolAddress: {
            isVisible: true,
            showTitle: false,
            position: 'absolute',
            textAlign: 'left',
            textDecoration: 'none',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            padding: '0px',
            margin: '0px',
            color: 'black',
            fontFamily: 'Poppins',
            lineHeight: '15px',
        },
        session: {
            isVisible: false,
            showTitle: false,
            position: 'absolute',
            textAlign: 'left',
            textDecoration: 'none',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            padding: '0px',
            margin: '0px',
            color: 'black',
            fontFamily: 'Poppins',
            lineHeight: '15px',
        },

        schoolTitleRight: {
            isVisible: false,
            showTitle: false,
            position: 'absolute',
            textAlign: 'left',
            textDecoration: 'none',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            padding: '0px',
            margin: '0px',
            color: 'black',
            fontFamily: 'Poppins',
            lineHeight: '15px',
        },
        schoolSubtitleRight: {
            isVisible: false,
            showTitle: false,
            position: 'absolute',
            textAlign: 'left',
            textDecoration: 'none',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            padding: '0px',
            margin: '0px',
            color: 'black',
            fontFamily: 'Poppins',
            lineHeight: '15px',
        },
        schoolLogoRight: {
            isVisible: true,
            showTitle: true,
            type: 'image',
            position: 'absolute',
            fontSize: '15px',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            padding: '0px',
            margin: '0px',
            height: '100px',
            width: 'auto'
        },
        schoolImageRight: {
            isVisible: true,
            showTitle: true,
            type: 'image',
            position: 'absolute',
            fontSize: '15px',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            padding: '0px',
            margin: '0px',
            height: '100px',
            width: 'auto'
        },
        schoolAddressRight: {
            isVisible: true,
            showTitle: false,
            position: 'absolute',
            textAlign: 'left',
            textDecoration: 'none',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            padding: '0px',
            margin: '0px',
            color: 'black',
            fontFamily: 'Poppins',
            lineHeight: '15px',
        },
        sessionRight: {
            isVisible: false,
            showTitle: false,
            position: 'absolute',
            textAlign: 'left',
            textDecoration: 'none',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            top: '0px',
            bottom: '0px',
            right: '0px',
            left: '0px',
            padding: '0px',
            margin: '0px',
            color: 'black',
            fontFamily: 'Poppins',
            lineHeight: '15px',
        }
    }

    const toggleToolbar = (idx)=>{
        if(selectedCard===idx){
            setSelectedCard(null)
        }
        else{
            setSelectedCard(idx)
        }
    }
    const [innerStyle, setInnerStyle] = useState(defaultInnerStyle);
    const [selectedField, setSelectedField] = useState("");
    const [update, setUpdateVal] = useState(0);
    const [cardStyle, setCardStyle] = useState({
        height: 19,
        width: 762,
        markerColor: 'yellow',
        unit: 'mm',
        background:'red',
        zoom:.38
    });

    const [styles, setStyle] = useState({
        cardContainer: {
            display: 'block',
            float: 'left',
            // margin: '6px 9px',
            pageBreakInside: 'avoid',
            width: cardStyle.width + cardStyle.unit

        },
        inline: {
            width: cardStyle.width + cardStyle.unit,
            height: cardStyle.height + cardStyle.unit,
            color: 'black',
            position: 'relative'
        },
        templateStyle: {
            cursor: 'pointer',
            border: '1px solid #eaeaea',
            width: (cardStyle.width) + cardStyle.unit,
            height: '100%',
            position: 'absolute',
            zIndex: 1
        }
    });
    const getDetails = (page, printType) => {
        // if (loading === true) {
        //     setLoading(false);
        setPayload([])

        getLanyardProductionDetailsService({ key: key }).then(res=>{
                if (res.status === 200) {
                    if (res.data.status === "success") {
                       
                        if(res.data.prodData.template.includes("C1")){
                            let sty = styles;
                            sty.cardContainer.width = '762mm';
                            let card = cardStyle;
                            card.width=762
                            setCardStyle(card)
                            setStyle(sty)
                        }
                        if (res.data.prodData.template.includes("C2")) {
                            let sty = styles;
                            sty.cardContainer.width = '838mm';
                            let card = cardStyle;
                            card.width = 838
                            setCardStyle(card)
                            setStyle(sty)
                        }
                        if (res.data.prodData.template.includes("C3")) {
                            if (res.data.prodData.type.includes("20mm")) {
                                let sty = styles;
                                sty.cardContainer.width = '914mm';
                                sty.cardContainer.height = '23mm';
                                let card = cardStyle;
                                card.width = 914
                                card.height = 23
                                setCardStyle(card)
                                setStyle(sty)
                            }
                            else {
                                let sty = styles;
                                sty.cardContainer.width = '914mm';
                                let card = cardStyle;
                                card.width = 914
                                setCardStyle(card)
                                setStyle(sty)
                            }
                        }
                        setProdData(res.data.prodData)
                        setPayload({...payload,title:res.data.prodData.schoolTitle})
                        // setInnerStyle(res.data.data.prodData.innerStyle !== null ? res.data.data.prodData.innerStyle : defaultInnerStyle)
                        if (res.data.prodData.innerStyle!==null){
                            setInnerStyle({ ...innerStyle, ...res.data.prodData.innerStyle })
                        }
                        // setLoading(true)
                        // if (res.data.data.prodData.additionalStyle && res.data.data.prodData.additionalStyle.length>0){
                        //     setAdditionalStyle({ ...innerStyle, ...res.data.data.prodData.additionalStyle })
                        // }
                        // else{
                        //     let addSty = [];

                        // }
                        
                    } else {
                        toast.error(res.data.msg);
                    }
                } else {
                    toast.error("Something went wrong.");
                }
            });

        // }
    };

    useEffect(() => {
        if(key){
            getDetails(page, printType);
        }
        else{
            history.back();
        }
    }, []);

    const printReport = useReactToPrint({
        content: () => componentRef.current,
    });

    const updateVal=()=>{
        let upd = update;
        upd+=1;
        setUpdateVal(upd);
    }


    const exportAsImage = async () => {
        const canvas = await html2canvas(componentRef.current);
        const image = canvas.toDataURL('image/jpg');

        // Download the image
        const link = document.createElement('a');
        link.href = image;
        link.download = 'image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const rotate = (pay) => {
        if (selectedCard !== null) {
            let payL = payload;
            let rotate = payL[selectedCard].imgStyle.rotate ? payL[selectedCard].imgStyle.rotate:'0deg';
            size = size.replace('deg', '');
            size = Number(size);
            size += 45;
            payL[selectedCard].imgStyle.rotate = size + 'deg';
            updateVal()
        }
        else if (selectedField !== "") {
            let inStyle = innerStyle[selectedField];
            let size = inStyle.rotate?inStyle.rotate:'0deg';
            size = size.replace('deg', '');
            size = Number(size);
            size += 45;
            inStyle.rotate = size + 'deg';
            setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
        }
    }

    const moveUp = (pay) => {
        if (selectedCard !== null) {
            let payL = payload;
            let size = payL[selectedCard].imgStyle.top;
            size = size.replace('px', '');
            size = Number(size);
            size -= 1;
            payL[selectedCard].imgStyle.top = size + 'px';
            updateVal()
        }
        else if (selectedField !== "") {
            let inStyle = innerStyle[selectedField];
            let size = inStyle.top;
            size = size.replace('px', '');
            size = Number(size);
            size -= 1;
            inStyle.top = size + 'px';
            setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
        }
    }

    const moveDown = (payL) => {
        if (selectedCard !== null) {
            let payL = payload;
            let size = payL[selectedCard].imgStyle.top;
            size = size.replace('px', '');
            size = Number(size);
            size += 1;
            payL[selectedCard].imgStyle.top = size + 'px';
            updateVal()
        }
        else if (selectedField !== "") {
            let inStyle = innerStyle[selectedField];
            let size = inStyle.top;
            size = size.replace('px', '');
            size = Number(size);
            size += 1;
            inStyle.top = size + 'px';
            setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
        }
    }

    const moveLeft = () => {
        if (selectedCard !== null) {
            let payL = payload;
            let size = payL[selectedCard].imgStyle.left;
            size = size.replace('px', '');
            size = Number(size);
            size -= 1;
            payL[selectedCard].imgStyle.left = size + 'px';
            updateVal()
        }
        else if (selectedField !== "") {
            let inStyle = innerStyle[selectedField];
            let size = inStyle.left;
            size = size.replace('px', '');
            size = Number(size);
            size -= 1;
            inStyle.left = size + 'px';
            setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
        }
        
    }

    const moveRight = () => {
        if (selectedCard !== null) {
            let payL = payload;
            let size = payL[selectedCard].imgStyle.left;
            size = size.replace('px', '');
            size = Number(size);
            size += 1;
            payL[selectedCard].imgStyle.left = size + 'px';
            updateVal()
        }
        else if (selectedField !== "") {
            let inStyle = innerStyle[selectedField];
            let size = inStyle.left;
            size = size.replace('px', '');
            size = Number(size);
            size += 1;
            inStyle.left = size + 'px';
            setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
        }
    }

    const zoomIn = () => {
        if (selectedCard !== null) {
            let payL = payload;
            let size = payL[selectedCard].imgStyle.fontSize;
            size = size.replace('px', '');
            size = Number(size);
            size += 1;
            payL[selectedCard].imgStyle.fontSize = size + 'px';
            updateVal()
        }
        else if (selectedField !== "") {
            let inStyle = innerStyle[selectedField];
            let size = inStyle.fontSize;
            size = size.replace('px', '');
            size = Number(size);
            size += 1;
            inStyle.fontSize = size + 'px';
            inStyle.lineHeight = size + 'px';
            setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
        }
    }

    const zoomOut = () => {
        if (selectedCard !== null) {
            let payL = payload;
            let size = payL[selectedCard].imgStyle.fontSize;
            size = size.replace('px', '');
            size = Number(size);
            size -= 1;
            payL[selectedCard].imgStyle.fontSize = size + 'px';
            updateVal()
        }
        else if (selectedField !== "") {
            let inStyle = innerStyle[selectedField];
            let size = inStyle.fontSize;
            size = size.replace('px', '');
            size = Number(size);
            size -= 1;
            inStyle.fontSize = size + 'px';
            inStyle.lineHeight = size + 'px';
            setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
        }
    }

    const ruler = (
           <></>
    );
    const generateData=()=>{
        let items = payload;
        let tData = [];
        let count=cardStyle.height===19?16:13;
        for (let i = 0; i < count; i++) {
            let el = items[i];
            let row = (
                <div key={i} style={{ background: "#fff",marginLeft:'10mm' }}>

                    <div style={styles.cardContainer}>
                        <div style={{ width: '6mm', height: '1.5mm', background: cardStyle.markerColor, position: 'absolute', marginTop: '0mm' }}></div>
                        {/* TOP LEFT */}
                        <div style={{ color: 'white', position: 'absolute', marginTop: '5mm', marginLeft: '5mm' }}><h2>{Number(cardStyle.width) === 762 ? 'C1' : Number(cardStyle.width) === 838 ? 'C2' : Number(cardStyle.width) === 914 ? 'C3' : '0'}</h2></div>
                        {/* TOP RIGHT */}
                        <div style={{ width: '6mm', height: '1.5mm', background: cardStyle.markerColor, position: 'absolute', marginTop: '0mm', marginLeft:cardStyle.width-6+cardStyle.unit }}></div>
                        {/* BOTTOM LEFT */}
                        <div style={{ width: '6mm', height: '1.5mm', background: cardStyle.markerColor, position: 'absolute', marginTop: cardStyle.height - 1.5 + cardStyle.unit }}></div>
                        {/* BOTTOM RIGHT */}
                        <div style={{ width: '6mm', height: '1.5mm', background: cardStyle.markerColor, position: 'absolute', marginTop: cardStyle.height - 1.5 + cardStyle.unit, marginLeft: cardStyle.width - 6 + cardStyle.unit }}></div>
                        <img src={payload && payload.image? payload.image.value:prodData.template} alt="Lanyard" style={{ width: cardStyle.width + cardStyle.unit, height: cardStyle.height + cardStyle.unit }} />
                        <div style={{ position: 'relative', width: '100%', zIndex: 2 }}>
                            {fields.map((ele, key2) => {
                                let elName = ele.value;
                                if (elName !== "" &&  innerStyle[elName].isVisible === true) {
                                    if (elName !== "schoolLogoRight" && elName !== "schoolImage" && !elName.includes('Right')) {
                                        return (
                                            <p key={key2}
                                                onClick={() => {
                                                    setSelectedField(elName)
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    position: innerStyle[elName].position,
                                                    fontSize: innerStyle[elName].fontSize,
                                                    fontWeight: innerStyle[elName].fontWeight,
                                                    fontStyle: innerStyle[elName].fontStyle,
                                                    fontFamily: innerStyle[elName].fontFamily,
                                                    textAlign: innerStyle[elName].textAlign,
                                                    textDecoration: innerStyle[elName].textDecoration,
                                                    top: innerStyle[elName].top,
                                                    bottom: innerStyle[elName].bottom,
                                                    right: innerStyle[elName].right,
                                                    left: innerStyle[elName].left,
                                                    margin: innerStyle[elName].margin,
                                                    padding: innerStyle[elName].padding,
                                                    color: innerStyle[elName].color,
                                                    lineHeight: innerStyle[elName].lineHeight,
                                                    textShadow: innerStyle[elName].textShadow,
                                                    rotate: innerStyle[elName].rotate ? innerStyle[elName].rotate : '0deg',
                                                }}
                                            >
                                                {(elName === "schoolTitle" || elName === "schoolSubtitle" || elName === "schoolAddress" || elName === "signatureTitle") ? payload?payload.title:'' : ''}
                                            </p>
                                        )
                                    }
                                    if (elName !== "schoolLogo" && elName !== "schoolLogoRight" && elName.includes('Right')) {
                                        return (
                                            <p key={key2}
                                                onClick={() => {
                                                    setSelectedField(elName)
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    position: innerStyle[elName].position,
                                                    fontSize: innerStyle[elName].fontSize,
                                                    fontWeight: innerStyle[elName].fontWeight,
                                                    fontStyle: innerStyle[elName].fontStyle,
                                                    fontFamily: innerStyle[elName].fontFamily,
                                                    textAlign: innerStyle[elName].textAlign,
                                                    textDecoration: innerStyle[elName].textDecoration,
                                                    top: innerStyle[elName].top,
                                                    bottom: innerStyle[elName].bottom,
                                                    right: innerStyle[elName].right,
                                                    left: innerStyle[elName].left,
                                                    margin: innerStyle[elName].margin,
                                                    padding: innerStyle[elName].padding,
                                                    color: innerStyle[elName].color,
                                                    lineHeight: innerStyle[elName].lineHeight,
                                                    textShadow: innerStyle[elName].textShadow,
                                                    rotate: innerStyle[elName].rotate ? innerStyle[elName].rotate : '0deg',
                                                }}
                                            >
                                                {(elName === "schoolTitleRight" || elName === "schoolSubtitleRight" || elName === "schoolAddressRight") ? payload?payload.title:'' : ''}
                                            </p>
                                        )
                                    }
                                }
                                else {
                                    // console.log(elName)
                                    <span key={key2}></span>
                                }
                            })}
                        </div>
                        {innerStyle.schoolLogo.isVisible === true ? (
                            <>
                                <div style={{ position: 'absolute', width: '100%', textAlign: innerStyle.schoolLogo.textAlign, zIndex: 3 }}>
                                    <img src={payload && payload.imageLogo? payload.imageLogo.value:prodData.schoolLogo}
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
                                            rotate: innerStyle.schoolLogo.rotate ? innerStyle.schoolLogo.rotate : '0deg',

                                        }}
                                        onClick={() => {
                                            setSelectedField('schoolLogo')
                                        }}
                                    />
                                </div>
                            </>
                        ) : null}
                        {innerStyle.schoolLogoRight.isVisible === true ? (
                            <>
                                <div style={{ position: 'absolute', width: '100%', textAlign: innerStyle.schoolLogoRight.textAlign, zIndex: 3 }}>
                                    <img src={payload && payload.imageLogo? payload.imageLogo.value:prodData.schoolLogo}
                                        style={{
                                            position: innerStyle.schoolLogoRight.position,
                                            top: innerStyle.schoolLogoRight.top,
                                            bottom: innerStyle.schoolLogoRight.bottom,
                                            right: innerStyle.schoolLogoRight.right,
                                            left: innerStyle.schoolLogoRight.left,
                                            margin: innerStyle.schoolLogoRight.margin,
                                            padding: innerStyle.schoolLogoRight.padding,
                                            width: innerStyle.schoolLogoRight.width,
                                            height: innerStyle.schoolLogoRight.fontSize,
                                            rotate: innerStyle.schoolLogoRight.rotate ? innerStyle.schoolLogoRight.rotate : '0deg',

                                        }}
                                        onClick={() => {
                                            setSelectedField('schoolLogoRight')
                                        }}
                                    />
                                </div>
                            </>
                        ) : null}
                        
                    </div>
                </div>
            )
            tData.push(row)
        }
        return tData;
    }
    const browseAttachment = (event) => {
        let fileinfo = event.target.files[0];
        let name = event.target.name;
        
        if (fileinfo && fileinfo.size / 2024 <= 1024) {
          fileToDataUri(fileinfo).then((dataUri) => {
            let data = {
              title: fileinfo,
              item: name,
              value: dataUri,
            };
            setPayload({ ...payload, image: data });
            // setImageChangeModal(true)
    
          });
        } else {
          toast.error("File size should be less than 1MB.");
        }
      };
    const browseAttachment2 = (event) => {
        let fileinfo = event.target.files[0];
        let name = event.target.name;
        
        if (fileinfo && fileinfo.size / 2024 <= 1024) {
          fileToDataUri(fileinfo).then((dataUri) => {
            let data = {
              title: fileinfo,
              item: name,
              value: dataUri,
            };
            setPayload({ ...payload, imageLogo: data });
            // setImageChangeModal(true)
    
          });
        } else {
          toast.error("File size should be less than 1MB.");
        }
      };
    
      const fileToDataUri = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            // console.log("event.target.result", event.target.result);
            resolve(event.target.result);
          };
          // reader.onloadend = () => {
          //   setPayload({ ...payload, image: reader.result });
          // };
          reader.readAsDataURL(file);
        });


return (
    <>
 <PageWrapper title="Print Lanyard">
   <div className="row card p-3">
    <div className="col-12">
           <div className="row">
            <div className="col-12 col-md-2 mb-3">
                <Select
                    label="Select Field"
                            data={fields}
                    value={selectedField}
                    onChange={(val)=>{
                        setSelectedField(val)
                    }}
                />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <Select
                                label="Show Style"
                                value={showStyle === true ? 'yes' : 'no'}
                                data={[{ name: 'Yes', value: 'yes' }, { name: 'No', value: 'no' }]}
                                onChange={(val) => {
                                    if (val === "yes")
                                        toggleStyle(true);
                                    else
                                        toggleStyle(false);
                                }}
                            />
                        </div>
                        {/* <div className="col-12 col-md-2 mb-3">
                            <Select
                                label="Lanyard Size"
                                value={cardStyle.width}
                                data={[{ name: 'C1 Lanyard', value: 762 }, { name: 'C2 Lanyard', value: 838 }, { name: 'C3 Lanyard', value: 914 }]}
                                onChange={(val) => {
                                    // console.log('size changed'+val)
                                    let sty = styles;
                                    sty.cardContainer.width = val+'mm';
                                    let card = cardStyle;
                                    card.width = val
                                    setCardStyle(card)
                                    setStyle(sty)
                                }}
                                disabled={true}
                            />
                        </div> */}
                        <div className="col-12 col-md-2 mb-3">
                            <Select
                                label="Lanyard Width"
                                value={cardStyle.height}
                                data={[{ name: '16mm', value: '19' }, { name: '20mm', value: '23' }]}
                                onChange={(val) => {
                                    setCardStyle({ ...cardStyle, height: val })
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <TextInput
                                label="Color"
                                value={cardStyle.markerColor}
                                onChange={(val) => {
                                    setCardStyle({...cardStyle,markerColor:val})
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <TextInput
                                label="Background"
                                value={cardStyle.background}
                                onChange={(val) => {
                                    setCardStyle({...cardStyle,background:val})
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <NumInput
                                label="Zoom"
                                value={cardStyle.zoom}
                                onChange={(val) => {
                                    setCardStyle({...cardStyle,zoom:val})
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <label htmlFor="">Select Lanyard</label>
                            <input
                                type="file"
                            // value={payload.image?payload.image.title:''}
                                className="form-control"
                                // ref={fileInputRef}
                                onChange={(e) => {
                                
                                browseAttachment(e);
                                }}
                                // style={{display:'none'}}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <label htmlFor="">Select Logo</label>
                            <input
                                type="file"
                            // value={payload.image?payload.image.title:''}
                                className="form-control"
                                // ref={fileInputRef}
                                onChange={(e) => {
                                
                                browseAttachment2(e);
                                }}
                                // style={{display:'none'}}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <TextInput
                                label="Title"
                                value={payload.title}
                                onChange={(val) => {
                                    setPayload({...payload,title:val})
                                }}
                            />
                        </div>
            {selectedField!==""?(
                <div className="col-12">
                    <div className="row">
                                <div className="col-12 col-md-2 mb-3">
                                    <Select
                                        label="Visibility"
                                        value={innerStyle[selectedField] ? innerStyle[selectedField].isVisible : ''}
                                        data={[{ name: 'Yes', value: 'true' }, { name: 'No', value: 'false' }]}
                                        onChange={(val) => {
                                            let inStyle = innerStyle;
                                            inStyle[selectedField]['isVisible'] = JSON.parse(val);
                                            setInnerStyle(inStyle);
                                            updateVal();
                                        }}
                                    />
                                </div>
                                <div className="col-12 col-md-2 mb-3">
                                    <Select
                                        label="Table Element"
                                        value={innerStyle[selectedField] ? innerStyle[selectedField].tableElement : ''}
                                        data={[{ name: 'Yes', value: 'true' }, { name: 'No', value: 'false' }]}
                                        onChange={(val) => {
                                            let inStyle = innerStyle;
                                            inStyle[selectedField]['tableElement'] = JSON.parse(val);
                                            setInnerStyle(inStyle);
                                            updateVal();
                                        }}
                                    />
                                </div>
                        <div className="col-12 col-md-2 mb-3">
                            <Select
                                label="Show Title"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].showTitle : ''}
                                data={[{ name: 'Yes', value: 'true' }, { name: 'No', value: 'false' }]}
                                onChange={(val) => {
                                    let inStyle = innerStyle;
                                    inStyle[selectedField]['showTitle'] = JSON.parse(val);
                                    setInnerStyle(inStyle);
                                    updateVal();
                                }}
                            />
                        </div>
                        
                        <div className="col-12 col-md-2 mb-3">
                            <Select
                                label="Position"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].position : ''}
                                data={[{ name: 'Absolute', value: 'absolute' }, { name: 'Relative', value: 'relative' }]}
                                onChange={(val) => {
                                    let inStyle = innerStyle;
                                    inStyle[selectedField]['position'] = val;
                                    setInnerStyle(inStyle);
                                    updateVal();
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <Select
                                label="Weight"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].fontWeight : ''}
                                data={[{ name: 'Normal', value: 'normal' }, { name: 'Bold', value: 'bold' }, { name: 'Bolder', value: 'bolder' }, { name: '400', value: '400' }, { name: '500', value: '500' }, { name: '600', value: '600' }, { name: '700', value: '700' }]}
                                onChange={(val) => {
                                    let inStyle = innerStyle[selectedField];
                                    inStyle.fontWeight = val;
                                    setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <Select
                                label="Decoration"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].textDecoration : ''}
                                data={[{ name: 'None', value: 'none' }, { name: 'Underline', value: 'underline' }, { name: 'Overline', value: 'overline' }, { name: 'Line Through', value: 'line-through' }]}
                                onChange={(val) => {
                                    let inStyle = innerStyle[selectedField];
                                    inStyle.textDecoration = val;
                                    setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <Select
                                label="Style"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].fontStyle : ''}
                                data={[{ name: 'Normal', value: 'normal' }, { name: 'Italic', value: 'italic' }, { name: 'Oblique', value: 'oblique' }]}
                                onChange={(val) => {
                                    let inStyle = innerStyle[selectedField];
                                    inStyle.fontStyle = val;
                                    setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <Select
                                label="Align"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].textAlign : ''}
                                data={[{ name: 'Left', value: 'left' }, { name: 'Center', value: 'center' }, { name: 'Right', value: 'right' }]}
                                onChange={(val) => {
                                    let inStyle = innerStyle[selectedField];
                                    inStyle.textAlign = val;
                                    setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                }}
                            />
                                </div>
                                <div className="col-12 col-md-2 mb-3">
                                    <TextInput
                                        label="Width"
                                        value={innerStyle[selectedField] ? innerStyle[selectedField].width : ''}
                                        onChange={(val) => {
                                            let inStyle = innerStyle[selectedField];
                                            inStyle.width = val;
                                            setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                        }}
                                    />
                                </div>
                                <div className="col-12 col-md-2 mb-3">
                                    <TextInput
                                        label="Border"
                                        value={innerStyle[selectedField] ? innerStyle[selectedField].border : ''}
                                        onChange={(val) => {
                                            let inStyle = innerStyle[selectedField];
                                            inStyle.border = val;
                                            setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                        }}
                                    />
                                </div>
                        <div className="col-12 col-md-2 mb-3">
                            <TextInput
                                label="Size"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].fontSize : ''}
                                onChange={(val) => {
                                    let inStyle = innerStyle[selectedField];
                                    inStyle.fontSize = val;
                                    inStyle.lineHeight = val;
                                    setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <TextInput
                                label="Margin"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].margin : ''}
                                onChange={(val) => {
                                    let inStyle = innerStyle[selectedField];
                                    inStyle.margin = val;
                                    setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <TextInput
                                label="Top"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].top : ''}
                                onChange={(val) => {
                                    let inStyle = innerStyle[selectedField];
                                    inStyle.top = val;
                                    setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <TextInput
                                label="Bottom"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].bottom : ''}
                                onChange={(val) => {
                                    let inStyle = innerStyle[selectedField];
                                    inStyle.bottom = val;
                                    setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <TextInput
                                label="Right"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].right : ''}
                                onChange={(val) => {
                                    let inStyle = innerStyle[selectedField];
                                    inStyle.right = val;
                                    setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <TextInput
                                label="Left"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].left : ''}
                                onChange={(val) => {
                                    let inStyle = innerStyle[selectedField];
                                    inStyle.left = val;
                                    setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <TextInput
                                label="Padding"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].padding : ''}
                                onChange={(val) => {
                                    let inStyle = innerStyle[selectedField];
                                    inStyle.padding = val;
                                    setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-2 mb-3">
                            <TextInput
                                label="Line Height"
                                value={innerStyle[selectedField] ? innerStyle[selectedField].lineHeight : ''}
                                onChange={(val) => {
                                    let inStyle = innerStyle[selectedField];
                                    inStyle.lineHeight = val;
                                    setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                }}
                            />
                                </div>
                                <div className="col-12 col-md-2 mb-3">
                                    <TextInput
                                        label="Color"
                                        value={innerStyle[selectedField] ? innerStyle[selectedField].color : ''}
                                        onChange={(val) => {
                                            let inStyle = innerStyle[selectedField];
                                            inStyle.color = val;
                                            setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                        }}
                                    />
                                </div>
                                <div className="col-12 col-md-2 mb-3">
                                    <TextInput
                                        label="Font Family"
                                        value={innerStyle[selectedField] ? innerStyle[selectedField].fontFamily : ''}
                                        onChange={(val) => {
                                            let inStyle = innerStyle[selectedField];
                                            inStyle.fontFamily = val;
                                            setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                        }}
                                    />
                                    </div>
                                    <div className="col-12 col-md-2 mb-3">
                                        <TextInput
                                            label="Shadow"
                                            value={innerStyle[selectedField] ? innerStyle[selectedField].textShadow : ''}
                                            onChange={(val) => {
                                                let inStyle = innerStyle[selectedField];
                                                inStyle.textShadow = val;
                                                setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                                            }}
                                        />
                                    </div>
                    </div>

                </div>
            ):null}
            {showStyle===true?(
                <div className="col-12 mb-3">
                    <textarea
                        className='form-control'
                        rows={20}
                        cols={200}
                        label="Payload"
                        value={JSON.stringify(payload)}
                        onChange={(val) => {
                            // let inStyle = innerStyle[selectedField];
                            // inStyle.textShadow = val;
                            // setInnerStyle({ ...innerStyle, [selectedField]: inStyle });
                            // console.log()
                            setPayload(eval(val.target.value))
                        }}
                    />
                </div>
            ):null}
             <div className="col-12 col-md-12 mb-3 text-right">
                <button className="btn btn-theme" onClick={()=>{
                    savePrintStyleService({key:prodData.ref,style:innerStyle}).then(res=>{
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
                }}>
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
                <hr />{cardStyle.width === 914 ? (<>
                    {/* <div style={{ padding: '0px', width: '2px', height: '9in', background: '#cb51e5', position: 'absolute', top: '200px', left: '2.65in' }}/>
                    <div style={{ padding: '0px', width: '2px', height: '9in', background: '#9cff86', position: 'absolute', top: '200px', left: '4.65in' }} />
                    <div style={{ padding: '0px', width: '2px', height: '9in', background: '#9cff86', position: 'absolute', top: '200px', left: '34.65in' }} />
                    <div style={{ padding: '0px', width: '2px', height: '9in', background: '#5bb0ba', position: 'absolute', top: '200px', left: '19.65in' }} /> */}
                </>) : null}
                {cardStyle.width === 838 ? (<>
                    {/* <div style={{ padding: '0px', width: '2px', height: '9in', background: '#cb51e5', position: 'absolute', top: '200px', left: '2.65in' }} />
                    <div style={{ padding: '0px', width: '2px', height: '9in', background: '#9cff86', position: 'absolute', top: '200px', left: '3.65in' }} />
                    <div style={{ padding: '0px', width: '2px', height: '9in', background: '#9cff86', position: 'absolute', top: '200px', left: '32.65in' }} />
                    <div style={{ padding: '0px', width: '2px', height: '9in', background: '#5bb0ba', position: 'absolute', top: '200px', left: '18.15in' }} /> */}
                </>) : null}
                {cardStyle.width === 762 ? (<>
                    {/* <div style={{ padding: '0px', width: '2px', height: '9in', background: '#cb51e5', position: 'absolute', top: '200px', left: '2.65in' }} />
                    <div style={{ padding: '0px', width: '2px', height: '9in', background: '#9cff86', position: 'absolute', top: '200px', left: '3.65in' }} />
                    <div style={{ padding: '0px', width: '2px', height: '9in', background: '#9cff86', position: 'absolute', top: '200px', left: '29.65in' }} />
                    <div style={{ padding: '0px', width: '2px', height: '9in', background: '#5bb0ba', position: 'absolute', top: '200px', left: '16.65in' }} /> */}
                </>) : null}
            <div ref={componentRef} style={{zoom:cardStyle.zoom, background:cardStyle.background?cardStyle.background:'white',height:'12.5in'}}>
                            <div style={{ width: '100%', height: cardStyle.height === 19 ? '3mm' : '4mm'}}></div>
                            {ruler}
                {prodData && fields.length>0?(
                    generateData()
                ):null}
                            <div style={{ width: '100%', height: cardStyle.height === 19 ? '3mm' : '4mm' }}></div>

            </div>
   </div>
 </PageWrapper>
     <div style={{position:'fixed', bottom:'0px', zIndex:'3', width:'100%'}}>
        <div className="col-12">
            <div style={{height:'50px', background:'#687484'}}>
                <div className="row">
                    <div className="col-12 col-md-6 text-center">
                        <BsArrowUpCircle onClick={() => {
                            moveUp();
                        }} style={{ cursor: 'pointer', fontSize:'30px', color:'white' , marginTop:'10px'}} />
                        <BsArrowDownCircle onClick={() => {
                            moveDown();
                        }} style={{ marginLeft: '10px', cursor: 'pointer', fontSize:'30px', color:'white' , marginTop:'10px'}} />
                        <BsArrowLeftCircle onClick={() => {
                            moveLeft();
                        }} style={{ marginLeft: '10px', cursor: 'pointer', fontSize:'30px', color:'white' , marginTop:'10px'}} />
                        <BsArrowRightCircle onClick={() => {
                            moveRight();
                        }} style={{ marginLeft: '10px', cursor: 'pointer', fontSize:'30px', color:'white' , marginTop:'10px'}} />
                        <BsFillPatchPlusFill onClick={() => {
                            zoomIn()
                        }} style={{ marginLeft: '10px', cursor: 'pointer', fontSize:'30px', color:'white' , marginTop:'10px'}} />
                        <BsFillPatchMinusFill onClick={() => {
                            zoomOut()
                        }} style={{ marginLeft: '10px', cursor: 'pointer' , fontSize:'30px', color:'white', marginTop:'10px'}} />
                            <BsBootstrapReboot onClick={() => {
                                rotate()
                            }} style={{ marginLeft: '10px', cursor: 'pointer', fontSize: '30px', color: 'white', marginTop: '10px' }} />
                        </div>
                        <div className="col-0 col-md-6 mt-2 text-center">
                            <div style={{ maxWidth: '200px', textAlign: 'center' }}>
                                <Select
                                    data={fields}
                                    value={selectedField}
                                    onChange={(val) => {
                                        setSelectedField(val)
                                    }}
                                />
                            </div>
                        </div>
                </div>
            </div>
        </div>
     </div>
    </>
)
}
 
export default PrintLanyard