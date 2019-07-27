/* eslint-disable no-param-reassign */
import debounce from 'lodash/debounce';
import addFoodTemplate from '../../views/add-food.pug';
import addFoodCardTemplate from '../../views/add-food-card.pug';
import addThisFoodCardTemplate from '../../views/add-this-food-card.pug';
import listenToButtons from './listen-to-buttons';
import renderHomePage from './render-homepage';
import addListenerMulti from './add-listener-multi';
import addCSS from './load-css';

const language = document.documentElement.lang.split('_')[0];
const region = document.documentElement.lang.split('_')[1];

const render = () => {
  const app = document.getElementById('app');
  app.innerHTML = addFoodTemplate({ path: 'add-food' });

  const searchButton = document.querySelector('.option-search-button');
  const searchBar = document.querySelector('.add-food-search-bar');
  const pageHeader = document.querySelector('.page-header');
  searchButton.addEventListener('click', () => {
    searchButton.style.width = '0';
    pageHeader.style.display = 'none';
    searchBar.style.display = 'block';
    searchBar.style.flex = '1';
    searchBar.focus();
  });

  const createAddFoodCard = (
    name,
    brand,
    calories,
    proteins,
    fats,
    carbs
  ) => {
    const card = document.createElement('div');
    card.classList.add('add-food-card');
    card.innerHTML = addFoodCardTemplate({
      name,
      brand,
      calories,
      proteins,
      fats,
      carbs
    });
    return card;
  };

  const foodCardsContainer = document.querySelector('.food-cards');

  addListenerMulti(searchBar, 'focus input search', debounce(async () => {
    foodCardsContainer.innerHTML = '';
    const customFoodsResponse = await fetch(
      '/api/food',
      { credentials: 'include' },
    );
    const customFoods = await customFoodsResponse.json();
    customFoods
      .filter(food => food
        .name
        .substring(0, searchBar.value.length)
        .toLowerCase() === searchBar.value.toLowerCase())
      .forEach((food) => {
        const {
          name,
          brand,
          calories,
          proteins,
          fats,
          carbs,
        } = food;
        foodCardsContainer.appendChild(createAddFoodCard(
          name,
          brand,
          calories,
          proteins,
          fats,
          carbs,
        ));
      });
    // eslint-disable-next-line max-len
    await fetch(`/api/fatsecret?search_expression=${searchBar.value}&language=${language}&region=${region}`)
      .then((response) => {
        response.json().then((data) => {
          const products = Object.entries(data);
          products.forEach((product) => {
            const {
              name,
              brand,
              calories,
              proteins,
              fats,
              carbs,
            } = product[1];
            foodCardsContainer.appendChild(createAddFoodCard(
              name,
              brand,
              Math.round(calories),
              Math.round(proteins),
              Math.round(fats),
              Math.round(carbs)
            ));
          });
        });
      });
  }, 500));

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      const addFoodCards = document.querySelectorAll('.add-food-card');
      addFoodCards.forEach((card) => {
        card.addEventListener('click', (e) => {
          e.stopImmediatePropagation();
          const createAddThisFoodCard = () => {
            const addThisFoodCard = document.createElement('form');
            addThisFoodCard.classList.add('add-this-food-card');
            addThisFoodCard.setAttribute('action', '#');
            card.parentNode.insertBefore(addThisFoodCard, card.nextSibling);
            addThisFoodCard.innerHTML = addThisFoodCardTemplate();
            card.parentNode.insertBefore(addThisFoodCard, card.nextSibling);
          };
          const addThisFoodCards = document
            .querySelectorAll('.add-this-food-card');
          if (!card.classList.contains('checked')) {
            card.classList.add('checked');
            if (addThisFoodCards.length > 0) {
              addThisFoodCards[0]
                .previousElementSibling.classList.remove('checked');
              addThisFoodCards[0].remove();
            }
            createAddThisFoodCard();
          } else {
            card.classList.remove('checked');
            addThisFoodCards[0].remove();
          }
          const cancelButton = document
            .querySelector('.add-this-food-card-cancel-button');
          cancelButton.addEventListener('click', () => {
            card.classList.remove('checked');
            card.parentNode.removeChild(card.nextSibling);
          });
          const addThisFoodCard = document.querySelector('.add-this-food-card');
          const weightField = document
            .querySelector('.add-this-food-card-weight');
          const addFoodToDatabase = () => {
            const cardNutrimentsValues = card
              .firstElementChild
              .nextElementSibling
              .textContent.match(/[+-]?\d+(?:\.\d+)?/g).map(Number);
            const getName = () => card
              .querySelector('.add-food-card-name').textContent;
            const getBrand = () => card
              .querySelector('.add-food-card-brand').textContent;
            const cardData = {
              name: getName(),
              brand: getBrand(),
              weight: weightField.value,
              calories: cardNutrimentsValues[0],
              proteins: cardNutrimentsValues[1],
              fats: cardNutrimentsValues[2],
              carbs: cardNutrimentsValues[3],
            };
            fetch('/api/history', {
              credentials: 'include',
              method: 'POST',
              body: JSON.stringify(cardData),
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              }
            })
              .then(() => console.log('updated!!!'))
              .catch(error => console.error(error));
          };
          addThisFoodCard.addEventListener('submit', (event) => {
            event.preventDefault();
            addFoodToDatabase();
            window.history.pushState(null, null, '/homepage');
            renderHomePage();
          });
        });
      });
    });
  });
  observer.observe(foodCardsContainer, { childList: true });
};

export default () => {
  addCSS();
  render();
  listenToButtons();
};
