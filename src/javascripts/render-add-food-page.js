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
          // console.log(card.firstElementChild.innerText);
          const createAddThisFoodCard = () => {
            const addThisFoodCard = document.createElement('div');
            addThisFoodCard.classList.add('add-this-food-card');
            card.parentNode.insertBefore(addThisFoodCard, card.nextSibling);
            /* eslint-disable max-len */
            addThisFoodCard.innerHTML = `
            <span class='add-this-food-card-text'>Weight:</span>
            <input class='add-this-food-card-weight', type='number', step='50'>
            <span class='add-this-food-card-text'>gr</span>
            <button class='add-this-food-card-button add-this-food-card-add-button'></button>
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
            // addThisFoodCardWeight.focus();
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
