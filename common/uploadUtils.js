let path = require('path');
let fs = require("fs");
let multer = require('multer');

exports.createUploadObject = function (folders) {
  let uploadPath = path.resolve(__dirname, '..');
  for(let i = 0; i < folders.length; i++){
    uploadPath = path.join(uploadPath, folders[i]);
  }
  makeDir(uploadPath);

  let storage = multer.diskStorage({
    destination: function (req, file, cb){
      //文件上传成功后会放入public下的upload文件夹
      let branchCode = req.cookies.secmsBranchCode;
      let uploadDir = path.join(uploadPath,branchCode);
      makeDir(uploadDir);
      cb(null, uploadDir);

      // if (file.mimetype === 'audio/mp3') {
      //   cb(null, 'songs')
      // } else if (file.mimetype === 'image/jpeg') {
      //   cb(null, 'img')
      // } else {
      //   console.log(file.mimetype)
      //   cb({ error: 'Mime type not supported' })
      // }
    },
    filename: function (req, file, cb){
      //设置文件的名字为其原本的名字，也可以添加其他字符，来区别相同文件，例如file.originalname+new Date().getTime();利用时间来区分
      cb(null, file.originalname)
    }
  });

  return multer({storage: storage});
};

function makeDir(dirpath) {
  if (!fs.existsSync(dirpath)) {
    let pathtmp;
    dirpath.split("/").forEach(function(dirname) {
      if (pathtmp) {
        pathtmp = path.join(pathtmp, dirname);
      }
      else {
        //如果在linux系统中，第一个dirname的值为空，所以赋值为"/"
        if(dirname){
          pathtmp = dirname;
        }else{
          pathtmp = "/";
        }
      }
      if (!fs.existsSync(pathtmp)) {
        if (!fs.mkdirSync(pathtmp)) {
          return false;
        }
      }
    });
  }

  return true;
}