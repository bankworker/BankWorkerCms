let express = require('express');
let uploadUtils = require('../common/uploadUtils');
let commonService = require('../service/commonService');
let router = express.Router();

let uploadPhoto = uploadUtils.createUploadObject(['public', 'upload', 'branch']);

router.get('/', function(req, res, next) {
  res.render('usersDetail', {title: '员工账户编辑', staffID: req.query.staffID});
});

router.get('/detail', function(req, res, next) {
  let service = new commonService.commonInvoke('branchStaff');
  let staffID = req.query.staffID;
  let parameter = staffID + '/N';

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
        staffInfo: result.content.responseData
      });
    }
  });
});

router.get('/staffPost', function(req, res, next) {
  let service = new commonService.commonInvoke('staffPost');
  let parameter = '/1/9999/' + req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode;

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
        staffPostList: result.content.responseData
      });
    }
  });
});

router.get('/cellphone', function(req, res, next) {
  let service = new commonService.commonInvoke('checkBranchStaffCellphone');
  let cellphone = req.query.cellphone;

  service.get(cellphone, function (result) {
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

router.post('/fileUpload',  uploadPhoto.array('file', 10), function(req,res,next){
  let uploadFileUrlArray = [];
  req.files.forEach(function (file, index) {
    uploadFileUrlArray.push('http://' + req.headers.host + '/upload/branch/' + req.cookies.secmsBranchCode + '/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    fileUrl : uploadFileUrlArray
  });
  res.end();
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('branchStaff');
  let data = {
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    staffName: req.body.staffName,
    staffCellphone: req.body.staffCellphone,
    staffPostID: req.body.staffPostID,
    staffPhotoUrl: req.body.staffPhotoUrl,
    staffResumeUrl: req.body.staffResumeUrl,
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: false,
        msg: result.msg
      });
    }
  })
});

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('branchStaff');
  let data = {
    staffID: req.body.staffID,
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    staffName: req.body.staffName,
    staffCellphone: req.body.staffCellphone,
    staffPostID: req.body.staffPostID,
    staffPhotoUrl: req.body.staffPhotoUrl,
    staffResumeUrl: req.body.staffResumeUrl,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: false,
        msg: result.msg
      });
    }
  })
});

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('user');
  let userID = req.query.userID;

  service.delete(userID, function (result) {
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