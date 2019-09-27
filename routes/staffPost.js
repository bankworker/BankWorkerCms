let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('staffPost', {title: '员工岗位管理'});
});

router.get('/searchList', function(req, res, next) {
  let service = new commonService.commonInvoke('staffPost');
  let pageNumber = parseInt(req.query.pageNumber);
  let parameter = '/' + pageNumber + '/' + sysConfig.pageSize + '/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode;

  service.get(parameter, function (result) {
    if (result.err || !result.content.result) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('员工岗位管理', pageNumber, result);
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        dataContent: dataContent
      });
    }
  });
});

router.get('/exist', function(req, res, next) {
  let service = new commonService.commonInvoke('checkStaffPostName');
  let parameter = '/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode + '/' + req.query.staffPostName;

  service.get(parameter, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        result: result.content.responseData
      });
    }
  });
});

router.get('/isUsing', function(req, res, next) {
  let service = new commonService.commonInvoke('checkStaffPostIsUsing');
  let parameter = '/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode + '/' + req.query.staffPostID;

  service.get(parameter, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        isUsing: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('staffPost');
  let data = {
    staffPostName: req.body.staffPostName,
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
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
  let service = new commonService.commonInvoke('staffPost');
  let data = {
    staffPostID: req.body.staffPostID,
    staffPostName: req.body.staffPostName,
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
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
  let service = new commonService.commonInvoke('staffPost');
  let staffPostID = req.query.staffPostID;

  service.delete(staffPostID, function (result) {
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