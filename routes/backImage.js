let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('backImage', { title: '网点系统背景设置'});
});

router.get('/detail', function(req, res, next) {
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

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('changeBackImage');
  let data = {
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    branchBackImage: req.body.branchBackImage,
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