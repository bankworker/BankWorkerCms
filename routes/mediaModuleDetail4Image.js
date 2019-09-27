let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('mediaModuleDetail4Image', {
    title: '媒体图文信息编辑',
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    mediaModuleID: req.query.mediaModuleID
  });
});

module.exports = router;