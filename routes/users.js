let express = require('express');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  let service = new commonService.commonInvoke('branchStaff');
  let pageNumber = req.query.pageNumber;
  let bankCode = req.cookies.secmsBankCode;
  let branchCode = req.cookies.secmsBranchCode;

  if(pageNumber === undefined){
    pageNumber = 1;
  }

  service.getPageData(pageNumber, bankCode, branchCode,function (result) {
    let renderData = commonService.buildRenderData('员工账户信息一览', pageNumber, result);
    res.render('users', renderData);
  });
});

router.get('/authorizedSystem', function(req, res, next) {
  let service = new commonService.commonInvoke('authorizedSystem');
  let accountID = req.query.accountID;

  service.get(accountID, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        dataList: result.content.responseData
      });
    }
  });
});

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('branchStaff');
  let staffID = req.query.staffID;

  service.delete(staffID, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage
      });
    }
  });
});

module.exports = router;