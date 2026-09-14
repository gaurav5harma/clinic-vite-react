import { getUserData } from "./AuthService";

export const titleCase = (str) => {
  let strArr = str.toLowerCase().split(" ");
  for (let i = 0; i < strArr.length; i++) {
    strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1);
  }
  return strArr.join(" ");
};

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export const paperRequirementMultiplier = (ply) => {
  let plyData = [
    { ply: 3, multiplier: 1 },
    { ply: 5, multiplier: 2 },
    { ply: 7, multiplier: 3 },
    { ply: 9, multiplier: 4 },
  ];

  let index = plyData.findIndex((ob) => Number(ob.ply) === Number(ply));

  return plyData[index].multiplier;
};

export const Prefs = {
  plyNames: [
    {
      ply: 3,
      names: ["Top", "Corrugation", "Face"],
      slug: ["top", "corrugation", "face"],
    },
    {
      ply: 5,
      names: ["Top", "Inner Corr.", "Face", "Outer Corr.", "Face"],
      slug: [
        "top",
        "corrugation-inner",
        "face-inner",
        "corrugation-outer",
        "face-outer",
      ],
    },
    {
      ply: 7,
      names: [
        "Top",
        "Inner Corr.",
        "Face",
        "Middle Corr.",
        "Face",
        "Outer Corr.",
        "Face",
      ],
      slug: [
        "top",
        "corrugation-inner",
        "face-inner",
        "corrugation-middle",
        "face-middle",
        "corrugation-outer",
        "face-outer",
      ],
    },
    {
      ply: 9,
      names: [
        "Top",
        "Inner Corr.",
        "Face",
        "Inner Middle Corr.",
        "Face",
        "Outer Middle Corr.",
        "Face",
        "Outer Corr.",
        "Face",
      ],
      slug: [
        "top",
        "corrugation-inner",
        "face-inner",
        "corrugation-inner-middle",
        "face-inner-middle",
        "corrugation-outer-middle",
        "face-outer-middle",
        "corrugation-outer",
        "face-outer",
      ],
    },
  ],
  plies: [
    {
      ply: 3,
      names: ["Top", "Corrugation"],
      narrow: ["top", "corrugation-narrow", "face"],
      broad: ["top", "corrugation-broad", "face"],
    },
    {
      ply: 5,
      names: ["Top", "Inner Ply", "Outer Ply"],
      narrow: [
        "top",
        "corrugation-inner-narrow",
        "face-inner",
        "corrugation-outer-narrow",
        "face-outer",
      ],
      broad: [
        "top",
        "corrugation-inner-broad",
        "face-inner",
        "corrugation-outer-broad",
        "face-outer",
      ],
    },
    {
      ply: 7,
      names: ["Top", "Inner Ply", "Middle Ply", "Outer Ply"],
      narrow: [
        "top",
        "corrugation-inner-narrow",
        "face-inner",
        "corrugation-middle-narrow",
        "face-middle",
        "corrugation-outer-narrow",
        "face-outer",
      ],
      broad: [
        "top",
        "corrugation-inner-broad",
        "face-inner",
        "corrugation-middle-broad",
        "face-middle",
        "corrugation-outer-broad",
        "face-outer",
      ],
    },
    {
      ply: 9,
      names: [
        "Top",
        "Inner Ply",
        "Inner Middle Ply",
        "Outer Middle Ply",
        "Outer Ply",
      ],
      narrow: [
        "top",
        "corrugation-inner-narrow",
        "face-inner",
        "corrugation-inner-middle-narrow",
        "face-inner-middle",
        "corrugation-outer-middle-narrow",
        "face-outer-middle",
        "corrugation-outer-narrow",
        "face-outer",
      ],
      broad: [
        "top",
        "corrugation-inner-broad",
        "face-inner",
        "corrugation-inner-middle-broad",
        "face-inner-middle",
        "corrugation-outer-middle-broad",
        "face-outer-middle",
        "corrugation-outer-broad",
        "face-outer",
      ],
    },
  ],
};

export const getPageTitle = (path) => {
  let allRoutes = getUserData().routes;
  let routes = getChilds(allRoutes);

  let pathIndex = routes.findIndex((ob) => ob.path === path);
  let title = "";
  if (pathIndex !== -1) {
    title = routes[pathIndex].title;
  }
  return title;
};

const getChilds = (allRoutes) => {
  let routes = [];
  allRoutes.forEach((el) => {
    let element = { path: el.path, title: el.name };
    let childArr = [];
    if (el.path.trim() !== "") {
      routes.push(element);
    }
    if (el.hasChild === true) {
      childArr = getChilds(el.children);
    }
    routes = [...routes, ...childArr];
  });
  return routes;
};

export const getInitialRequiredQuantity = (
  box,
  plyData,
  ups,
  parts,
  process
) => {
  let topPaperCount = Number((box * parts) / ups).toFixed(0);
  let rotaryCount = topPaperCount;
  // let plyRequirement = Number((box * parts * paperRequirementMultiplier(plyData.length))/ups).toFixed(0);
  let narrowPlies = 0;
  let broadPlies = 0;

  plyData.forEach((ply) => {
    if (ply.fluteType === "narrow") narrowPlies++;
    if (ply.fluteType === "broad") broadPlies++;
  });
  // console.log(process)
  // switch (process) {
  //   case "paper-cutting":
  //   case "top-paper-cutting":
  //     return topPaperCount;
  //     break;

  //   case "corrugation-narrow":
  //     return narrowPlies * rotaryCount;
  //     break;

  //   case "corrugation-broad":
  //     return broadPlies * rotaryCount;
  //     break;
  // }
  return topPaperCount;
};

export const getCorrugationCounts = (plyData) => {
  let data = {
    narrow: 0,
    broad: 0,
    total: 0,
  };

  plyData.forEach((ply) => {
    if (ply.fluteType === "narrow") data.narrow++;
    if (ply.fluteType === "broad") data.broad++;
  });
  data.total = Number(data.narrow) + Number(data.broad);
  return data;
};

export const modifyCorrugationStage = (plyData, machinePlan) => {
  let data = {
    narrow: 0,
    broad: 0,
    total: 0,
  };

  let modifiedPlan = [];
  let corrugationCount = getCorrugationCounts(plyData).total + 1;

  // if (
  //   (machinePlan.filter(x => Number(x.stage) === 1).length === corrugationCount)
  //   ) {
  //   modifiedPlan = machinePlan;
  // } else {
  modifiedPlan.push(machinePlan[0]);
  plyData.forEach((ply) => {
    let index = Prefs.plies.findIndex((ob) => ob.ply === plyData.length);
    let plan = {
      processPlan: machinePlan[0].processPlan,
      process: Prefs.plies[index].narrow[ply.ply - 1],
      flute: ply.flute,
      type: "corrugation",
      stage: 1,
      machine: "",
      machineId: "",
      achieved: 0,
      rejected: 0,
      balanceQuantity: "",
    };
    if (ply.fluteType === "narrow" || ply.fluteType === "broad") {
      plan.process = Prefs.plies[index][ply.fluteType][ply.ply - 1];
      modifiedPlan.push(plan);
    }
  });
  machinePlan.forEach((el) => {
    if (el.stage > 1) {
      modifiedPlan.push(el);
    }
  });
  // }
  return modifiedPlan;
};

// export const mergePapers = (array, issued) => {
//   array
//     .sort((a, b) => {
//       return a.gsm - b.gsm;
//     })
//     .sort((a, b) => {
//       return b.paperType - a.paperType;
//     })
//     .sort((a, b) => {
//       return a.soRef > b.soRef ? -1 : 1;
//     })
//     .sort((a, b) => {
//       return a.itemRef > b.itemRef ? -1 : 1;
//     });
//   let ply = array.length;
//   let tempArrFace = [];
//   let tempArrIdxFace = 0;
//   let tempArrCorr = [];
//   let tempArrCorrNarrow = [];
//   let tempArrCorrBroad = [];
//   let tempArrIdxCorr = 0;
//   let tempArrIdxCorrNarrow = 0;
//   let tempArrIdxCorrBroad = 0;
//   let arrTop = array.filter((ob) => ob.ply === 1);
//   //Top Paper
//   arrTop[0].type = "Top";
//   arrTop[0].issued =
//     issued.findIndex((ob) => ob.issuedFor === "top") >= 0
//       ? issued[issued.findIndex((ob) => ob.issuedFor === "top")]
//           .issued
//       : 0;
//   let arrFace = array.filter((ob) => ob.ply !== 1 && ob.ply % 2 !== 0);
//   let arrCorr = array.filter((ob) => ob.ply % 2 === 0);
//   let arrCorrNarrow = array.filter(
//     (ob) => ob.ply % 2 === 0 && ob.fluteType === "narrow"
//   );
//   let arrCorrBroad = array.filter(
//     (ob) => ob.ply % 2 === 0 && ob.fluteType === "broad"
//   );
//   //Face Papers
//   for (let i = 0; i < arrFace.length; i++) {
//     let el = arrFace[i];
//     el.type = "face";
//     el.issued =
//       issued.findIndex((ob) => ob.issuedFor === el.type) >= 0
//         ? issued[issued.findIndex((ob) => ob.issuedFor === el.type)]
//             .issued
//         : 0;
//     let prevIdx = tempArrIdxFace - 1;

//     if (prevIdx >= 0) {
//       let prevTempArr = tempArrFace[prevIdx];
//       if (
//         prevTempArr.paperType === el.paperType &&
//         prevTempArr.gsm === el.gsm &&
//         prevTempArr.reelSize === el.reelSize
//       ) {
//         // debugger;
//         tempArrFace[prevIdx].weight =
//           Number(prevTempArr.weight) + Number(el.weight);
//       } else {
//         tempArrIdxFace++;
//         tempArrFace.push(el);
//       }
//     } else {
//       tempArrIdxFace++;
//       tempArrFace.push(el);
//     }
//   }

//   //Corrugated Papers Narrow
//   for (let i = 0; i < arrCorrNarrow.length; i++) {
//     let el = arrCorrNarrow[i];
//     el.type = "corrugation-narrow";
//     el.issued =
//       issued.findIndex((ob) => ob.issuedFor === el.type) >= 0
//         ? issued[issued.findIndex((ob) => ob.issuedFor === el.type)]
//             .issued
//         : 0;
//     let prevIdx = tempArrIdxCorrNarrow - 1;

//     if (prevIdx >= 0) {
//       let prevTempArr = tempArrCorrNarrow[prevIdx];
//       if (
//         prevTempArr.paperType === el.paperType &&
//         prevTempArr.gsm === el.gsm
//       ) {
//         // debugger;
//         let totalWeight = Number(prevTempArr.weight) + Number(el.weight);
//         tempArrCorrNarrow[prevIdx].weight = totalWeight;
//       } else {
//         tempArrIdxCorrNarrow++;
//         tempArrCorrNarrow.push(el);
//       }
//     } else {
//       tempArrIdxCorrNarrow++;
//       tempArrCorrNarrow.push(el);
//     }
//   }

//   //Corrugated Papers Broad
//   for (let i = 0; i < arrCorrBroad.length; i++) {
//     let el = arrCorrBroad[i];
//     el.type = "corrugation-broad";
//     el.issued =
//       issued.findIndex((ob) => ob.issuedFor === el.type) >= 0
//         ? issued[issued.findIndex((ob) => ob.issuedFor === el.type)]
//             .issued
//         : 0;
//     let prevIdx = tempArrIdxCorrBroad - 1;

//     if (prevIdx >= 0) {
//       let prevTempArr = tempArrCorrBroad[prevIdx];
//       if (
//         prevTempArr.paperType === el.paperType &&
//         prevTempArr.gsm === el.gsm
//       ) {
//         // debugger;
//         let totalWeight = Number(prevTempArr.weight) + Number(el.weight);
//         tempArrCorrBroad[prevIdx].weight = totalWeight;
//       } else {
//         tempArrIdxCorrBroad++;
//         tempArrCorrBroad.push(el);
//       }
//     } else {
//       tempArrIdxCorrBroad++;
//       tempArrCorrBroad.push(el);
//     }
//   }

//   return [
//     ...arrTop,
//     ...tempArrCorrNarrow,
//     ...tempArrCorrBroad,
//     ...tempArrFace,
//   ];
// };

export const mergePapers = (array, issued) => {
  array
    .sort((a, b) => {
      return a.gsm - b.gsm;
    })
    .sort((a, b) => {
      return b.paperType - a.paperType;
    })
    // .sort((a, b) => {
    //   return a.fluteType - b.fluteType;
    // })
    .sort((a, b) => {
      return a.soRef > b.soRef ? -1 : 1;
    })
    .sort((a, b) => {
      return a.itemRef > b.itemRef ? -1 : 1;
    });
  let ply = array.length;
  let tempArrFace = [];
  let tempArrIdxFace = 0;
  let tempArrCorr = [];
  let tempArrCorrNarrow = [];
  let tempArrCorrBroad = [];
  let tempArrIdxCorr = 0;
  let tempArrIdxCorrNarrow = 0;
  let tempArrIdxCorrBroad = 0;
  let arrTop = array.filter((ob) => ob.ply === 1);
  //Top Paper
  arrTop[0].type = "Top";
  arrTop[0].issued =
    issued.findIndex((ob) => ob.issuedFor === "top") >= 0
      ? issued[issued.findIndex((ob) => ob.issuedFor === "top")].issued
      : 0;
  let arrFace = array.filter((ob) => ob.ply !== 1 && ob.ply % 2 !== 0);
  let arrCorr = array.filter((ob) => ob.ply % 2 === 0);
  let arrCorrNarrow = array.filter(
    (ob) => ob.ply % 2 === 0 && ob.fluteType === "narrow"
  );
  let arrCorrBroad = array.filter(
    (ob) => ob.ply % 2 === 0 && ob.fluteType === "broad"
  );
  //Face Papers
  for (let i = 0; i < arrFace.length; i++) {
    let el = arrFace[i];
    // el.type = "face";
    let idx = Prefs.plyNames.findIndex((ob) => ob.ply === ply);
    el.type = Prefs.plyNames[idx].slug[el.ply - 1];
    // el.issued =
    //   issued.findIndex((ob) => ob.issuedFor === el.type) >= 0
    //     ? issued[issued.findIndex((ob) => ob.issuedFor === el.type)]
    //         .issued
    //     : 0;
    let prevIdx = tempArrIdxFace - 1;

    if (prevIdx >= 0) {
      let prevTempArr = tempArrFace[prevIdx];
      if (
        prevTempArr.paperType === el.paperType &&
        prevTempArr.gsm === el.gsm &&
        prevTempArr.reelSize === el.reelSize
      ) {
        // debugger;
        tempArrFace[prevIdx].type += "," + el.type;
        tempArrFace[prevIdx].weight =
          Number(prevTempArr.weight) + Number(el.weight);

        // tempArrFace[prevIdx].issued = getIssuedQuantity(issued,el.type)
        tempArrFace[prevIdx].issued = getIssuedQuantity(
          issued,
          tempArrFace[prevIdx].type
        );
      } else {
        el.issued = getIssuedQuantity(issued, el.type);

        tempArrIdxFace++;
        tempArrFace.push(el);
      }
    } else {
      el.issued = getIssuedQuantity(issued, el.type);
      tempArrIdxFace++;
      tempArrFace.push(el);
    }
  }

  //Corrugated Papers Narrow
  for (let i = 0; i < arrCorrNarrow.length; i++) {
    let el = arrCorrNarrow[i];
    // el.type = "corrugation-narrow";
    let idx = Prefs.plyNames.findIndex((ob) => ob.ply === ply);
    el.type = Prefs.plyNames[idx].slug[el.ply - 1] + "-narrow";
    // el.issued =
    //   issued.findIndex((ob) => ob.issuedFor === el.type) >= 0
    //     ? issued[issued.findIndex((ob) => ob.issuedFor === el.type)]
    //         .issued
    //     : 0;
    let prevIdx = tempArrIdxCorrNarrow - 1;

    if (prevIdx >= 0) {
      let prevTempArr = tempArrCorrNarrow[prevIdx];
      if (
        prevTempArr.paperType === el.paperType &&
        prevTempArr.gsm === el.gsm
      ) {
        // debugger;
        tempArrCorrNarrow[prevIdx].type += "," + el.type;
        let totalWeight = Number(prevTempArr.weight) + Number(el.weight);
        tempArrCorrNarrow[prevIdx].weight = totalWeight;
      } else {
        el.issued = getIssuedQuantity(issued, el.type);
        tempArrIdxCorrNarrow++;
        tempArrCorrNarrow.push(el);
      }
    } else {
      el.issued = getIssuedQuantity(issued, el.type);
      tempArrIdxCorrNarrow++;
      tempArrCorrNarrow.push(el);
    }
  }

  //Corrugated Papers Broad
  for (let i = 0; i < arrCorrBroad.length; i++) {
    let el = arrCorrBroad[i];
    // el.type = "corrugation-broad";
    let idx = Prefs.plyNames.findIndex((ob) => ob.ply === ply);
    el.type = Prefs.plyNames[idx].slug[el.ply - 1] + "-broad";
    // el.issued =
    //   issued.findIndex((ob) => ob.issuedFor === el.type) >= 0
    //     ? issued[issued.findIndex((ob) => ob.issuedFor === el.type)]
    //         .issued
    //     : 0;
    let prevIdx = tempArrIdxCorrBroad - 1;

    if (prevIdx >= 0) {
      let prevTempArr = tempArrCorrBroad[prevIdx];
      if (
        prevTempArr.paperType === el.paperType &&
        prevTempArr.gsm === el.gsm
      ) {
        tempArrCorrBroad[prevIdx].type += "," + el.type;
        let totalWeight = Number(prevTempArr.weight) + Number(el.weight);
        tempArrCorrBroad[prevIdx].weight = totalWeight;
      } else {
        el.issued = getIssuedQuantity(issued, el.type);
        tempArrIdxCorrBroad++;
        tempArrCorrBroad.push(el);
      }
    } else {
      el.issued = getIssuedQuantity(issued, el.type);
      tempArrIdxCorrBroad++;
      tempArrCorrBroad.push(el);
    }
  }

  return [...arrTop, ...tempArrCorrNarrow, ...tempArrCorrBroad, ...tempArrFace];
};

export const getIssuedQuantity = (issued, type) => {
  let issuedQty =
    issued.findIndex((ob) => ob.issuedFor === type) >= 0
      ? issued[issued.findIndex((ob) => ob.issuedFor === type)].issued
      : 0;

  return issuedQty;
};

export const paperNames = (array, issued) => {
  array
    .sort((a, b) => {
      return a.gsm - b.gsm;
    })
    .sort((a, b) => {
      return b.paperType - a.paperType;
    })
    // .sort((a, b) => {
    //   return a.fluteType - b.fluteType;
    // })
    .sort((a, b) => {
      return a.soRef > b.soRef ? -1 : 1;
    })
    .sort((a, b) => {
      return a.itemRef > b.itemRef ? -1 : 1;
    });
  let ply = array.length;
  let tempArrFace = [];
  let tempArrIdxFace = 0;
  let tempArrCorr = [];
  let tempArrCorrNarrow = [];
  let tempArrCorrBroad = [];
  let tempArrIdxCorr = 0;
  let tempArrIdxCorrNarrow = 0;
  let tempArrIdxCorrBroad = 0;
  let arrTop = array.filter((ob) => ob.ply === 1);
  //Top Paper
  arrTop[0].type = "Top";
  arrTop[0].issued =
    issued.findIndex((ob) => ob.issuedFor === "top") >= 0
      ? issued[issued.findIndex((ob) => ob.issuedFor === "top")].issued
      : 0;
  let arrFace = array.filter((ob) => ob.ply !== 1 && ob.ply % 2 !== 0);
  let arrCorr = array.filter((ob) => ob.ply % 2 === 0);
  let arrCorrNarrow = array.filter(
    (ob) => ob.ply % 2 === 0 && ob.fluteType === "narrow"
  );
  let arrCorrBroad = array.filter(
    (ob) => ob.ply % 2 === 0 && ob.fluteType === "broad"
  );
  //Face Papers
  for (let i = 0; i < arrFace.length; i++) {
    let el = arrFace[i];
    // el.type = "face";
    let idx = Prefs.plyNames.findIndex((ob) => ob.ply === ply);
    el.type = Prefs.plyNames[idx].slug[el.ply - 1];
    el.issued =
      issued.findIndex((ob) => ob.issuedFor === el.type) >= 0
        ? issued[issued.findIndex((ob) => ob.issuedFor === el.type)].issued
        : 0;

    tempArrIdxFace++;
    tempArrFace.push(el);
  }

  //Corrugated Papers Narrow
  for (let i = 0; i < arrCorrNarrow.length; i++) {
    let el = arrCorrNarrow[i];
    // el.type = "corrugation-narrow";
    let idx = Prefs.plyNames.findIndex((ob) => ob.ply === ply);
    el.type = Prefs.plyNames[idx].slug[el.ply - 1] + "-narrow";
    el.issued =
      issued.findIndex((ob) => ob.issuedFor === el.type) >= 0
        ? issued[issued.findIndex((ob) => ob.issuedFor === el.type)].issued
        : 0;

    tempArrIdxCorrNarrow++;
    tempArrCorrNarrow.push(el);
  }

  //Corrugated Papers Broad
  for (let i = 0; i < arrCorrBroad.length; i++) {
    let el = arrCorrBroad[i];
    // el.type = "corrugation-broad";
    let idx = Prefs.plyNames.findIndex((ob) => ob.ply === ply);
    el.type = Prefs.plyNames[idx].slug[el.ply - 1] + "-broad";
    el.issued =
      issued.findIndex((ob) => ob.issuedFor === el.type) >= 0
        ? issued[issued.findIndex((ob) => ob.issuedFor === el.type)].issued
        : 0;
    tempArrIdxCorrBroad++;
    tempArrCorrBroad.push(el);
  }

  return [...arrTop, ...tempArrCorrNarrow, ...tempArrCorrBroad, ...tempArrFace];
};

export const formatIndianAmount = (value) => {
  if (!value) return "0";

  // Remove existing commas
  const cleanValue = value.toString().replace(/,/g, "");

  // Split integer & decimal
  const [integerPart, decimalPart] = cleanValue.split(".");

  // Last 3 digits
  const lastThree = integerPart.slice(-3);
  const remaining = integerPart.slice(0, -3);

  // Apply commas for remaining digits
  const formattedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return remaining
    ? `${formattedRemaining},${lastThree}${
        decimalPart ? "." + decimalPart : ""
      }`
    : `${lastThree}${decimalPart ? "." + decimalPart : ""}`;
};
