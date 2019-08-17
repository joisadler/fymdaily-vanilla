import editFoodTemplate from '../../views/edit-food.pug';
import renderCustomFoodsPage from './render-custom-foods-page';
import listenToButtons from './listen-to-buttons';
import addCSS from './load-css';

const listenToFormSubmit = (position) => {
  const editFoodForm = document.querySelector('.edit-food-form');
  editFoodForm.addEventListener('submit', async (event) => {
    try {
      event.preventDefault();
      const name = encodeURIComponent(document.getElementById('name').value);
      const brand = encodeURIComponent(document.getElementById('brand').value);
      const calories = document.getElementById('calories').value;
      const proteins = document.getElementById('proteins').value;
      const fats = document.getElementById('fats').value;
      const carbs = document.getElementById('carbs').value;
      // eslint-disable-next-line max-len
      await fetch(`/api/food?name=${name}&brand=${brand}&calories=${calories}&proteins=${proteins}&fats=${fats}&carbs=${carbs}&position=${position}`, {
        method: 'PUT',
        credentials: 'include',
      });
      window.history.pushState(null, null, '/custom-foods');
      renderCustomFoodsPage();
    } catch (err) {
      console.log(err);
    }
  });
}

const render = (
  name,
  brand,
  calories,
  proteins,
  fats,
  carbs,
) => {
  const app = document.getElementById('app');
  app.innerHTML = editFoodTemplate({
    path: 'edit-food',
    name,
    brand,
    calories,
    proteins,
    fats,
    carbs,
  });
};

export default (
  name,
  brand,
  calories,
  proteins,
  fats,
  carbs,
  position,
) => {
  addCSS();
  render(
    name,
    brand,
    calories,
    proteins,
    fats,
    carbs,
  );
  listenToButtons();
  listenToFormSubmit(position);
};
