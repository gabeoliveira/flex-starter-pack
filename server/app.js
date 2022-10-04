var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const deployRouter = require('./routes/deploy');

const publicPath = path.join(__dirname, '..', 'client', 'starter-pack-client', 'build');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicPath));

app.use('/deploy', deployRouter);

app.get('/', function(req, res, next) {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// catch 4t04 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

//app.listen(port, () => console.log(`App listening on port ${port}`))

module.exports = app;
