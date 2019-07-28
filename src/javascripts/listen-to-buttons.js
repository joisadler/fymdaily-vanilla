import renderHomePage from './render-homepage';
import renderAddFoodPage from './render-add-food-page';
import renderCustomFoodsPage from './render-custom-foods-page';
import renderEatenFoodsPage from './render-eaten-foods-page';
import renderCreateFoodPage from './render-create-food-page';

export default () => {
  const homeButton = document.querySelector('.home-button');
  const eatenFoodsButton = document.querySelector('.eaten-foods-button');
  const addFoodButton = document.querySelector('.add-food-button');
  const createButton = document.querySelector('.option-create-button');
  const addButton = document.querySelector('.option-add-button');
  const cancelButton = document.querySelector('.option-cancel-button');
  const savedFoodButton = document.querySelector('.option-saved-button');
  const createFoodButton = document.querySelector('.option-create-button');

  if (homeButton) {
    homeButton.addEventListener('click',
      (e) => {
        e.preventDefault();
        window.history.pushState(null, null, '/homepage');
        renderHomePage();
      });
  }

  if (eatenFoodsButton) {
    eatenFoodsButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/eaten-foods');
      renderEatenFoodsPage();
    });
  }

  if (addFoodButton) {
    addFoodButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/add-food');
      renderAddFoodPage();
    });
  }

  if (addButton) {
    addButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/add-food');
      renderAddFoodPage();
    });
  }

  if (createButton) {
    createButton.addEventListener('click',
      (e) => {
        e.preventDefault();
        window.history.pushState(null, null, '/create-food');
        renderCreateFoodPage();
      });
  }

  if (cancelButton) {
    switch (window.location.pathname) {
      case '/create-food':
      case '/custom-foods':
        cancelButton.addEventListener('click',
          (e) => {
            e.preventDefault();
            window.history.pushState(null, null, '/add-food');
            renderAddFoodPage();
          });
        break;
      default:
        cancelButton.addEventListener('click',
          (e) => {
            e.preventDefault();
            window.history.pushState(null, null, '/homepage');
            renderHomePage();
          });
    }
  }

  if (createFoodButton) {
    createFoodButton.addEventListener('click',
      (e) => {
        e.preventDefault();
        window.history.pushState(null, null, '/create-food');
        renderCreateFoodPage();
      });
  }

  if (savedFoodButton) {
    savedFoodButton.addEventListener('click',
      (e) => {
        e.preventDefault();
        window.history.pushState(null, null, '/custom-foods');
        renderCustomFoodsPage();
      });
  }
};
