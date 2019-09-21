let express = require('express');
let fs = require("fs");
let sysConfig = require('../config/sysConfig');
let router = express.Router();
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  let archiveID = req.query.archiveID;
  let breadcrumbs = req.query.breadcrumbs;
  res.render('archiveDetail', { title: '指标明细管理',
    archiveID: archiveID,
    breadcrumbs: breadcrumbs
  });
});

router.get('/data', function (req, res, next) {
  let service = new commonService.commonInvoke('archiveDetail');
  let parameter = '/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode + '/' + req.query.archiveID;

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
        dataList: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('archiveDetail');
  let data = {
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    archiveID: req.body.archiveID,
    archiveDetailOrder: req.body.archiveDetailOrder,
    archiveDetailType: req.body.archiveDetailType,
    archiveDetailContent: req.body.archiveDetailContent,
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
        msg: result.content.responseMessage,
        archiveDetailID: result.content.responseData
      });
    }
  });
});

router.put('/reverseSequence', function (req, res, next) {
  let service = new commonService.commonInvoke('changeArchiveDetailPosition');
  let data = {
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    archiveID: req.body.archiveID,
    archiveDetailID: req.body.archiveDetailID,
    archiveDetailSwapID: req.body.archiveDetailSwapID,
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

router.delete('/deleteArchiveDetail', function (req, res, next) {
  let service = new commonService.commonInvoke('deleteArchiveDetail');
  let parameter = '/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode + '/' + req.query.archiveID + '/' + req.query.archiveDetailID;

  service.delete(parameter, function (result) {
    if(result.err || !result.content.result){
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

router.delete('/deleteOfArchive', function (req, res, next) {
  let service = new commonService.commonInvoke('deleteOfArchive');
  let parameter = req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode + '/' + req.query.archiveID;

  service.delete(parameter, function (result) {
    if(result.err || !result.content.result){
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

// router.delete('/deleteFile', function (req, res, next) {
//   let fileName = req.query.fileName;
//   let filePath = './public/images/upload/' + fileName;
//
//   fs.exists(filePath, function (exists) {
//     if(exists){
//       fs.unlink(filePath, function(err) {
//         if (err) {
//           res.json({err: true, msg: '文件删除失败。'});
//         }else{
//           res.json({err: false, msg: '文件删除成功。'});
//         }
//       });
//     }else{
//       res.json({err: false, msg: '文件删除功能。'});
//     }
//   });
// });

module.exports = router;