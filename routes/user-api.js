import express from 'express';

const router = express.Router();

// eslint-disable-next-line consistent-return
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
};

export default () => {
  router.get('/', isAuthenticated, (req, res) => {
    res.json(req.user);
  });
  return router;
};
