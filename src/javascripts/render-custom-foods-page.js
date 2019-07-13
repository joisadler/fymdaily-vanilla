/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import customFoodsTemplate from '../../views/custom-foods.pug';
import renderHomePage from './render-homepage';
import renderAddFoodPage from './render-add-food-page';
import renderCreateFoodPage from './render-create-food-page';

const renderCustomFoodsPage = async () => {
  const app = document.getElementById('app');
  app.innerHTML = customFoodsTemplate;

  /* eslint-disable no-param-reassign */
  const navigationButtons = [...document
    .querySelectorAll('.navigation-button')];
  navigationButtons.forEach((button, i, buttons) => {
    button.style.width = `${button.offsetHeight}px`;
    if (i === buttons.length - 1) {
      const foodOptionsContainer = document
        .querySelector('.custom-foods-options-container');
      foodOptionsContainer.style.height = `${button.offsetHeight * 0.3}px`;
    }
  });

  const optionButtons = [...document
    .querySelectorAll('.custom-foods-option-button')];
  optionButtons.forEach((button) => {
    button.style.width = `${button.offsetHeight}px`;
  });

  const createCustomFoodCard = (
    name,
    brand,
    calories,
    proteins,
    fats,
    carbs
  ) => {
    const card = document.createElement('div');
    card.classList.add('custom-food-card-wrapper');
    /* eslint-disable max-len */
    card.innerHTML = `
      <div class="custom-foods-card">
        <h2 class="add-food-card-name">${name}${brand ? ', ' : ''}${brand}</h2>
        <p class="add-food-card-info">Calories: ${calories} | Proteins: ${proteins} | Fats: ${fats} | Carbs: ${carbs}</p>
      </div>
      <div class="custom-food-card-buttons-container">
        <button class="custom-food-card-button custom-food-card-edit-button">
        <button class="custom-food-card-button custom-food-card-delete-button">
      </div>
      `;
    return card;
    /* eslint-enable max-len */
  };

  const foodCardsContainer = document.querySelector('.custom-foods-cards');
  const customFoodsResponse = await fetch(
    '/api/food',
    {
      credentials: 'include'
    }
  );
  const customFoods = await customFoodsResponse.json();
  customFoods.forEach((food) => {
    const {
      name,
      brand,
      calories,
      proteins,
      fats,
      carbs,
    } = food;
    foodCardsContainer.appendChild(createCustomFoodCard(
      name,
      brand,
      calories,
      proteins,
      fats,
      carbs,
    ));
    const foodCardsButtons = [...document
      .querySelectorAll('.custom-food-card-button')];
    foodCardsButtons.forEach((button) => {
      button.style.height = '35%';
      button.style.width = `${button.offsetHeight}px`;
    });
  });

  const editButton = document.querySelector('.custom-foods-edit-button');
  const saveButton = document.querySelector('.custom-foods-save-button');
  const addButton = document.querySelector('.custom-foods-add-button');
  const cancelButton = document.querySelector('.custom-foods-cancel-button');

  const foodCards = [...document
    .querySelectorAll('.custom-foods-card')];
  const cardButtonsContainers = [...document
    .querySelectorAll('.custom-food-card-buttons-container')];

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
    saveButton.style.width = `${saveButton.offsetHeight}px`;
    addButton.style.display = 'inline-block';
    addButton.style.width = `${addButton.offsetHeight}px`;
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
    cancelButton.style.width = `${cancelButton.offsetHeight}px`;
    editButton.style.display = 'inline-block';
    editButton.style.width = `${editButton.offsetHeight}px`;
  });

  const deleteButtons = [...document
    .querySelectorAll('.custom-food-card-delete-button')];
  deleteButtons.forEach((button) => {
    const name = button
      .parentElement
      .previousElementSibling
      .firstElementChild
      .textContent
      .split(', ')[0];
    const brand = button
      .parentElement
      .previousElementSibling
      .firstElementChild
      .textContent.split(', ')
      .length > 1 ? button
        .parentElement
        .previousElementSibling
        .firstElementChild
        .textContent.split(', ')[1] : '';
    button.addEventListener('click', async (event) => {
      try {
        event.preventDefault();
        if (confirm('Are you shure you want to delete this food?')) {
          await fetch(`/api/food?name=${name}&brand=${brand}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          renderCustomFoodsPage();
        }
      } catch (err) {
        alert('Something went wrong. Please, try again later');
      }
    });
  });

  cancelButton.addEventListener('click',
    (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/add-food');
      renderAddFoodPage();
    });

  addButton.addEventListener('click',
    (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/create-food');
      renderCreateFoodPage();
    });

  const homeButton = document.querySelector('.custom-foods-page-home-button');
  homeButton.addEventListener('click',
    (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/homepage');
      renderHomePage();
    });
};

export default renderCustomFoodsPage;
