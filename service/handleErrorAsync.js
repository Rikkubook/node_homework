const handleErrorAsync = function handleErrorAsync(func) {
  // func 將整個function帶入 async fun 帶入參數儲存
  // middleware 先接住 router 資料
  return function (req, res, next) { //帶回去
      func(req, res, next).catch( // 如果有錯誤,捕捉錯誤 
          function (error) {
              return next(error);
          }
      );
  };
};

module.exports = handleErrorAsync;