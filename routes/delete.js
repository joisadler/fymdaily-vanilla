import express from 'express';
import User from '../models/user';

const router = express.Router();

// eslint-disable-next-line consistent-return
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
};

export default () => {
  router.get('/:id', isAuthenticated, (req, res) => {
    console.log(`delete user with id: ${req.params.id}`);
    User.findByIdAndRemove(req.params.id, (err) => {
      if (err) res.send(err);
      req.flash('message', 'Account has been successfully deleted!');
      res.redirect('/');
    });
  });
  return router;
};
