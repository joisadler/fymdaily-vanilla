import debounce from 'lodash/debounce';
import addFoodTemplate from '../../views/add-food.pug';
import renderHomePage from './render-homepage';
import addListenerMulti from './add-listener-multi';

export default () => {
  const app = document.getElementById('app');
  app.innerHTML = addFoodTemplate;

  /* eslint-disable no-param-reassign */
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
    calories,
    proteins,
    fats,
    carbs
  ) => {
    const card = document.createElement('div');
    card.classList.add('add-food-card');
    /* eslint-disable max-len */
    card.innerHTML = `
      <h2 class="add-food-card-name">${name}</h2>
      <p class="add-food-card-info">Calories: ${calories} | Proteins: ${proteins} | Fats: ${fats} | Carbs: ${carbs}</p>`;
    return card;
    /* eslint-enable max-len */
  };

  const foodCardsContainer = document.querySelector('.add-food-cards');

  addListenerMulti(searchBar, 'input search', debounce(() => {
    foodCardsContainer.innerHTML = '';
    // eslint-disable-next-line max-len
    fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchBar.value}&search_simple=1&action=process&json=1`, {
      method: 'GET',
    }).then((response) => {
      response.json().then((data) => {
        const products = [...data.products];
        // console.log(products[7].nutriments)
        products.forEach((product) => {
          const name = product.product_name;
          const calories = product.nutriments.energy_unit === 'kJ'
            ? Math.round(product.nutriments.energy_value / 4.178)
            : product.nutriments.energy_value;
          const proteins = product.nutriments.proteins_100g;
          const fats = product.nutriments.fat_100g;
          const carbs = product.nutriments.carbohydrates_100g;
          if (
            name !== ' '
            && name !== ''
            && name !== undefined
            && calories !== undefined
            && proteins !== undefined
            && fats !== undefined
            && carbs !== undefined
          ) {
            foodCardsContainer.appendChild(createAddFoodCard(
              name,
              calories,
              proteins,
              fats,
              carbs
            ));
          }
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
          console.log(card.firstElementChild.innerText);
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
};
