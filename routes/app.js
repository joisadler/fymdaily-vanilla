import express from 'express';

const router = express.Router();

// eslint-disable-next-line consistent-return
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
};

export default () => {
  router.get('/', isAuthenticated, (req, res) => {
    res.render('app', {
      user: req.user,
      language: req.user.language,
      region: req.user.region
    });
  });
  return router;
};
