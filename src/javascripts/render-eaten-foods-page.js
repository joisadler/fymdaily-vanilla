import eatenFoodsTemplate from '../../views/eaten-foods.pug';
import eatenFoodCardTemplate from '../../views/eaten-food-card.pug';
import totalEatenFoodCardTemplate from '../../views/total-eaten-food-card.pug';
import addCSS from './load-css';
import listenToButtons from './listen-to-buttons';

const getUsersHistory = async () => {
  const data = await fetch('/api/history', {
    method: 'GET',
    credentials: 'include',
  });
  const json = await data.json();
  return json;
};

const createEatenFoodCard = (
  name,
  brand,
  weight,
  calories,
  proteins,
  fats,
  carbs
) => {
  const card = document.createElement('div');
  card.classList.add('eaten-food-card-wrapper');
  card.innerHTML = eatenFoodCardTemplate({
    name,
    brand,
    weight,
    calories,
    proteins,
    fats,
    carbs,
  });
  return card;
};

const createTotalEatenFoodCard = (
  totalCalories,
  totalProteins,
  totalFats,
  totalCarbs
) => {
  const card = document.createElement('div');
  card.classList.add('eaten-food-card-wrapper');
  card.innerHTML = totalEatenFoodCardTemplate({
    totalCalories,
    totalProteins,
    totalFats,
    totalCarbs,
  });
  return card;
};

const render = async () => {
  const app = document.getElementById('app');
  app.innerHTML = eatenFoodsTemplate({ path: 'eaten-foods' });

  const foodCardsContainer = document.querySelector('.food-cards');
  const history = await getUsersHistory();
  const { products } = history;
  products.forEach((product) => {
    const {
      name,
      brand,
      weight,
      calories,
      proteins,
      fats,
      carbs,
    } = product;
    foodCardsContainer.appendChild(createEatenFoodCard(
      name,
      brand,
      weight,
      calories,
      proteins,
      fats,
      carbs,
    ));
  });
  const totalCalories = products
    .reduce((acc, current) => acc + current.calories, 0);
  const totalProteins = products
    .reduce((acc, current) => acc + current.proteins, 0);
  const totalFats = products
    .reduce((acc, current) => acc + current.fats, 0);
  const totalCarbs = products
    .reduce((acc, current) => acc + current.carbs, 0);
  foodCardsContainer.appendChild(createTotalEatenFoodCard(
    totalCalories,
    totalProteins,
    totalFats,
    totalCarbs,
  ));
};

export default () => {
  addCSS();
  render();
  listenToButtons();
};
