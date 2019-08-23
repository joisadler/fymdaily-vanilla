/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
import round from 'lodash/round';
import eatenFoodsTemplate from '../../views/eaten-foods.pug';
import eatenFoodCardTemplate from '../../views/eaten-food-card.pug';
import totalEatenFoodCardTemplate from '../../views/total-eaten-food-card.pug';
import addCSS from './load-css';
import listenToButtons from './listen-to-buttons';

const getUsersHistory = async () => {
  const today = new Date().toLocaleDateString('ru-RU');
  const data = await fetch(`/api/history?today=${today}`, {
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
  carbs,
  index,
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
    index,
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
  products.forEach((product, index) => {
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
      round(calories * weight / 100, 1),
      round(proteins * weight / 100, 1),
      round(fats * weight / 100, 1),
      round(carbs * weight / 100, 1),
      index,
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
    round(totalCalories, 1),
    round(totalProteins, 1),
    round(totalFats, 1),
    round(totalCarbs, 1),
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
    let position = 0;
    foodCards.forEach((c, i) => {
      if (c === card) position = i;
    });
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const today = new Date().toLocaleDateString('ru-RU');
      try {
        if (confirm('Are you shure you want to delete this food?')) {
          await fetch(
            `/api/history?position=${position}&today=${today}`, {
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


  const editButtons = [...document
    .querySelectorAll('.eaten-food-card-edit-button')];
  editButtons.forEach((cardEditButton) => {
    const card = cardEditButton.parentElement.parentElement;
    let position = 0;
    foodCards.forEach((c, i) => {
      if (c === card) position = i;
    });
    cardEditButton.addEventListener('click', (event) => {
      event.preventDefault();
      const weightSpan = card.querySelector('.eaten-food-card-weight');
      const weightInputForm = card
        .querySelector('.eaten-food-card-weight-input-form');
      const weightInput = card.querySelector('.eaten-food-card-weight-input');
      const cardSubmitButton = card
        .querySelector('.eaten-food-card-submit-button');
      const oldWeight = weightSpan.textContent.match(/\d+\.?\d*/)[0];

      cardEditButton.style.display = 'none';
      cardSubmitButton.style.display = 'inline-block';
      weightInputForm.style.display = 'flex';
      weightInput.value = `${oldWeight}`;
      weightInput.focus();
      weightSpan.style.display = 'none';

      weightInputForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newWeight = weightInput.value;
        const today = new Date().toLocaleDateString('ru-RU');
        try {
          await fetch(
            `/api/history?position=${position}&weight=${newWeight}&today=${today}`, {
              method: 'PUT',
              credentials: 'include',
            }
          );
          render();
        } catch (err) {
          alert('Something went wrong. Please, try again later');
        }
      });

      saveButton.addEventListener('click', () => {
        cardEditButton.style.display = 'inline-block';
        cardSubmitButton.style.display = 'none';
        weightInputForm.style.display = 'none';
        weightSpan.style.display = 'inline';
        weightSpan.textContent = `  | ${oldWeight}gr`;
        weightSpan.style.display = 'inline';
        cardEditButton.style.display = 'inline-block';
      });
    });
  });
  listenToButtons();
};

export default async () => {
  addCSS();
  await render();
  listenToButtons();
};
