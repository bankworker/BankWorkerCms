let express = require('express');
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');
let uploadUtils = require('../common/uploadUtils');
let upload = uploadUtils.createUploadObject(['public','upload','branch']);
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('branchResource', {title: '营业网点资源管理'});
});

router.get('/searchList', function(req, res, next) {
  let service = new commonService.commonInvoke('branchResource');
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
      if(dataContent.dataList !== null){
        for(let data of dataContent.dataList){
          data.isVideo = data.resourceUrl.substr(data.resourceUrl.lastIndexOf('.') + 1).toLowerCase() === 'mp4';
        }
      }
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        dataContent: dataContent
      });
    }
  });
});

router.post('/fileUpload',  upload.array('file', 10), function(req,res,next){
  let uploadImageUrlArray = [];
  req.files.forEach(function (file, index) {
    uploadImageUrlArray.push('http://' + req.headers.host + '/upload/branch/' + req.cookies.secmsBranchCode + '/' + file.originalname)
  });
  //将其发回客户端
  res.json({
    err : false,
    fileList : uploadImageUrlArray
  });
  res.end();
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('branchResource');
  let data = {
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    resourceUrlList: req.body.resourceList,
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
  let service = new commonService.commonInvoke('branchResource');
  let data = {
    resourceID: req.body.resourceID,
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    resourceUrl: req.body.resourceUrl,
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
  let service = new commonService.commonInvoke('branchResource');
  let resourceID = req.query.resourceID;

  service.delete(resourceID, function (result) {
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