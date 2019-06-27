import renderHomePage from './render-homepage';
import renderEatenFoodsPage from './render-eaten-foods-page';
import renderAddFoodPage from './render-add-food-page';

const routes = {
  '/homepage': renderHomePage,
  '/eaten-foods': renderEatenFoodsPage,
  '/add-food': renderAddFoodPage,
};

window.addEventListener('DOMContentLoaded', () => {
  routes[window.location.pathname]();
});

window.addEventListener('popstate', () => {
  routes[window.location.pathname]();
});
