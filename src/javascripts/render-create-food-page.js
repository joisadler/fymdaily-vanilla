import createFoodTemplate from '../../views/create-food.pug';
import renderHomePage from './render-homepage';
import renderAddFoodPage from './render-add-food-page';
import renderCustomFoodsPage from './render-custom-foods-page';

export default () => {
  const app = document.getElementById('app');
  app.innerHTML = createFoodTemplate;

  /* eslint-disable no-param-reassign */
  const navigationButtons = [...document
    .querySelectorAll('.navigation-button')];
  navigationButtons.forEach((button, i, buttons) => {
    button.style.width = `${button.offsetHeight}px`;
    if (i === buttons.length - 1) {
      const foodOptionsContainer = document
        .querySelector('.create-food-options-container');
      foodOptionsContainer.style.height = `${button.offsetHeight * 0.3}px`;
      const saveButton = document.querySelector('.create-food-save-button');
      saveButton.style.height = `${foodOptionsContainer.offsetHeight}px`;
      saveButton.style.width = `${saveButton.offsetHeight}px`;
    }
  });

  const createFoodInputs = [...document.querySelectorAll('.create-food-input')];
  createFoodInputs.forEach((input) => {
    const saveButton = document.querySelector('.create-food-save-button');
    input.style.height = `${saveButton.offsetWidth}px`;
  });

  const optionButtons = [...document
    .querySelectorAll('.create-food-option-button')];
  optionButtons.forEach((button) => {
    button.style.width = `${button.offsetHeight}px`;
  });

  const cancelButton = document.querySelector('.create-food-cancel-button');
  cancelButton.addEventListener('click',
    (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/add-food');
      renderAddFoodPage();
    });

  const savedFoodButton = document.querySelector('.create-food-saved-button');
  savedFoodButton.addEventListener('click',
    (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/custom-foods');
      renderCustomFoodsPage();
    });


  const homeButton = document.querySelector('.create-food-page-home-button');
  homeButton.addEventListener('click',
    (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/homepage');
      renderHomePage();
    });

  const createFoodForm = document.querySelector('.create-food-form');
  createFoodForm.addEventListener('submit', async (event) => {
    try {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const brand = document.getElementById('brand').value;
      const calories = document.getElementById('calories').value;
      const proteins = document.getElementById('proteins').value;
      const fats = document.getElementById('fats').value;
      const carbs = document.getElementById('carbs').value;
      // eslint-disable-next-line max-len
      await fetch(`/api/food?name=${name}&brand=${brand}&calories=${calories}&proteins=${proteins}&fats=${fats}&carbs=${carbs}`, {
        method: 'POST',
        credentials: 'include',
      });
      window.history.pushState(null, null, '/custom-foods');
      renderCustomFoodsPage();
    } catch (err) {
      console.log(err);
    }
  });
};
