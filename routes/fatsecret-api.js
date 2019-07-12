/* eslint-disable no-restricted-globals */
import express from 'express';
import { isArray } from 'util';
import FatsecretAPI from 'fatsecret';

const router = express.Router();
const { FATSECRET_KEY, FATSECRET_SECRET } = process.env;
const API = new FatsecretAPI(FATSECRET_KEY, FATSECRET_SECRET);
const searchFoods = params => API.method('foods.search', params);
const getFood = params => API.method('food.get', params);

export default () => {
  router.get('/', async (req, res) => {
    try {
    // eslint-disable-next-line camelcase
      const { search_expression, language, region } = req.query;
      const results = await searchFoods({
        search_expression,
        language,
        region,
        max_results: 10,
      });
      const response = {};
      if (!results.foods.food) {
        res.json(response);
      } else {
        let key = 0;
        results.foods.food.map(async (food, i) => {
          const product = await getFood({
            food_id: food.food_id
          });
          const nutriments = isArray(product.food.servings.serving)
            ? product.food.servings.serving[0]
            : product.food.servings.serving;
          const name = product.food.food_name;
          const brand = product.food.brand_name || '';
          let calories = (nutriments.calories * 100)
          / nutriments.metric_serving_amount;
          let proteins = (nutriments.protein * 100)
          / nutriments.metric_serving_amount;
          let fats = (nutriments.fat * 100)
          / nutriments.metric_serving_amount;
          let carbs = (nutriments.sugar * 100)
          / nutriments.metric_serving_amount;
          if (nutriments.metric_serving_unit === 'oz') {
            calories /= 29.574;
            proteins /= 29.574;
            fats /= 29.574;
            carbs /= 29.574;
          }
          if (!isNaN(calories)
          && !isNaN(proteins)
          && !isNaN(fats)
          && !isNaN(carbs)) {
            response[key] = {
              name,
              brand,
              calories,
              proteins,
              fats,
              carbs
            };
            key += 1;
          }
          if (i === results.foods.food.length - 1) {
            res.json(response);
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  });
  return router;
};
