let express = require('express');
let router = express.Router();
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('archive', {title: '考评指标管理'});
});

router.get('/data', function(req, res, next) {
  let service = new commonService.commonInvoke('archive');
  let parameter = '/1/9999/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode;
  service.get(parameter, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        archiveList: result.content.responseData
      });
    }
  });
});

router.get('/checkName', function (req, res, next) {
  let service = new commonService.commonInvoke('checkArchiveIsExist');
  let parameter = '/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode + '/' + req.cookies.archiveName;

  service.get(parameter, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        exist: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('archive');
  let data = {
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    archiveName: req.body.itemName,
    archiveType: req.body.itemType,
    archiveParentID: req.body.parentItemID,
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
  let service = new commonService.commonInvoke('archive');
  let data = {
    archiveID: req.body.itemID,
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    archiveName: req.body.itemName,
    archiveType: req.body.itemType,
    archiveParentID: req.body.parentItemID,
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

router.put('/changePosition', function (req, res, next) {
  let service = new commonService.commonInvoke('changeArchivePosition');
  let data = {
    archiveID: req.body.itemID,
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    archiveParentID: req.body.parentItemID,
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

router.put('/changeOrder', function (req, res, next) {
  let service = new commonService.commonInvoke('changeArchiveOrder');
  let data = {
    archiveID: req.body.archiveID,
    archiveSwapID: req.body.archiveSwapID,
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

router.put('/changeStatus', function (req, res, next) {
  let service = new commonService.commonInvoke('changeArchiveStatus');
  let data = {
    archiveID: req.body.archiveID,
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
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
  let service = new commonService.commonInvoke('archive');
  let archiveID = req.query.itemID;
  let parameter = '/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode + '/' + archiveID;

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