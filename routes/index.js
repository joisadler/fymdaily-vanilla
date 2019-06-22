import express from 'express';

const router = express.Router();

export default () => {
  router.get('/', (req, res) => {
    res.render('index', {
      message: req.flash('message'),
      //title: 'FYMdaily'
    });
  });
  return router;
};
