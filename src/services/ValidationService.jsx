export const validations = {
  // email: (val) =>
  //   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
  //     val
  //   ),

  email: (val) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
  password: (val) => /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,}$/.test(val),
  cpassword: (confPass, pass) => pass === confPass,
  fullname: (val) => !/[^A-Za-z0-9_ '-]/.test(val),
  alphabetOnly: (val) => !/[^A-Za-z ]/.test(val),
  phone: (val) => !/[^A-Za-z0-9_ '-]/.test(val),
  check: (val) => val,
  numberOnly: (val) => /^[0-9\b]+$/.test(val),
  decimalNumberOnly: (val) => /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(val),
};
