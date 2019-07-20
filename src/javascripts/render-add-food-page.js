/* eslint-disable no-param-reassign */
import { loadCSS } from 'fg-loadcss';
import debounce from 'lodash/debounce';
import addFoodTemplate from '../../views/add-food.pug';
import renderHomePage from './render-homepage';
import renderCreateFoodPage from './render-create-food-page';
import addListenerMulti from './add-listener-multi';

const cssUrl = `${window.location.pathname}.css`;
const language = document.documentElement.lang.split('_')[0];
const region = document.documentElement.lang.split('_')[1];

const render = () => {
  const app = document.getElementById('app');
  app.innerHTML = addFoodTemplate;

  const navigationButtons = [...document
    .querySelectorAll('.navigation-button')];
  navigationButtons.forEach((button, i, buttons) => {
    button.style.width = `${button.offsetHeight}px`;
    if (i === buttons.length - 1) {
      const foodOptionsContainer = document
        .querySelector('.add-food-options-container');
      foodOptionsContainer.style.height = `${button.offsetHeight * 0.3}px`;
    }
  });

  const optionButtons = [...document
    .querySelectorAll('.add-food-option-button')];
  optionButtons.forEach((button) => {
    button.style.width = `${button.offsetHeight}px`;
  });

  const searchButton = document.querySelector('.add-food-search-button');
  const searchBar = document.querySelector('.add-food-search-bar');
  const addFoodHeader = document.querySelector('.add-food-header');
  searchButton.addEventListener('click', () => {
    searchButton.style.width = '0';
    addFoodHeader.style.display = 'none';
    searchBar.style.display = 'block';
    searchBar.style.flex = '1';
    searchBar.focus();
  });
  /* eslint-enable no-param-reassign */

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
    // card.innerHTML = `
    //   <h2 class="add-food-card-name">${name}, ${brand}</h2>
    //   <p class="add-food-card-info">Calories: ${calories} | Proteins: ${proteins} | Fats: ${fats} | Carbs: ${carbs}</p>`;
    /* eslint-disable max-len */
    card.innerHTML = `
      <div class="add-food-card-header">
        <span class="add-food-card-name">${name}</span>, <span class="add-food-card-brand">${brand}</span>
      </div>
      <p class="add-food-card-info">Calories: ${calories} | Proteins: ${proteins} | Fats: ${fats} | Carbs: ${carbs}</p>`;

    return card;
    /* eslint-enable max-len */
  };

  const foodCardsContainer = document.querySelector('.add-food-cards');

  addListenerMulti(searchBar, 'focus input search', debounce(async () => {
    foodCardsContainer.innerHTML = '';
    // eslint-disable-next-line max-len
    // fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchBar.value}&search_simple=1&action=process&json=1`, {
    //   method: 'GET',
    // }).then((response) => {

    // eslint-disable-next-line max-len
    const customFoodsResponse = await fetch('/api/food', { credentials: 'include' });
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


          // const products = [...data.products];
          // //console.log(products[7].nutriments)
          // products.forEach((product) => {
          //   const name = product.product_name;
          //   const calories = product.nutriments.energy_unit === 'kJ'
          //     ? Math.round(product.nutriments.energy_value / 4.178)
          //     : product.nutriments.energy_value;
          //   const proteins = product.nutriments.proteins_100g;
          //   const fats = product.nutriments.fat_100g;
          //   const carbs = product.nutriments.carbohydrates_100g;
          //   if (
          //     name !== ' '
          //     && name !== ''
          //     && name !== undefined
          //     && calories !== undefined
          //     && proteins !== undefined
          //     && fats !== undefined
          //     && carbs !== undefined
          //   ) {
          //     foodCardsContainer.appendChild(createAddFoodCard(
          //       name,
          //       calories,
          //       proteins,
          //       fats,
          //       carbs
          //     ));
          //   }
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
            /* eslint-disable max-len */
            addThisFoodCard.innerHTML = `
              <label for='weight', class='add-this-food-card-text'>Weight:</label>
              <input id='weight', class='add-this-food-card-weight', type='number', step='1', required, autofocus>
              <label for='weight', class='add-this-food-card-text'>gr</label>
              <input type='submit' value='' class='add-this-food-card-button add-this-food-card-add-button'>
              <button class='add-this-food-card-button add-this-food-card-cancel-button'></button>
            `;
            /* eslint-enable max-len */
            const foodOptionsContainer = document
              .querySelector('.add-food-options-container');
            const addThisFoodCardWeight = document
              .querySelector('.add-this-food-card-weight');
            addThisFoodCardWeight
              .style.height = foodOptionsContainer.offsetHeight;
            const addThisFoodCardButtons = document
              .querySelectorAll('.add-this-food-card-button');
            addThisFoodCardButtons.forEach((button) => {
              /* eslint-disable no-param-reassign */
              button.style.height = `${foodOptionsContainer.offsetHeight}px`;
              button.style.width = `${button.offsetHeight}px`;
              /* eslint-enable no-param-reassign */
            });
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

  const homeButton = document.querySelector('.add-food-page-home-button');
  homeButton.addEventListener('click',
    (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/homepage');
      renderHomePage();
    });

  const createFoodButton = document.querySelector('.add-food-create-button');
  createFoodButton.addEventListener('click',
    (e) => {
      e.preventDefault();
      window.history.pushState(null, null, '/create-food');
      renderCreateFoodPage();
    });
};

export default () => {
  loadCSS(cssUrl);
  render();
};
