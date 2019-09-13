let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

const login = require('./routes/login');
const index = require('./routes/index');
const examineModule = require('./routes/module');
const block = require('./routes/block');
const item = require('./routes/item');
const detail = require('./routes/detail');
const detailView = require('./routes/detailView');
const logo = require('./routes/logo');
const sysName = require('./routes/sysName');
const news = require('./routes/news');
const newsEdit = require('./routes/newsEdit');
const users = require('./routes/users');
const usersDetail = require('./routes/usersDetail');
const changePassword = require('./routes/changePassword');
const advertise = require('./routes/advertise');
const advertiseDetail = require('./routes/advertiseDetail');
const distribute = require('./routes/distribute');
const analyse = require('./routes/analyse');
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

app.use('/', login);
app.use('/index', index);
app.use('/index', index);
app.use('/module', examineModule);
app.use('/block', block);
app.use('/item', item);
app.use('/detail', detail);
app.use('/detailView', detailView);
app.use('/sysName', sysName);
app.use('/logo', logo);
app.use('/news', news);
app.use('/news/edit', newsEdit);
app.use('/users', users);
app.use('/users/edit', usersDetail);
app.use('/changePassword', changePassword);
app.use('/advertise', advertise);
app.use('/advertiseDetail', advertiseDetail);
app.use('/distribute', distribute);
app.use('/analyse', analyse);

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
