let express = require('express');
let router = express.Router();
let sysConfig = require('../config/sysConfig');
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('news', {title: '营业网点新闻管理'});
});

router.get('/searchList', function(req, res, next) {
  let service = new commonService.commonInvoke('news');
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

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('news');
  let newsID = req.query.newsID;

  service.delete(newsID, function (result) {
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