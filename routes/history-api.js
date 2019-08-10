/* eslint-disable no-underscore-dangle */
import express from 'express';

import HistoryEntry from '../models/history-entry';

const router = express.Router();

// eslint-disable-next-line consistent-return
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
};

export default () => {
  // eslint-disable-next-line no-unused-vars
  router.get('/', (req, res) => {
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

  router.post('/', isAuthenticated, (req, res) => {
    const id = req.user._id;
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    today = `${dd}.${mm}.${yyyy}`;
    const newProduct = req.body;

    HistoryEntry.findOrCreate({ userId: id, date: today }, (error, entry) => {
      if (error) throw error;
      entry.products.push(newProduct);
      entry.save();
      res.end();
    });
  });

  router.put('/', async (req, res) => {
    const id = req.user._id;
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    today = `${dd}.${mm}.${yyyy}`;
    const position = Number(req.query.position);
    const weight = Number(req.query.weight);

    const entry = await HistoryEntry.findOne({ userId: id, date: today });
    const { products } = entry;
    const updatedProducts = products.slice(0);

    updatedProducts.forEach((p, i) => {
      if (i === position) {
        // eslint-disable-next-line no-param-reassign
        p.weight = weight;
      }
    });

    await HistoryEntry.findOneAndUpdate({
      userId: id,
      date: today
    }, { products: updatedProducts });
    res.status(204);
    res.end();
  });

  router.delete('/', async (req, res) => {
    const id = req.user._id;
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    today = `${dd}.${mm}.${yyyy}`;
    const position = Number(req.query.position);

    const entry = await HistoryEntry.findOne({ userId: id, date: today });
    const { products } = entry;
    const updatedProducts = products.slice(0);

    updatedProducts.forEach((p, i, arr) => {
      if (i === position) arr.splice(i, 1);
    });

    await HistoryEntry.findOneAndUpdate({
      userId: id,
      date: today
    }, { products: updatedProducts });
    res.status(204);
    res.end();
  });

  return router;
};
