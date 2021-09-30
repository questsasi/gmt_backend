function errorHandler(errorObj) {
  console.log("=========================================================================================");
  console.log(errorObj);
  console.log("=========================================================================================");

  return {
    code: 400,
    data: {
      success: false,
      status: 0,
      message: "Server Error",
      data: errorObj,
    }
  }
  
}

module.exports = errorHandler;
