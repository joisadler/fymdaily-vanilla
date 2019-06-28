import addFoodTemplate from '../../views/add-food.pug';
import renderHomePage from './render-homepage';

export default () => {
  const app = document.getElementById('app');
  app.innerHTML = addFoodTemplate;

  /* eslint-disable no-param-reassign */
  const navigationButtons = [...document
    .querySelectorAll('.navigation-button')];
  navigationButtons.forEach((button, i, buttons) => {
    button.style.width = `${button.offsetHeight}px`;
    if (i === buttons.length - 1) {
      const foodOptionsContainer = document
        .querySelector('.add-food-options-container');
      foodOptionsContainer.style.height = `${button.offsetHeight * 0.3}px`;
    }
  });

  const optionButtons = [...document
    .querySelectorAll('.add-food-option-button')];
  optionButtons.forEach((button) => {
    button.style.width = `${button.offsetHeight}px`;
  });

  const searchButton = document.querySelector('.add-food-search-button');
  const searchBar = document.querySelector('.add-food-search-bar');
  const addFoodHeader = document.querySelector('.add-food-header');
  searchButton.addEventListener('click', () => {
    searchButton.style.width = '0';
    addFoodHeader.style.display = 'none';
    searchBar.style.display = 'block';
    searchBar.style.flex = '1';
    searchBar.focus();
  });
  /* eslint-enable no-param-reassign */

  const homeButton = document.querySelector('.add-food-page-home-button');
  homeButton.addEventListener('click',
    (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/homepage');
      renderHomePage();
    });
};
