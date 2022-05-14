const appError = (httpStatus,errMessage,next)=>{
  const error = new Error(errMessage); //自訂錯誤訊息的error.message
  error.statusCode = httpStatus; //error.errorCode
  error.isOperational = true;
  next(error);
}

module.exports = appError;