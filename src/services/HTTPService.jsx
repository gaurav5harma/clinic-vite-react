import axios from "axios";

export const authenticateService = (params) => {
  return httpPOST("/Authenticate", params);
};

//Register Data Services
export const addNewModuleService = (params) => {
  return httpPOST("/AddNewModule", params);
};
export const registerUserService = (params) => {
  return httpPOST("/RegisterUser", params);
};

export const backupService = async (params) => {
  return httpPOST("/bkp", params);
};

export const addNewEmployeeService = (params) => {
  return httpPOST("/create/_AddNewEmployee", params);
};
export const addNewSchoolService = (params) => {
  return httpPOST("/create/_AddNewSchool", params);
};
export const saveSalarySlipService = (params) => {
  return httpPOST("/create/_SaveSalarySlip", params);
};
export const addNewClassService = (params) => {
  return httpPOST("/create/_AddNewClass", params);
};
export const addNewDesignationService = (params) => {
  return httpPOST("/create/_AddNewDesignation", params);
};
export const addNewStudentService = (params) => {
  return httpPOST("/create/_AddNewStudent", params);
};
export const addNewProductionService = (params) => {
  return httpPOST("/create/_AddNewProduction", params);
};
export const upgradeClassesService = (params) => {
  return httpPOST("/create/_UpgradeClasses", params);
};
export const addNewCenterService = (params) => {
  return httpPOST("/create/_AddNewCenter", params);
};
export const addNewAgentService = (params) => {
  return httpPOST("/create/_AddNewAgent", params);
};
export const addNewVehicleCategoryService = (params) => {
  return httpPOST("/create/_AddNewVehicleCategory", params);
};
export const addNewVehicleService = (params) => {
  return httpPOST("/create/_AddNewVehicle", params);
};
export const addNewEntryService = (params) => {
  return httpPOST("/create/_AddNewEntry", params);
};
export const addNewPatientService = (params) => {
  return httpPOST("/create/_AddNewPatient", params);
};
export const generateOpdTokenService = (params) => {
  return httpPOST("/create/_GenerateOPDToken", params);
};
export const addNewStatusService = (params) => {
  return httpPOST("/create/_AddNewStatus", params);
};
export const addNewSalesPersonService = (params) => {
  return httpPOST("/create/_AddNewSalesPerson", params);
};
export const saveMRService = (params) => {
  return httpPOST("/create/_SaveMR", params);
};
export const saveDepositService = (params) => {
  return httpPOST("/create/_SaveDeposit", params);
};

//Update Data Services
export const updateSettingsService = (params) => {
  return httpPOST("/UpdateSettings", params);
};
export const updateModuleService = (params) => {
  return httpPOST("/UpdateModule", params);
};
export const updatePasswordService = (params) => {
  return httpPOST("/UpdatePassword", params);
};
export const updatePoliciesService = (params) => {
  return httpPOST("/update/_UpdatePolicies", params);
};
export const performActionService = (params) => {
  return httpPOST("/update/_PerformAction", params);
};
export const updateCenterService = (params) => {
  return httpPOST("/update/_UpdateCenter", params);
};
export const updateAgentService = (params) => {
  return httpPOST("/update/_UpdateAgent", params);
};
export const updateVehicleCategoryService = (params) => {
  return httpPOST("/update/_UpdateVehicleCategory", params);
};
export const updateVehicleService = (params) => {
  return httpPOST("/update/_UpdateVehicle", params);
};
export const updateStatusService = (params) => {
  return httpPOST("/update/_UpdateStatus", params);
};
export const updateSalesPersonService = (params) => {
  return httpPOST("/update/_UpdateSalesPerson", params);
};
export const updateEntryStatusService = (params) => {
  return httpPOST("/update/_UpdateEntryStatus", params);
};
export const uploadAttachmentService = (params) => {
  return httpPOST("/update/_UploadAttachment", params);
};
export const updateEntryDetailsService = (params) => {
  return httpPOST("/update/_UpdateEntryDetails", params);
};
export const updateExemptRemarksService = (params) => {
  return httpPOST("/update/_UpdateExemptRemarks", params);
};

//Delete Data Services
export const deleteMRTransactionService = (params) => {
  return httpPOST("/delete/_DeleteMR", params);
};
export const deleteDepositTransactionService = (params) => {
  return httpPOST("/delete/_DeleteDeposit", params);
};
export const deleteEntryService = (params) => {
  return httpPOST("/delete/_DeleteEntry", params);
};

// Get Single Row Data
export const getSettingsService = async (params) => {
  return httpPOST("/GetSettings", params);
};
export const getDetailsByBadgeIdService = async (params) => {
  return httpPOST("/fetch/GetDetailsByBadgeId", params);
};
export const generateNominalRegisterReportService = async (params) => {
  return httpPOST("/fetch/NominalRegisterReport", params);
};
export const generateSangatAttendanceReportService = async (params) => {
  return httpPOST("/fetch/SangatAttendanceReport", params);
};
export const generateAverageSangatReportService = async (params) => {
  return httpPOST("/fetch/AverageSangatReport", params);
};
export const getBadgeListService = async (params) => {
  return httpPOST("/fetch/GetBadgeList", params);
};
export const getBadgeSummaryService = async (params) => {
  return httpPOST("/fetch/GetBadgeSummary", params);
};
export const getBadgeLogsService = async (params) => {
  return httpPOST("/fetch/GetBadgeLogs", params);
};
export const getDepartmentSewadarsService = async (params) => {
  return httpPOST("/fetch/GetDepartmentSewadars", params);
};
export const getCenterSewadarsService = async (params) => {
  return httpPOST("/fetch/GetCenterSewadars", params);
};
export const getAllSewadarsService = async (params) => {
  return httpPOST("/fetch/GetAllSewadars", params);
};
export const getSalarySlipService = async (params) => {
  return httpPOST("/fetch/_GetSalarySlip", params);
};
export const getNominalService = async (params) => {
  // For Nominal Edit
  return httpPOST("/fetch/FetchNominal", params);
};
export const checkUserDataService = async (params) => {
  return httpPOST("/fetch/CheckUserData", params);
};
export const fetchAllShabdsService = async (params) => {
  return httpPOST("/fetch/FetchAllShabds", params);
};
export const getPreacherShabdsService = async (params) => {
  return httpPOST("/fetch/GetPreacherShabds", params);
};
export const getRosterService = async (params) => {
  return httpPOST("/fetch/GetRoster", params);
};
export const getSKShabdsService = async (params) => {
  return httpPOST("/fetch/GetSKShabds", params);
};
export const checkShabdService = async (params) => {
  return httpPOST("/fetch/CheckShabd", params);
};
export const getPreacherDataService = async (params) => {
  return httpPOST("/fetch/GetPreacherData", params);
};
export const checkSewadarAttendanceService = async (params) => {
  return httpPOST("/fetch/CheckSewadarAttendance", params);
};
export const getSalaryRegisterService = async (params) => {
  return httpPOST("/fetch/_GetSalaryRegister", params);
};
export const getClassesBySchoolService = async (params) => {
  return httpPOST("/fetch/_GetClassesBySchool", params);
};
export const getDesignationsBySchoolService = async (params) => {
  return httpPOST("/fetch/_GetDesignationsBySchool", params);
};
export const getStudentsService = async (params) => {
  return httpPOST("/fetch/_GetStudents", params);
};
export const getPatientsByMobileService = async (params) => {
  return httpPOST("/fetch/_GetPatientsByMobile", params);
};
export const getCurrentConsultationService = async (params) => {
  return httpPOST("/fetch/_GetCurrentConsultation", params);
};
export const getEmployeesService = async (params) => {
  return httpPOST("/fetch/_GetEmployees", params);
};
export const getProductionDetailsService = async (params) => {
  return httpPOST("/fetch/_GetProductionDetails", params);
};
export const getPhotoProductionDetailsService = async (params) => {
  return httpPOST("/fetch/_GetPhotoProductionDetails", params);
};
export const getLanyardProductionDetailsService = async (params) => {
  return httpPOST("/fetch/_GetLanyardProductionDetails", params);
};
export const checkStudentsDataService = async (params) => {
  return httpPOST("/fetch/_CheckStudentsData", params);
};
export const getSchoolSummaryService = async (params) => {
  return httpPOST("/fetch/_GetSchoolSummary", params);
};
export const generateListService = async (params) => {
  return httpPOST("/fetch/_GenerateList", params);
};
export const getEntryDetailsService = async (params) => {
  return httpPOST("/fetch/_GetEntryDetails", params);
};
export const getEntryReportService = async (params) => {
  return httpPOST("/fetch/_GetEntryReport", params);
};
export const fetchUnpaidEntriesService = async (params) => {
  return httpPOST("/fetch/_GetUnpaidEntries", params);
};
export const getEntriesByVehicle = async (params) => {
  return httpPOST("/fetch/_GetEntriesByVehicle", params);
};
export const getEntryDetailsByKeyService = async (params) => {
  return httpPOST("/fetch/_GetEntryDetailsByKey", params);
};
export const getAgentLedgerService = async (params) => {
  return httpPOST("/fetch/_GetAgentLedger", params);
};
export const getMRTransactionsService = async (params) => {
  return httpPOST("/fetch/_GetMRTransactions", params);
};
export const getDepositTransactionsService = async (params) => {
  return httpPOST("/fetch/_GetDepositTransactions", params);
};
export const getTaggingDataService = async (params) => {
  return httpPOST("/fetch/_GetTaggingData", params);
};

export const getUpdationsService = async (params) => {
  return httpPOST("/fetch/_GetUpdations", params);
};

export const getAppVersionService = async (params) => {
  return httpPOST("/fetch/_GetAppVersion", params);
};
export const getMinDateService = async (params) => {
  return httpPOST("/fetch/_GetMinDate", params);
};

//Data for Datatables
export const getAllModulesService = async (params) => {
  return httpPOST("/datatables/GetAllModules", params);
};
export const getAllUsersService = async (params) => {
  return httpPOST("/datatables/GetAllUsers", params);
};
export const getAllNominalRegisterService = async (params) => {
  return httpPOST("/datatables/GetAllNominalRegister", params);
};
export const getAllBadgesService = async (params) => {
  return httpPOST("/datatables/GetAllBadges", params);
};
export const getAllNominalsService = async (params) => {
  return httpPOST("/datatables/GetAllNominals", params);
};
export const getAllEmployeesService = async (params) => {
  return httpPOST("/datatables/_GetAllEmployees", params);
};
export const getAllSchoolsService = async (params) => {
  return httpPOST("/datatables/_GetAllSchools", params);
};
export const getAllShabdsService = async (params) => {
  return httpPOST("/datatables/GetAllShabds", params);
};
export const getAllSalarySlipsService = async (params) => {
  return httpPOST("/datatables/_GetAllSalarySlips", params);
};
export const getAllProductionsService = async (params) => {
  return httpPOST("/datatables/_GetAllProductions", params);
};
export const getAllCentersService = (params) => {
  return httpPOST("/datatables/_GetAllCenters", params);
};
export const getAllStatusService = (params) => {
  return httpPOST("/datatables/_GetAllStatus", params);
};
export const getAllAgentsServices = (params) => {
  return httpPOST("/datatables/_GetAllAgents", params);
};
export const getAllVehicleCategoriesServices = (params) => {
  return httpPOST("/datatables/_GetAllVehicleCategories", params);
};
export const getAllVehiclesServices = (params) => {
  return httpPOST("/datatables/_GetAllVehicles", params);
};
export const getAllEntriesService = (params) => {
  return httpPOST("/datatables/_GetAllEntries", params);
};
export const getAllSalesPersonService = (params) => {
  return httpPOST("/datatables/_GetAllSalesPerson", params);
};

//Dropdowns

export const getActiveCentersListService = (params) => {
  return httpPOST("/dropdowns/_GetActiveCentersList", params);
};
export const getActiveSalesPersonList = (params) => {
  return httpPOST("/dropdowns/_GetActiveSalesPersonList", params);
};
export const getActivKAMsListService = (params) => {
  return httpPOST("/dropdowns/_GetActiveKAMsList", params);
};
export const getActiveAgentsListService = (params) => {
  return httpPOST("/dropdowns/_GetActiveAgentsList", params);
};
export const getActivAgentsListBySPService = (params) => {
  return httpPOST("/dropdowns/_GetActiveAgentsListBySP", params);
};
export const getActiveStatusListService = (params) => {
  return httpPOST("/dropdowns/_GetActiveStatusList", params);
};

//Multiple Rows Data Services
export const getAppModulesService = () => {
  return httpGET("/GetAppModules");
};
export const getAppRolesService = () => {
  return httpGET("/GetRoles");
};
export const getAllStatesService = () => {
  return httpGET("/GetAllStates");
};
export const getDepartmentsListService = () => {
  return httpPOST("/dropdowns/GetDepartmentsList");
};
export const getSatsangGharsListService = () => {
  return httpPOST("/dropdowns/GetSatsangGharsList");
};
export const getDesignationsListService = () => {
  return httpPOST("/dropdowns/GetDesignationsList");
};
export const getSatsangCentersListService = () => {
  return httpPOST("/dropdowns/GetSatsangCentersList");
};
export const getSatsangPlacesByCenterService = (params) => {
  return httpPOST("/dropdowns/GetSatsangPlacesByCenter", params);
};
export const fetchDailySewaDataService = (params) => {
  return httpPOST("/fetch/FetchDailySewaData", params);
};
export const fetchSKSRAttendanceDataService = (params) => {
  return httpPOST("/fetch/FetchSKSRAttendanceData", params);
};
export const fetchSGSewaDataService = (params) => {
  return httpPOST("/fetch/FetchSGSewaData", params);
};
export const fetchCenterSewaDataService = (params) => {
  return httpPOST("/fetch/FetchCenterSewaData", params);
};
export const getEmployeeDataService = (params) => {
  return httpPOST("/fetch/_GetEmployeeData", params);
};
export const requestPoliciesService = async (params) => {
  return httpPOST("/dropdowns/RequestPolicies", params);
};
export const requestSalaryStructureService = async (params) => {
  return httpPOST("/dropdowns/RequestSalaryStructures", params);
};
export const getAllAreasList = async (params) => {
  return httpPOST("/dropdowns/GetAllAreas", params);
};
export const getNominalAccessDataService = async (params) => {
  return httpPOST("/dropdowns/GetNominalAccessData", params);
};
export const getActiveAgentsListByCenterService = async (params) => {
  return httpPOST("/dropdowns/_GetActiveAgentsListByCenter", params);
};
export const getDistrictsService = (params) => {
  return httpPOST("/GetDistricts", params);
};
export const getUsersService = async (params) => {
  return httpPOST("/GetAppUsers", params);
};
export const refreshChangesService = async (params) => {
  return httpPOST("/Check", params);
};

// Fetch Data

//Generate Reports

//Third Party Services

// API FROM DEVRAHUL's
export const delDataByID = (params) => {
  return httpPOST("/DeleteRecord", params);
};
export const deleteNominalService = (params) => {
  return httpPOST("/update/DeleteNominal", params);
};
export const getRolesServices = () => {
  // Dropdown or List
  return httpGET("/GetRoles");
};
export const getRoutesServices = () => {
  // Dropdown or List
  return httpGET("/GetRoutes");
};
export const getActionServices = () => {
  // Dropdown or List
  return httpGET("/GetAppActions");
};
export const getRouteAndActions = async (params) => {
  // Dropdown or List
  return httpPOST("/GetRouteAndActions", params);
};
export const addRemoveRolesRoutes = async (params) => {
  return httpPOST("/AddRemoveRolesRoutes", params);
};
export const addRemoveRolesActions = async (params) => {
  return httpPOST("/AddRemoveRolesActions", params);
};
export const addRemoveAccessRoutes = async (params) => {
  return httpPOST("/AddRemoveAccessRoutes", params);
};
export const addRemoveAccessActions = async (params) => {
  return httpPOST("AddRemoveAccessActions", params);
};
export const addNewRoleServices = async (params) => {
  return httpPOST("/AddNewRole", params);
};
// Dropdown or List
export const getDataByUserIdService = async (params) => {
  return httpPOST("/GetDataByUserId", params);
};
export const getDashboardService = (params) => {
  return httpPOST("/fetch/_GetDashboard", params);
};
export const addNewUserServices = (params) => {
  return httpPOST("/AddNewUser", params);
};
export const updateUserServices = (params) => {
  return httpPOST("/UpdateUser", params);
};
export const getSatsangPlacesByDate = (params) => {
  return httpPOST("/dropdowns/GetSatsangPlacesByDate", params);
};
export const getSewadarAccessService = (params) => {
  return httpPOST("/dropdowns/GetSewadarAccess", params);
};
export const getPreachersService = (params) => {
  return httpPOST("/dropdowns/GetAllPreachers", params);
};
// Datatable
export const getAllActionsServices = (params) => {
  return httpPOST("/GetAllActions", params);
};
export const addNewActionsServices = (params) => {
  return httpPOST("/AddNewActions", params);
};
export const updateActionsServices = (params) => {
  return httpPOST("/UpdateActions", params);
};
export const changePasswordService = async (params) => {
  return httpPOST("/UpdatePassword", params);
};
export const resetPasswordService = async (params) => {
  return httpPOST("/ResetPassword", params);
};
export const getCompanySettingsService = async (params) => {
  return httpPOST("/GetCompanySettings", params);
};
export const setCompanySettingsService = async (params) => {
  return httpPOST("/SetCompanySettings", params);
};
// API FROM DEVRAHUL's END

//Action Triggers
const httpPOST = (url, params) => {
  return axios.post(url, { params: params }).catch((e) => {
    console.log("HTTP POST" + e);
  });
};
const httpGET = (url) => {
  return axios.get(url);
};
