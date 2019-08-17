import renderHomePage from './render-homepage';
import renderEatenFoodsPage from './render-eaten-foods-page';
import renderAddFoodPage from './render-add-food-page';
import renderCreateFoodPage from './render-create-food-page';
import renderCustomFoodsPage from './render-custom-foods-page';
import renderUserInfoPage from './render-user-info-page';
import addListenerMulti from './add-listener-multi';
import fontloader from './fontloader';

fontloader();

const routes = {
  '/homepage': renderHomePage,
  '/eaten-foods': renderEatenFoodsPage,
  '/add-food': renderAddFoodPage,
  '/create-food': renderCreateFoodPage,
  '/custom-foods': renderCustomFoodsPage,
  '/edit-food': renderCustomFoodsPage,
  '/user-info': renderUserInfoPage,
};

addListenerMulti(window, 'DOMContentLoaded popstate', () => {
  if (routes[window.location.pathname]) {
    routes[window.location.pathname]();
  } else {
    renderHomePage();
  }
});
