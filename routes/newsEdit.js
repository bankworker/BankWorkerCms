let express = require('express');
let fs = require("fs");
let commonService = require('../service/commonService');
let router = express.Router();
let dateUtils = require('../common/DateUtils');

router.get('/', function(req, res, next) {
  let newsID = req.query.newsID;
  res.render('newsEdit', {title: '新闻编辑', newsID: newsID});
});

router.get('/detail', function(req, res, next) {
  let service = new commonService.commonInvoke('news');
  let parameter = req.query.newsID;

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
        newsInfo: result.content.responseData
      });
    }
  })
});

router.delete('/deleteFile', function (req, res, next) {
  let fileName = req.query.fileName;
  let filePath = './public/images/upload/' + fileName;

  fs.exists(filePath, function (exists) {
    if(exists){
      fs.unlink(filePath, function(err) {
        if (err) {
          res.json({err: true, msg: '文件删除失败。'});
        }else{
          res.json({err: false, msg: '文件删除成功。'});
        }
      });
    }else{
      res.json({err: false, msg: '文件删除功能。'});
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('news');
  let data = {
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    newsTitle: req.body.newsTitle,
    newsDate: dateUtils.formatUTC(req.body.newsDate),
    thumbnailUrl: req.body.thumbnailUrl,
    newsContent: req.body.newsContent,
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
  let service = new commonService.commonInvoke('news');
  let data = {
    newsID: req.body.newsID,
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    newsTitle: req.body.newsTitle,
    newsDate: dateUtils.formatUTC(req.body.newsDate),
    thumbnailUrl: req.body.thumbnailUrl,
    newsContent: req.body.newsContent,
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

module.exports = router;