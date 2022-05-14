const appError = (httpStatus,errMessage,next)=>{
  console.log('2.appError')
  const error = new Error(errMessage); //自訂錯誤訊息的error.message
  error.statusCode = httpStatus; //error.errorCode
  error.isOperational = true;
  next(error);
}

module.exports = appError;