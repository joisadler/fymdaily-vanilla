import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import flash from 'connect-flash';
import cookieSession from 'cookie-session';
import compression from 'compression';
import helmet from 'helmet';
import methodOverride from 'method-override';
import initPassport from './passport/init';
import indexRouter from './routes/index';
import loginRouter from './routes/login';
import signupRouter from './routes/signup';
import appRouter from './routes/app';
import signoutRouter from './routes/signout';
import deleteRouter from './routes/delete';
import userApiRouter from './routes/user-api';
import historyApiRouter from './routes/history-api';
import dbConfig from './db';

mongoose.connect(dbConfig.url, { useNewUrlParser: true });
initPassport(passport);
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(helmet());
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
};
app.use(compression({ filter: shouldCompress }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter());
app.use('/login', loginRouter(passport));
app.use('/signup', signupRouter(passport));
app.use('/home', appRouter());
app.use('/homepage', appRouter());
app.use('/signout', signoutRouter());
app.use('/delete', deleteRouter());
app.use('/user', userApiRouter());
app.use('/history', historyApiRouter());

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

/* eslint-disable no-unused-vars */
// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
