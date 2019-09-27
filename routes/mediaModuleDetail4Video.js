let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('mediaModuleDetail4Video', {
    title: '媒体视频信息编辑',
    bankCode: req.cookies.secmsBankCode,
    branchCode: req.cookies.secmsBranchCode,
    mediaModuleID: req.query.mediaModuleID
  });
});

module.exports = router;