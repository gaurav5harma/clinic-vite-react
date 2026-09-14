export const setUserData = (value) => {
  setData("userData", value);
};
export const setCompanyData = (value) => {
  setData("companyData", value);
};
export const setIdValidation = (value) => {
  setData("idValidation", value);
};
export const setCurrentSession = (value) => {
  setData("currentSession", value);
};
export const getUserData = () => {
  let user = {};
  if (sessionStorage.getItem("userData")) {
    user = JSON.parse(sessionStorage.getItem("userData"));
  }
  return user;
};
export const getCompanyData = () => {
  let company = {};
  if (sessionStorage.getItem("companyData")) {
    company = JSON.parse(sessionStorage.getItem("companyData"));
  }
  return company;
};
export const getIdValidation = () => {
  let data = false;
  if (sessionStorage.getItem("idValidation")) {
    data = sessionStorage.getItem("idValidation");
  }
  return data;
};
export const getCurrentSession = () => {
  let data = false;
  if (sessionStorage.getItem("currentSession")) {
    data = sessionStorage.getItem("currentSession");
  }
  return data;
};
export const logout = () => {
  sessionStorage.clear();
  sessionStorage.clear();
};
export const hasAccess = (val) => {
  let access = getUserData().actions ? getUserData().actions : [];
  let res = access.findIndex((ob) => ob.slug === val);
  if (res !== -1) {
    return true;
  } else {
    return false;
  }
};

const setData = (key, value) => {
  if (key === "userData") {
    sessionStorage.setItem(key, value);
  } else {
    sessionStorage.setItem(key, value);
  }
};
