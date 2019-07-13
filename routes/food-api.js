/* eslint-disable no-underscore-dangle */
import express from 'express';
import Food from '../models/food';

const router = express.Router();

export default () => {
  router.get('/', async (req, res) => {
    try {
      const createdBy = req.user._id;
      const foods = await Food.find({ createdBy });
      res.set('Content-Type', 'application/json');
      res.send(foods);
      res.status(201);
      res.end();
    } catch (err) {
      console.error(err);
    }
  });

  router.post('/', async (req, res) => {
    try {
      const createdBy = req.user._id;
      const {
        name,
        brand,
        calories,
        proteins,
        fats,
        carbs
      } = req.query;
      await Food.findOrCreate({
        createdBy,
        name,
        brand,
        calories,
        proteins,
        fats,
        carbs
      });
      res.status(201);
      res.end();
    } catch (err) {
      console.error(err);
    }
  });

  // router.put('/', async (req, res) => {
  //   try {
  //   //
  //   } catch (err) {
  //     console.error(err);
  //   }
  // });

  router.delete('/', async (req, res) => {
    try {
      const createdBy = req.user._id;
      const {
        name,
        brand,
      } = req.query;
      await Food.findOneAndDelete({
        createdBy,
        name,
        brand,
      });
      res.status(204);
      res.end();
    } catch (err) {
      console.error(err);
    }
  });
  return router;
};
