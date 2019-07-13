import renderHomePage from './render-homepage';
import renderEatenFoodsPage from './render-eaten-foods-page';
import renderAddFoodPage from './render-add-food-page';
import renderCreateFoodPage from './render-create-food-page';
import renderCustomFoodsPage from './render-custom-foods-page';

const routes = {
  '/homepage': renderHomePage,
  '/eaten-foods': renderEatenFoodsPage,
  '/add-food': renderAddFoodPage,
  '/create-food': renderCreateFoodPage,
  '/custom-foods': renderCustomFoodsPage,
};

window.addEventListener('DOMContentLoaded', () => {
  routes[window.location.pathname]();
});

window.addEventListener('popstate', () => {
  routes[window.location.pathname]();
});
