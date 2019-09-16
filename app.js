let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

const loginRouter = require('./routes/login');
const indexRouter = require('./routes/index');
const examineModuleRouter = require('./routes/module');
const blockRouter = require('./routes/block');
const itemRouter = require('./routes/item');
const detailRouter = require('./routes/detail');
const detailViewRouter = require('./routes/detailView');
const logoRouter = require('./routes/logo');
const backImageRouter = require('./routes/backImage');
const branchResourceRouter = require('./routes/branchResource');
const newsRouter = require('./routes/news');
const newsEditRouter = require('./routes/newsEdit');
const staffPostRouter = require('./routes/staffPost');
const usersRouter = require('./routes/users');
const usersDetailRouter = require('./routes/usersDetail');
const changePasswordRouter = require('./routes/changePassword');
const advertiseRouter = require('./routes/advertise');
const advertiseDetailRouter = require('./routes/advertiseDetail');
const distributeRouter = require('./routes/distribute');
const analyseRouter = require('./routes/analyse');
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
  if (url != '/' && url.indexOf('/register') < 0 && req.cookies['secmsUser'] === undefined) {
    return res.redirect("/");
  }
  next();
});

app.use('/', loginRouter);
app.use('/index', indexRouter);
app.use('/module', examineModuleRouter);
app.use('/block', blockRouter);
app.use('/item', itemRouter);
app.use('/detail', detailRouter);
app.use('/detailView', detailViewRouter);
app.use('/logo', logoRouter);
app.use('/backImage', backImageRouter);
app.use('/branchResource', branchResourceRouter);
app.use('/news', newsRouter);
app.use('/news/edit', newsEditRouter);
app.use('/users', usersRouter);
app.use('/users/edit', usersDetailRouter);
app.use('/staffPost', staffPostRouter);
app.use('/changePassword', changePasswordRouter);
app.use('/advertise', advertiseRouter);
app.use('/advertiseDetail', advertiseDetailRouter);
app.use('/distribute', distributeRouter);
app.use('/analyse', analyseRouter);
app.use('/common', commonRouter);

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
