/* eslint-disable no-param-reassign */
import calculateMacros from './calculations';
import homepageTemplate from '../../views/homepage.pug';
import renderEatenFoodsPage from './render-eaten-foods-page';
import renderAddFoodPage from './render-add-food-page';
import addCss from './add-css';

const render = () => {
  const app = document.getElementById('app');
  app.innerHTML = homepageTemplate;

  const caloriesChart = document.querySelector('.calories-chart');
  const caloriesChartContent = document
    .querySelector('.calories-chart-content');
  const caloriesHeadline = document.querySelector('.calories-headline');
  const caloriesNumber = document.querySelector('.calories-number');
  const alternativeCaloriesChartContent = document
    .querySelector('.alternative-calories-chart-content');
  const alternativeCaloriesChartContentNumber = document
    .querySelector('.alternative-calories-chart-content-number');
  const alternativeCaloriesChartContentPercent = document
    .querySelector('.alternative-calories-chart-content-percent');
  const proteinsProgressBarInner = document
    .querySelector('.proteins-progress-bar-inner');
  const fatsProgressBarInner = document
    .querySelector('.fats-progress-bar-inner');
  const carbsProgressBarInner = document
    .querySelector('.carbs-progress-bar-inner');
  const proteinsPercentContainer = document
    .querySelector('.proteins-percent-container');
  const fatsPercentContainer = document
    .querySelector('.fats-percent-container');
  const carbsPercentContainer = document
    .querySelector('.carbs-percent-container');

  fetch('/user', {
    method: 'GET',
    credentials: 'include',
  }).then((response) => {
    response.json().then((data) => {
      const user = data;
      const {
        bodyWeight,
        height,
        gender,
        waistCircumference,
        neckCircumference,
        hipCircumference,
        physicalActivityLevel,
        goal
      } = user;

      // const bodyWeight = 122;
      // const height = 180;
      // const gender = 'male';
      // const waistCircumference = 125;
      // const neckCircumference = 45;
      // const hipCircumference = 0;
      // const physicalActivityLevel = 'moderate';
      // const goal = 'normalWeightLoss';

      const macros = calculateMacros(
        bodyWeight,
        height,
        gender,
        waistCircumference,
        neckCircumference,
        hipCircumference,
        physicalActivityLevel,
        goal
      );
      const dailyCaloriesNeed = Math.round(macros.dailyCaloriesNeed);
      const dailyProteinsNeed = Math.round(macros.dailyProteinsNeed);
      const dailyFatsNeed = Math.round(macros.dailyFatsNeed);
      const dailyCarbsNeed = Math.round(macros.dailyCarbsNeed);
      let currentCalories = 0;
      let currentProteins = 0;
      let currentFats = 0;
      let currentCarbs = 0;

      fetch('/api/history', {
        method: 'GET',
        credentials: 'include',
      }).then((res) => {
        res.json().then((history) => {
          history.products.forEach((product) => {
            currentCalories
              += Math.round(product.calories * product.weight * 0.01);
            currentProteins
              += Math.round(product.proteins * product.weight * 0.01);
            currentFats
              += Math.round(product.fats * product.weight * 0.01);
            currentCarbs
              += Math.round(product.carbs * product.weight * 0.01);
          });

          /* eslint-disable max-len */
          let currentCaloriesRemainder = dailyCaloriesNeed - currentCalories;
          const currentPercentOfDailyCaloriesNeed = Math.round(currentCalories / dailyCaloriesNeed * 100);
          const currentPercentOfDailyProteinsNeed = Math.round(currentProteins / dailyProteinsNeed * 100);
          const currentPercentOfDailyFatsNeed = Math.round(currentFats / dailyFatsNeed * 100);
          const currentPercentOfDailyCarbsNeed = Math.round(currentCarbs / dailyCarbsNeed * 100);
          /* eslint-disable max-len */
          const caloriesPerGramOfProtein = 4.1;
          const caloriesPerGramOfFat = 9.3;
          const caloriesPerGramOfCarb = 4.1;
          const currentProteinsToCalories = currentProteins * caloriesPerGramOfProtein;
          const currentFatsToCalories = currentFats * caloriesPerGramOfFat;
          const currentCarbsToCalories = currentCarbs * caloriesPerGramOfCarb;
          const percentageOfProteinsInDailyCaloriesNeed = (currentProteinsToCalories / dailyCaloriesNeed) * 100;
          const percentageOfFatsInDailyCaloriesNeed = (currentFatsToCalories / dailyCaloriesNeed) * 100;
          const percentageOfCarbsInDailyCaloriesNeed = (currentCarbsToCalories / dailyCaloriesNeed) * 100;
          const percentageOfEmptyCaloriesInDailyCaloriesNeed = (((currentCalories - (currentProteinsToCalories + currentFatsToCalories + currentCarbsToCalories)) / dailyCaloriesNeed) * 100) > 0
            ? (((currentCalories - (currentProteinsToCalories + currentFatsToCalories + currentCarbsToCalories)) / dailyCaloriesNeed) * 100)
            : 0;
          const caloriesChartDataset = [
            {
              value: percentageOfProteinsInDailyCaloriesNeed,
              color: '#109618'
            }, {
              value: percentageOfFatsInDailyCaloriesNeed,
              color: '#ff9900'
            }, {
              value: percentageOfCarbsInDailyCaloriesNeed,
              color: '#990099'
            }, {
              value: percentageOfEmptyCaloriesInDailyCaloriesNeed,
              color: '#fff'
            }
          ];

          const maxValue = 25;
          const addSector = (Data, startAngle, collapse) => {
            const sectorDeg = 3.6 * Data.value;
            let skewDeg = 90 + sectorDeg;
            const rotateDeg = startAngle;
            if (collapse) {
              skewDeg += 1;
            }
            const sector = document.createElement('div');
            sector.classList.add('calories-chart-sector');
            sector.style.background = Data.color;
            sector.style.transform = `rotate(${rotateDeg}deg) skewY(${skewDeg}deg)`;
            // sector.style.visibility = 'hidden';
            caloriesChart.append(sector);
            return startAngle + sectorDeg;
          };

          caloriesChartDataset.reduce((prev, curr) => {
            const addPart = (Data, angle) => {
              if (Data.value <= maxValue) {
                return addSector(Data, angle, false);
              }
              return addPart({
                value: Data.value - maxValue,
                color: Data.color
              }, addSector({
                value: maxValue,
                color: Data.color,
              }, angle, true));
            };
            return addPart(curr, prev);
          }, 0);

          const caloriesChartSectors = [...document.querySelectorAll('.calories-chart-sector')];
          let i = 0;
          const caloriesChartSectorsLoop = () => {
            const sector = caloriesChartSectors[i];
            setTimeout(() => {
              sector.style.visibility = 'visible';
              i += 1;
              if (i < caloriesChartSectors.length) caloriesChartSectorsLoop();
            }, currentCalories / 10);
          };
          caloriesChartSectorsLoop();

          const rgb2hex = (rgb) => {
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
              return `0${parseInt(x, 10).toString(16)}`.slice(-2);
            }
            return `#${hex(rgb[1])}${hex(rgb[2])}${hex(rgb[3])}`;
          };

          caloriesChartSectors.forEach((sector) => {
            let titleText = '';
            if (rgb2hex(sector.style.backgroundColor) === '#109618') {
              titleText = `Proportion of calories derived from proteins in a total amount of calories (${Math.round(percentageOfProteinsInDailyCaloriesNeed)}%)`;
            } else if (rgb2hex(sector.style.backgroundColor) === '#ff9900') {
              titleText = `Proportion of calories derived from fats in a total amount of calories (${Math.round(percentageOfFatsInDailyCaloriesNeed)}%)`;
            } else if (rgb2hex(sector.style.backgroundColor) === '#990099') {
              titleText = `Proportion of calories derived from carbs in a total amount of calories (${Math.round(percentageOfCarbsInDailyCaloriesNeed)}%)`;
            } else {
              titleText = `Empty calories (${Math.round(percentageOfEmptyCaloriesInDailyCaloriesNeed)}%)`;
            }
            sector.setAttribute('title', titleText);
          });

          let j = 0;
          const caloriesRemainderLoop = () => {
            setTimeout(() => {
              caloriesNumber.innerText = `${j}`;
              j += 50;
              if (j < currentCaloriesRemainder) caloriesRemainderLoop();
              if (currentCaloriesRemainder - j <= currentCaloriesRemainder % 50) {
                caloriesNumber.innerText = `${currentCaloriesRemainder}`;
              }
            }, 20);
          };
          if (currentCaloriesRemainder >= 0) {
            //caloriesNumber.innerText = `${currentCaloriesRemainder}`;
            caloriesRemainderLoop();
          } else {
            caloriesChartContent.style.backgroundColor = '#ff6666';
            alternativeCaloriesChartContent.style.backgroundColor = '#ff6666';
            caloriesHeadline.innerText = 'today you have consumed';
            currentCaloriesRemainder = Math.abs(currentCaloriesRemainder);
            caloriesNumber.innerText = `${currentCaloriesRemainder}`;
            caloriesRemainderLoop();
            //caloriesSubheadline.innerText = 'calories more than your daily need';
          }
          alternativeCaloriesChartContentNumber.innerText = `${currentCalories}/${dailyCaloriesNeed}`;
          alternativeCaloriesChartContentPercent.innerText = `${currentPercentOfDailyCaloriesNeed}%`;

          proteinsProgressBarInner.style.width = currentPercentOfDailyProteinsNeed > 100
            ? '100%' : `${currentPercentOfDailyProteinsNeed}%`;
          fatsProgressBarInner.style.width = currentPercentOfDailyFatsNeed > 100
            ? '100%' : `${currentPercentOfDailyFatsNeed}%`;
          carbsProgressBarInner.style.width = currentPercentOfDailyCarbsNeed > 100
            ? '100%' : `${currentPercentOfDailyCarbsNeed}%`;

          proteinsPercentContainer.innerText = `${currentPercentOfDailyProteinsNeed}%`;
          fatsPercentContainer.innerText = `${currentPercentOfDailyFatsNeed}%`;
          carbsPercentContainer.innerText = `${currentPercentOfDailyCarbsNeed}%`;
        })
          .catch(error => console.error(error));
      });
    });
  });

  caloriesChart.addEventListener('click', () => {
    if (caloriesChartContent.style.display === 'flex') {
      alternativeCaloriesChartContent.style.display = 'flex';
      caloriesChartContent.style.display = 'none';
    } else {
      caloriesChartContent.style.display = 'flex';
      alternativeCaloriesChartContent.style.display = 'none';
    }
  });

  const eatenFoodsButton = document.querySelector('.eaten-foods-button');
  eatenFoodsButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.pushState(null, null, '/eaten-foods');
    renderEatenFoodsPage();
  });

  const addFoodButton = document.querySelector('.add-food-button');
  addFoodButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.pushState(null, null, '/add-food');
    renderAddFoodPage();
  });
};

export default () => {
  addCss();
  render();
};
