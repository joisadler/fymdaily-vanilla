import renderHomePage from './render-homepage';
import renderEatenFoodsPage from './render-eaten-foods-page';
import renderAddFoodPage from './render-add-food-page';
import renderCreateFoodPage from './render-create-food-page';
import renderCustomFoodsPage from './render-custom-foods-page';
import addListenerMulti from './add-listener-multi';
// import addCss from './add-css';
import fontloader from './fontloader';

// addCss();
fontloader();

const routes = {
  '/homepage': renderHomePage,
  '/eaten-foods': renderEatenFoodsPage,
  '/add-food': renderAddFoodPage,
  '/create-food': renderCreateFoodPage,
  '/custom-foods': renderCustomFoodsPage,
};

addListenerMulti(window, 'DOMContentLoaded popstate', () => {
  routes[window.location.pathname]();
});

// const fontloader = document.createElement('script');
// fontloader.src = 'fontloader.bundle.js';
// document.body.appendChild(fontloader);
