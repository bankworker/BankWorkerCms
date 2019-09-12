let express = require('express');
let uploadUtils = require('../common/uploadUtils');
let router = express.Router();

let uploadPhoto = uploadUtils.createUploadObject(['public', 'upload', 'branch']);
let uploadResume = uploadUtils.createUploadObject(['public', 'upload', 'branch']);

router.post('/photoUpload',  uploadPhoto.array('file', 10), function(req,res,next){
  let uploadFileUrlArray = [];
  req.files.forEach(function (file, index) {
    uploadFileUrlArray.push('http://' + req.headers.host + '/upload/branch/' + req.cookies.secmsBranchCode + '/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    imageUrl : uploadFileUrlArray
  });
  res.end();
});

router.post('/resumeUpload',  uploadResume.array('file', 10), function(req,res,next){
  let uploadFileUrlArray = [];
  req.files.forEach(function (file, index) {
    uploadFileUrlArray.push('http://' + req.headers.host + '/upload/branch/' + req.cookies.secmsBranchCode + '/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    imageUrl : uploadFileUrlArray
  });
  res.end();
});

router.get('/', function(req, res, next) {
  res.render('userDetail', {
    title: '员工账户编辑',
    option: req.query.option,
    userID: req.query.userID
  });
});

module.exports = router;