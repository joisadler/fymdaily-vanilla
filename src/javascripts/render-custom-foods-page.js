/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import customFoodsTemplate from '../../views/custom-foods.pug';
import customFoodCardTemplate from '../../views/custom-food-card.pug';
import addCSS from './load-css';
import listenToButtons from './listen-to-buttons';

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
  card.innerHTML = customFoodCardTemplate({
    name,
    brand,
    calories,
    proteins,
    fats,
    carbs,
  });
  return card;
};

const render = async () => {
  const app = document.getElementById('app');
  app.innerHTML = customFoodsTemplate({ path: 'custom-foods' });

  const foodCardsContainer = document.querySelector('.food-cards');
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
    // const foodCardsButtons = [...document
    //   .querySelectorAll('.custom-food-card-button')];
    // foodCardsButtons.forEach((button) => {
    //   button.style.height = '35%';
    //   button.style.width = `${button.offsetHeight}px`;
    // });
  });

  const editButton = document.querySelector('.option-edit-button');
  const saveButton = document.querySelector('.option-save-button');
  const createButton = document.querySelector('.option-create-button');
  const cancelButton = document.querySelector('.option-cancel-button');

  const foodCards = [...document
    .querySelectorAll('.custom-food-card')];
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
    createButton.style.display = 'inline-block';
    createButton.style.width = `${createButton.offsetHeight}px`;
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
    createButton.style.display = 'none';
    cancelButton.style.display = 'inline-block';
    cancelButton.style.width = `${cancelButton.offsetHeight}px`;
    editButton.style.display = 'inline-block';
    editButton.style.width = `${editButton.offsetHeight}px`;
  });

  const deleteButtons = [...document
    .querySelectorAll('.custom-food-card-delete-button')];
  deleteButtons.forEach((button) => {
    const name = button.parentElement.parentElement
      .querySelector('.custom-food-card-name').textContent;
    // const name = button
    //   .parentElement
    //   .previousElementSibling
    //   .firstElementChild
    //   .textContent
    //   .split(', ')[0];
    // const brand = button
    //   .parentElement
    //   .previousElementSibling
    //   .firstElementChild
    //   .textContent.split(', ')
    //   .length > 1 ? button
    //     .parentElement
    //     .previousElementSibling
    //     .firstElementChild
    //     .textContent.split(', ')[1] : '';
    const brand = button.parentElement.parentElement
      .querySelector('.custom-food-card-brand').textContent;

    button.addEventListener('click', async (event) => {
      try {
        event.preventDefault();
        if (confirm('Are you shure you want to delete this food?')) {
          await fetch(`/api/food?name=${name}&brand=${brand}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          render();
        }
      } catch (err) {
        alert('Something went wrong. Please, try again later');
      }
    });
  });

  // cancelButton.addEventListener('click',
  //   (e) => {
  //     e.preventDefault();
  //     window.history.pushState(null, null, '/add-food');
  //     renderAddFoodPage();
  //   });

  // createButton.addEventListener('click',
  //   (e) => {
  //     e.preventDefault();
  //     window.history.pushState(null, null, '/create-food');
  //     renderCreateFoodPage();
  //   });

  // const homeButton = document.querySelector('.home-button');
  // homeButton.addEventListener('click',
  //   (e) => {
  //     e.preventDefault();
  //     window.history.pushState(null, null, '/homepage');
  //     renderHomePage();
  //   });
};

export default () => {
  addCSS();
  render();
  listenToButtons();
};
