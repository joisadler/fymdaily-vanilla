import eatenFoodsTemplate from '../../views/eaten-foods.pug';
import renderHomePage from './render-homepage';

export default () => {
  const app = document.getElementById('app');
  app.innerHTML = eatenFoodsTemplate;

  const homeButton = document.querySelector('.home-button');
  homeButton.addEventListener('click',
    (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/homepage');
      renderHomePage();
    });
};
