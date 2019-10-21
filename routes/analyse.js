let express = require('express');
let commonService = require('../service/commonService');
let dateUtils = require('../common/dateUtils');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('analyse', {title: '业务分析'});
});

router.get('/financialBusinessAnalyse', function(req, res, next) {
  let service = new commonService.commonInvoke('financialBusinessAnalyse');
  let bankCode = req.cookies.secmsBankCode;
  let branchCode = req.cookies.secmsBranchCode;
  let fromDate = dateUtils.formatGMT(req.query.fromDate) + ' 00:00:00';
  let toDate = dateUtils.formatGMT(req.query.toDate) + ' 23:59:59';

  let parameter = bankCode + '/' + branchCode + '/' + fromDate + '/' + toDate;

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
        dataList: result.content.responseData
      });
    }
  })
});

router.get('/financialCallbackAnalyse', function(req, res, next) {
  let service = new commonService.commonInvoke('financialCallbackAnalyse');
  let bankCode = req.cookies.secmsBankCode;
  let branchCode = req.cookies.secmsBranchCode;
  let financialID = req.query.financialID;
  let fromDate = dateUtils.formatGMT(req.query.fromDate) + ' 00:00:00';
  let toDate = dateUtils.formatGMT(req.query.toDate) + ' 23:59:59';

  let parameter = bankCode + '/' + branchCode + '/' + financialID + '/' + fromDate + '/' + toDate;

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
        dataList: result.content.responseData
      });
    }
  })
});

router.get('/lobbyBusinessAnalyse', function(req, res, next) {
  let service = new commonService.commonInvoke('lobbyBusinessAnalyse');
  let bankCode = req.cookies.secmsBankCode;
  let branchCode = req.cookies.secmsBranchCode;
  let fromDate = dateUtils.formatGMT(req.query.fromDate) + ' 00:00:00';
  let toDate = dateUtils.formatGMT(req.query.toDate) + ' 23:59:59';

  let parameter = bankCode + '/' + branchCode + '/' + fromDate + '/' + toDate;

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
        dataList: result.content.responseData
      });
    }
  })
});

router.get('/lobbyCallbackAnalyse', function(req, res, next) {
  let service = new commonService.commonInvoke('lobbyCallbackAnalyse');
  let bankCode = req.cookies.secmsBankCode;
  let branchCode = req.cookies.secmsBranchCode;
  let lobbyID = req.query.lobbyID;
  let fromDate = dateUtils.formatGMT(req.query.fromDate) + ' 00:00:00';
  let toDate = dateUtils.formatGMT(req.query.toDate) + ' 23:59:59';

  let parameter = bankCode + '/' + branchCode + '/' + lobbyID + '/' + fromDate + '/' + toDate;

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
        dataList: result.content.responseData
      });
    }
  })
});

module.exports = router;