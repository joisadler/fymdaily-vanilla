import createFoodTemplate from '../../views/create-food.pug';
import renderCustomFoodsPage from './render-custom-foods-page';
import listenToButtons from './listen-to-buttons';
import addCSS from './load-css';

const listenToFormSubmit = () => {
  const createFoodForm = document.querySelector('.create-food-form');
  createFoodForm.addEventListener('submit', async (event) => {
    try {
      event.preventDefault();
      const name = encodeURIComponent(document.getElementById('name').value);
      const brand = encodeURIComponent(document.getElementById('brand').value);
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
}

const render = () => {
  const app = document.getElementById('app');
  app.innerHTML = createFoodTemplate({ path: 'create-food' });
};

export default () => {
  addCSS();
  render();
  listenToButtons();
  listenToFormSubmit();
};
