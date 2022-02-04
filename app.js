var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./controller/index');
var zoneRouter = require('./controller/zone');
var factoryRouter = require('./controller/factory');
var targetRouter = require('./controller/target');
var productionRouter = require('./controller/production');
var reportRouter = require('./controller/report');
var userRouter = require('./controller/user');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/zone', zoneRouter);
app.use('/api/factory', factoryRouter);
app.use('/api/target', targetRouter);
app.use('/api/production', productionRouter);
app.use('/api/report', reportRouter);
app.use('/api/user', userRouter);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;