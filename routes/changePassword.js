let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('changePassword', { title: '密码修改' });
});

router.get('/check', function (req, res, next) {
  let service = new commonService.commonInvoke('login');
  let param = req.query.cellphone + '/' + req.query.password;

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
        exist: result.content.responseData !== null
      });
    }
  })
});

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('changePassword');

  let data = {
    accountID: req.body.accountID,
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    systemID: '4',
    password: req.body.password,
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
