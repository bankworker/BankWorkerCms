let express = require('express');
let router = express.Router();
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('login', { title: '用户登录', layout: null });
});

router.get('/backImageSetting', function(req, res, next) {
  let service = new commonService.commonInvoke('branchInfo');
  let parameter = req.cookies.secmsBankCode + '/' + req.cookies.secmsBranchCode;

  service.get(parameter, function (result) {
    if (result.err) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        branchInfo: result.content.responseData
      });
    }
  })
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('login');
  let param = req.body.account + '/' + req.body.password + '/4';

  service.get(param, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        userInfo: result.content.responseData
      });
    }
  })
});

module.exports = router;