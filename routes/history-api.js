import express from 'express';

import HistoryEntry from '../models/history-entry';

const router = express.Router();

// eslint-disable-next-line consistent-return
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
};

export default () => {
  // eslint-disable-next-line no-unused-vars
  router.get('/', isAuthenticated, (req, res) => {
    // eslint-disable-next-line no-underscore-dangle
    const id = req.user._id;
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    today = `${dd}.${mm}.${yyyy}`;

    HistoryEntry.findOrCreate({ userId: id, date: today }, (error, entry) => {
      if (error) throw error;
      res.send(entry);
      res.end();
    });
  });

  router.put('/', isAuthenticated, (req, res) => {
    // eslint-disable-next-line no-underscore-dangle
    const id = req.user._id;
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    today = `${dd}.${mm}.${yyyy}`;
    const newProduct = req.body;
    console.log(newProduct);

    HistoryEntry.findOrCreate({ userId: id, date: today }, (error, entry) => {
      if (error) throw error;
      entry.products.push(newProduct);
      entry.save();
      res.end();
    });
  });

  return router;
};
