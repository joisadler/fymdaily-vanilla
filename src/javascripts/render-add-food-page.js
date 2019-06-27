import addFoodTemplate from '../../views/add-food.pug';
import renderHomePage from './render-homepage';

export default () => {
  const app = document.getElementById('app');
  app.innerHTML = addFoodTemplate;

  /* eslint-disable no-param-reassign */
  const navigationButtons = [...document
    .querySelectorAll('.navigation-button')];
  navigationButtons.forEach((button) => {
    button.style.width = `${button.offsetHeight}px`;
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
