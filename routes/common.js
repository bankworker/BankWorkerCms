let express = require('express');
let commonService = require('../service/commonService');
let uploadUtils = require('../common/uploadUtils');
let router = express.Router();
let upload = uploadUtils.createUploadObject(['public','upload','branch']);


router.post('/fileUpload',  upload.array('file', 10), function(req,res,next){
  let uploadImageUrlArray = [];
  req.files.forEach(function (file, index) {
    uploadImageUrlArray.push('http://' + req.headers.host + '/upload/branch/' + req.cookies.secmsBranchCode + '/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    fileUrlList : uploadImageUrlArray
  });
  res.end();
});

module.exports = router;