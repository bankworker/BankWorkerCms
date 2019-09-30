let express = require('express');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('callBackSetting', {title: '理财业务回呼类型管理'});
});

router.get('/searchList', function(req, res, next) {
  let service = new commonService.commonInvoke('callBack');
  let pageNumber = parseInt(req.query.pageNumber);
  let parameter = '/' + pageNumber + '/' + sysConfig.pageSize + '/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode;

  service.get(parameter, function (result) {
    if (result.err || !result.content.result) {
      res.json({
        err: true,
        msg: result.err ? result.msg : result.content.responseMessage
      });
    } else {
      let dataContent = commonService.buildRenderData('理财业务回呼类型管理', pageNumber, result);
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        dataContent: dataContent
      });
    }
  });
});

router.get('/exist', function(req, res, next) {
  let service = new commonService.commonInvoke('checkCallBackExist');
  let parameter = '/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode+ '/' + req.query.callbackMessage;

  service.get(parameter, function (result) {
    if (result.err || !result.content.result) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        result: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('callBack');
  let data = {
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    callbackMsg: req.body.callbackMsg,
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
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

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('callBack');
  let data = {
    callbackID: req.body.callbackID,
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    callbackMsg: req.body.callbackMsg,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
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

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('callBack');
  let callbackID = req.query.callBackID;

  service.delete(callbackID, function (result) {
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