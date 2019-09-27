let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('mediaModule', {title: '媒体信息管理'});
});

router.get('/searchList', function(req, res, next) {
  let service = new commonService.commonInvoke('mediaModule');
  let pageNumber = parseInt(req.query.pageNumber);
  let parameter = '/' + pageNumber + '/' + sysConfig.pageSize + '/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode;

  service.get(parameter, function (result) {
    if (result.err || !result.content.result) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      let dataContent = commonService.buildRenderData('营业网点新闻管理', pageNumber, result);
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        dataContent: dataContent
      });
    }
  });
});

router.get('/search', function(req, res, next) {
  let service = new commonService.commonInvoke('mediaModule');
  let parameter = '/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode + '/' + req.query.mediaModuleID;

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
        dataDetail: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('mediaModule');
  let data = {
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    mediaModuleName: req.body.mediaModuleName,
    mediaModuleType: req.body.mediaModuleType,
    detailJson: req.body.detailJson,
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
  let service = new commonService.commonInvoke('mediaModule');
  let data = {
    mediaModuleID: req.body.mediaModuleID,
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    mediaModuleName: req.body.mediaModuleName,
    mediaModuleType: req.body.mediaModuleType,
    detailJson: req.body.detailJson,
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

router.put('/changeStatus', function (req, res, next) {
  let service = new commonService.commonInvoke('changeMediaModuleStatus');
  let data = {
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    mediaModuleID: req.body.mediaModuleID,
    dataStatus: req.body.dataStatus,
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
  let service = new commonService.commonInvoke('mediaModule');
  let bankCode = req.cookies.secmsBankCode;
  let branchCode = req.cookies.secmsBranchCode;
  let mediaModuleID = req.query.mediaModuleID;
  let parameter = '/' + bankCode + '/' + branchCode + '/' + mediaModuleID;

  service.delete(parameter, function (result) {
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