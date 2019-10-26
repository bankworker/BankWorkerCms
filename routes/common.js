let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/serviceSetting',  (req,res) => {
  let service = new commonService.commonInvoke('branchServiceSetting');
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
        serviceSetting: result.content.responseData
      });
    }
  })
});

module.exports = router;