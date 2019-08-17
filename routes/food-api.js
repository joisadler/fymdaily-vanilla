/* eslint-disable no-param-reassign */
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
      const name = decodeURIComponent(req.query.name).trim();
      const brand = decodeURIComponent(req.query.brand).trim();
      const {
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

  router.put('/', async (req, res) => {
    const createdBy = req.user._id;
    const { 
      calories,
      proteins,
      fats,
      carbs,
      position,
    } = req.query;
    const name = decodeURIComponent(req.query.name);
    const brand = decodeURIComponent(req.query.brand);
    try {
      const products = await Food.find({ createdBy });
      const newProducts = products.slice(0);
      newProducts.forEach(async (product, i) => {
        if (product === newProducts[position]) {
          await Food.findOneAndUpdate({
            name: product.name,
            brand: product.brand,
          }, {
            name,
            brand,
            calories,
            proteins,
            fats,
            carbs,
          });
        }
      });
      res.status(204);
      res.end();
    } catch (err) {
      console.error(err);
    }
  });

  router.delete('/', async (req, res) => {
    const createdBy = req.user._id;
    const name = decodeURIComponent(req.query.name);
    const brand = decodeURIComponent(req.query.brand);
    try {
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
