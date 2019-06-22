import express from 'express';

const router = express.Router();

export default (passport) => {
  router.post('/', (req, res, next) => {
    // eslint-disable-next-line consistent-return
    passport.authenticate('login', (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.render('index', {
          usernameOrEmail: req.body.usernameOrEmail,
          password: req.body.password,
          message: req.flash('message')
        });
      }
      req.logIn(user, (error) => {
        if (error) return next(error);
        return res.redirect('/home');
      });
    })(req, res, next);
  });
  return router;
};
