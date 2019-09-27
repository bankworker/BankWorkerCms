let express = require('express');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('users', {title: '员工账户信息一览'});
});

router.get('/searchList', function(req, res, next) {
  let service = new commonService.commonInvoke('branchStaff');
  let pageNumber = parseInt(req.query.pageNumber);
  let parameter = '/' + pageNumber + '/' + sysConfig.pageSize + '/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode;

  service.get(parameter, function (result) {
    if (result.err || !result.content.result) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('员工账户信息一览', pageNumber, result);
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        dataContent: dataContent
      });
    }
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