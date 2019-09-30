let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

const loginRouter = require('./routes/login');
const indexRouter = require('./routes/index');

const archiveRouter = require('./routes/archive');
const archiveDetailRouter = require('./routes/archiveDetail');
const mediaModuleRouter = require('./routes/mediaModule');
const mediaModuleDetail4ImageRouter = require('./routes/mediaModuleDetail4Image');
const mediaModuleDetail4VideoRouter = require('./routes/mediaModuleDetail4Video');
const logoRouter = require('./routes/logo');
const backImageRouter = require('./routes/backImage');
const branchResourceRouter = require('./routes/branchResource');
const newsRouter = require('./routes/news');
const newsEditRouter = require('./routes/newsEdit');
const staffPostRouter = require('./routes/staffPost');
const usersRouter = require('./routes/users');
const usersDetailRouter = require('./routes/usersDetail');
const changePasswordRouter = require('./routes/changePassword');
const analyseRouter = require('./routes/analyse');
const callBackSettingRouter = require('./routes/callBackSetting');
const commonRouter = require('./routes/common');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//登录拦截器
app.use(function (req, res, next) {
  let url = req.originalUrl;
  if (url != '/' && url.indexOf('/login') < 0 && req.cookies['secmsUser'] === undefined) {
    return res.redirect("/");
  }
  next();
});

app.use('/', loginRouter);
app.use('/login', loginRouter);
app.use('/index', indexRouter);
app.use('/logo', logoRouter);
app.use('/backImage', backImageRouter);
app.use('/branchResource', branchResourceRouter);
app.use('/news', newsRouter);
app.use('/news/edit', newsEditRouter);
app.use('/staffPost', staffPostRouter);
app.use('/users', usersRouter);
app.use('/users/edit', usersDetailRouter);
app.use('/changePassword', changePasswordRouter);
app.use('/archive', archiveRouter);
app.use('/archiveDetail', archiveDetailRouter);
app.use('/analyse', analyseRouter);
app.use('/callBackSetting', callBackSettingRouter);
app.use('/mediaModule', mediaModuleRouter);
app.use('/mediaModule/edit/image', mediaModuleDetail4ImageRouter);
app.use('/mediaModule/edit/video', mediaModuleDetail4VideoRouter);
app.use('/common', commonRouter);

// app.use('/distribute', distributeRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
