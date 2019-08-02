/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
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
  card.classList.add('total-eaten-food-card-wrapper');
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
      calories * weight / 100,
      proteins * weight / 100,
      fats * weight / 100,
      carbs * weight / 100,
    ));
  });
  const totalCalories = products
    .reduce((acc, current) => acc + current.calories * current.weight / 100, 0);
  const totalProteins = products
    .reduce((acc, current) => acc + current.proteins * current.weight / 100, 0);
  const totalFats = products
    .reduce((acc, current) => acc + current.fats * current.weight / 100, 0);
  const totalCarbs = products
    .reduce((acc, current) => acc + current.carbs * current.weight / 100, 0);
  foodCardsContainer.appendChild(createTotalEatenFoodCard(
    totalCalories,
    totalProteins,
    totalFats,
    totalCarbs,
  ));

  const editButton = document.querySelector('.option-edit-button');
  const saveButton = document.querySelector('.option-save-button');
  const addButton = document.querySelector('.option-add-button');
  const cancelButton = document.querySelector('.option-cancel-button');
  const foodCards = [...document
    .querySelectorAll('.eaten-food-card')];
  const cardButtonsContainers = [...document
    .querySelectorAll('.eaten-food-card-buttons-container')];

  editButton.addEventListener('click', () => {
    foodCards.forEach((card) => {
      const buttonsWidth = cardButtonsContainers[0].offsetWidth;
      card.style.width = `${card.offsetWidth - buttonsWidth - 20}px`;
    });
    cardButtonsContainers.forEach((container) => {
      container.style.visibility = 'visible';
      container.style.right = '0';
    });
    editButton.style.display = 'none';
    cancelButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
    addButton.style.display = 'inline-block';
    addButton.style.marginRight = '0';
  });
  saveButton.addEventListener('click', () => {
    foodCards.forEach((card) => {
      card.style.width = '100%';
    });
    cardButtonsContainers.forEach((container) => {
      container.style.visibility = 'hidden';
      container.style.right = '-100%';
    });
    saveButton.style.display = 'none';
    addButton.style.display = 'none';
    cancelButton.style.display = 'inline-block';
    editButton.style.display = 'inline-block';
  });

  const deleteButtons = [...document
    .querySelectorAll('.eaten-food-card-delete-button')];
  deleteButtons.forEach((button) => {
    const card = button.parentElement.parentElement;
    // const name = card
    //   .querySelector('.eaten-food-card-name').textContent;
    // const brand = card
    //   .querySelector('.eaten-food-card-brand').textContent;
    // const weight = parseInt(card
    // .querySelector('.eaten-food-card-weight').textContent.match(/\d+/), 10);
    let position = 0;
    foodCards.forEach((c, i) => {
      if (c === card) position = i;
    });

    button.addEventListener('click', async (event) => {
      try {
        event.preventDefault();
        if (confirm('Are you shure you want to delete this food?')) {
          await fetch(
            `/api/history?position=${position}`, {
              method: 'DELETE',
              credentials: 'include',
            }
          );
          render();
        }
      } catch (err) {
        alert('Something went wrong. Please, try again later');
      }
    });
  });
  listenToButtons();
};

export default () => {
  addCSS();
  render();
  listenToButtons();
};
