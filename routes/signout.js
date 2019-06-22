import express from 'express';

const router = express.Router();

export default () => {
  router.get('/', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  return router;
};
