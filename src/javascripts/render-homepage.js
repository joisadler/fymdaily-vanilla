/* eslint-disable no-param-reassign */
import { loadCSS } from 'fg-loadcss';
import calculateMacros from './calculations';
import homepageTemplate from '../../views/homepage.pug';
import renderEatenFoodsPage from './render-eaten-foods-page';
import renderAddFoodPage from './render-add-food-page';

const cssUrl = `${window.location.pathname}.css`;

const getUsersData = async () => {
  const data = await fetch('/user', {
    method: 'GET',
    credentials: 'include',
  });
  const json = await data.json();
  return json;
};

const getUsersHistory = async () => {
  const data = await fetch('/api/history', {
    method: 'GET',
    credentials: 'include',
  });
  const json = await data.json();
  return json;
};

const getParams = (data, history) => {
  const {
    bodyWeight,
    height,
    gender,
    waistCircumference,
    neckCircumference,
    hipCircumference,
    physicalActivityLevel,
    goal
  } = data;
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

  const currentCaloriesRemainder = dailyCaloriesNeed - currentCalories;
  const currentPercentOfDailyCaloriesNeed = Math.round(currentCalories
    / dailyCaloriesNeed * 100);
  const currentPercentOfDailyProteinsNeed = Math.round(currentProteins
    / dailyProteinsNeed * 100);
  const currentPercentOfDailyFatsNeed = Math.round(currentFats
    / dailyFatsNeed * 100);
  const currentPercentOfDailyCarbsNeed = Math.round(currentCarbs
    / dailyCarbsNeed * 100);
  const caloriesPerGramOfProtein = 4.1;
  const caloriesPerGramOfFat = 9.3;
  const caloriesPerGramOfCarb = 4.1;
  const currentProteinsToCalories = currentProteins * caloriesPerGramOfProtein;
  const currentFatsToCalories = currentFats * caloriesPerGramOfFat;
  const currentCarbsToCalories = currentCarbs * caloriesPerGramOfCarb;
  const percentageOfProteinsInDailyCaloriesNeed = (currentProteinsToCalories
    / dailyCaloriesNeed) * 100;
  const percentageOfFatsInDailyCaloriesNeed = (currentFatsToCalories
    / dailyCaloriesNeed) * 100;
  const percentageOfCarbsInDailyCaloriesNeed = (currentCarbsToCalories
    / dailyCaloriesNeed) * 100;
  const percentageOfEmptyCaloriesInDailyCaloriesNeed = (((currentCalories
    - (currentProteinsToCalories
      + currentFatsToCalories
      + currentCarbsToCalories))
      / dailyCaloriesNeed) * 100) > 0
    ? (((currentCalories
      - (currentProteinsToCalories
        + currentFatsToCalories
        + currentCarbsToCalories))
        / dailyCaloriesNeed) * 100)
    : 0;
  return {
    dailyCaloriesNeed,
    dailyProteinsNeed,
    dailyFatsNeed,
    dailyCarbsNeed,
    currentCalories,
    currentProteins,
    currentFats,
    currentCarbs,
    currentCaloriesRemainder,
    currentPercentOfDailyCaloriesNeed,
    currentPercentOfDailyProteinsNeed,
    currentPercentOfDailyFatsNeed,
    currentPercentOfDailyCarbsNeed,
    percentageOfProteinsInDailyCaloriesNeed,
    percentageOfFatsInDailyCaloriesNeed,
    percentageOfCarbsInDailyCaloriesNeed,
    percentageOfEmptyCaloriesInDailyCaloriesNeed,
  };
};

const getElements = () => {
  const caloriesChart = document.querySelector('.calories-chart');
  const caloriesChartContent = document
    .querySelector('.calories-chart-content');
  const caloriesHeadline = document.querySelector('.calories-headline');
  const caloriesSubheadline = document.querySelector('.calories-subheadline');
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
  const eatenFoodsButton = document.querySelector('.eaten-foods-button');
  const addFoodButton = document.querySelector('.add-food-button');
  return {
    caloriesChart,
    caloriesChartContent,
    caloriesHeadline,
    caloriesSubheadline,
    caloriesNumber,
    alternativeCaloriesChartContent,
    alternativeCaloriesChartContentNumber,
    alternativeCaloriesChartContentPercent,
    proteinsProgressBarInner,
    fatsProgressBarInner,
    carbsProgressBarInner,
    proteinsPercentContainer,
    fatsPercentContainer,
    carbsPercentContainer,
    eatenFoodsButton,
    addFoodButton
  };
};

const rgb2hex = (rgb) => {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return `0${parseInt(x, 10).toString(16)}`.slice(-2);
  }
  return `#${hex(rgb[1])}${hex(rgb[2])}${hex(rgb[3])}`;
};

const caloriesRemainderLoop = (caloriesNumber, currentCaloriesRemainder) => {
  let j = 0;
  const loop = () => {
    setTimeout(() => {
      caloriesNumber.innerText = `${j}`;
      j += 100;
      if (j < currentCaloriesRemainder) loop();
      if (currentCaloriesRemainder - j <= currentCaloriesRemainder % 100) {
        caloriesNumber.innerText = `${currentCaloriesRemainder}`;
      }
    }, currentCaloriesRemainder / 100);
  };
  loop();
};

const renderCaloriesChartSectors = (
  percentageOfProteinsInDailyCaloriesNeed,
  percentageOfFatsInDailyCaloriesNeed,
  percentageOfCarbsInDailyCaloriesNeed,
  percentageOfEmptyCaloriesInDailyCaloriesNeed,
  caloriesChart
) => {
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
    sector.style.transform = `rotate(0deg) skewY(${skewDeg}deg)`;
    setTimeout(() => {
      sector.style.transform = `rotate(${rotateDeg}deg) skewY(${skewDeg}deg)`;
    }, 1000 / (360 / rotateDeg));
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

  const caloriesChartSectors = [...document
    .querySelectorAll('.calories-chart-sector')];
  caloriesChartSectors.forEach((sector) => {
    let titleText = '';
    if (rgb2hex(sector.style.backgroundColor) === '#109618') {
    /* eslint-disable max-len */
      titleText = `Proportion of calories derived from proteins in a total amount of calories (${Math.round(percentageOfProteinsInDailyCaloriesNeed)}%)`;
    } else if (rgb2hex(sector.style.backgroundColor) === '#ff9900') {
      titleText = `Proportion of calories derived from fats in a total amount of calories (${Math.round(percentageOfFatsInDailyCaloriesNeed)}%)`;
    } else if (rgb2hex(sector.style.backgroundColor) === '#990099') {
      titleText = `Proportion of calories derived from carbs in a total amount of calories (${Math.round(percentageOfCarbsInDailyCaloriesNeed)}%)`;
    } else {
      titleText = `Empty calories (${Math.round(percentageOfEmptyCaloriesInDailyCaloriesNeed)}%)`;
    /* eslint-enable max-len */
    }
    sector.setAttribute('title', titleText);
  });
};

const renderCaloriesChartContent = (
  caloriesChart,
  currentCaloriesRemainder,
  caloriesNumber,
  caloriesChartContent,
  alternativeCaloriesChartContent,
  caloriesHeadline,
  caloriesSubheadline,
  alternativeCaloriesChartContentNumber,
  alternativeCaloriesChartContentPercent,
  currentCalories,
  dailyCaloriesNeed,
  currentPercentOfDailyCaloriesNeed
) => {
  if (currentCaloriesRemainder >= 0) {
    caloriesRemainderLoop(caloriesNumber, currentCaloriesRemainder);
  } else {
    caloriesChartContent.style.backgroundColor = '#ff6666';
    alternativeCaloriesChartContent.style.backgroundColor = '#ff6666';
    caloriesHeadline.innerText = 'today you have consumed';
    currentCaloriesRemainder = Math.abs(currentCaloriesRemainder);
    caloriesRemainderLoop(caloriesNumber, currentCaloriesRemainder);
    caloriesSubheadline.innerText = 'calories more than your daily need';
  }
  alternativeCaloriesChartContentNumber
    .innerText = `${currentCalories}/${dailyCaloriesNeed}`;
  alternativeCaloriesChartContentPercent
    .innerText = `${currentPercentOfDailyCaloriesNeed}%`;

  caloriesChart.addEventListener('click', () => {
    if (caloriesChartContent.style.display === 'flex') {
      alternativeCaloriesChartContent.style.display = 'flex';
      caloriesChartContent.style.display = 'none';
    } else {
      caloriesChartContent.style.display = 'flex';
      alternativeCaloriesChartContent.style.display = 'none';
    }
  });
};

const renderMacrosProgressBars = (
  proteinsProgressBarInner,
  fatsProgressBarInner,
  carbsProgressBarInner,
  proteinsPercentContainer,
  fatsPercentContainer,
  carbsPercentContainer,
  currentPercentOfDailyProteinsNeed,
  currentPercentOfDailyFatsNeed,
  currentPercentOfDailyCarbsNeed,
) => {
  proteinsProgressBarInner.style.width = currentPercentOfDailyProteinsNeed > 100
    ? '100%' : `${currentPercentOfDailyProteinsNeed}%`;
  fatsProgressBarInner.style.width = currentPercentOfDailyFatsNeed > 100
    ? '100%' : `${currentPercentOfDailyFatsNeed}%`;
  carbsProgressBarInner.style.width = currentPercentOfDailyCarbsNeed > 100
    ? '100%' : `${currentPercentOfDailyCarbsNeed}%`;

  proteinsPercentContainer.innerText = `${currentPercentOfDailyProteinsNeed}%`;
  fatsPercentContainer.innerText = `${currentPercentOfDailyFatsNeed}%`;
  carbsPercentContainer.innerText = `${currentPercentOfDailyCarbsNeed}%`;
};

const listenToButtons = (
  eatenFoodsButton,
  addFoodButton
) => {
  eatenFoodsButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.pushState(null, null, '/eaten-foods');
    renderEatenFoodsPage();
  });
  addFoodButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.pushState(null, null, '/add-food');
    renderAddFoodPage();
  });
};

// const render = () => {
//   const app = document.getElementById('app');
//   app.innerHTML = homepageTemplate;
//   const caloriesChart = document.querySelector('.calories-chart');
//   const caloriesChartContent = document
//     .querySelector('.calories-chart-content');
//   const caloriesHeadline = document.querySelector('.calories-headline');
//   const caloriesSubheadline = document.querySelector('.calories-subheadline');
//   const caloriesNumber = document.querySelector('.calories-number');
//   const alternativeCaloriesChartContent = document
//     .querySelector('.alternative-calories-chart-content');
//   const alternativeCaloriesChartContentNumber = document
//     .querySelector('.alternative-calories-chart-content-number');
//   const alternativeCaloriesChartContentPercent = document
//     .querySelector('.alternative-calories-chart-content-percent');
//   const proteinsProgressBarInner = document
//     .querySelector('.proteins-progress-bar-inner');
//   const fatsProgressBarInner = document
//     .querySelector('.fats-progress-bar-inner');
//   const carbsProgressBarInner = document
//     .querySelector('.carbs-progress-bar-inner');
//   const proteinsPercentContainer = document
//     .querySelector('.proteins-percent-container');
//   const fatsPercentContainer = document
//     .querySelector('.fats-percent-container');
//   const carbsPercentContainer = document
//     .querySelector('.carbs-percent-container');
//   const eatenFoodsButton = document.querySelector('.eaten-foods-button');
//   const addFoodButton = document.querySelector('.add-food-button');

//   fetch('/user', {
//     method: 'GET',
//     credentials: 'include',
//   }).then((response) => {
//     response.json().then((data) => {
//       const user = data;
//       const {
//         bodyWeight,
//         height,
//         gender,
//         waistCircumference,
//         neckCircumference,
//         hipCircumference,
//         physicalActivityLevel,
//         goal
//       } = user;

//       // const bodyWeight = 122;
//       // const height = 180;
//       // const gender = 'male';
//       // const waistCircumference = 125;
//       // const neckCircumference = 45;
//       // const hipCircumference = 0;
//       // const physicalActivityLevel = 'moderate';
//       // const goal = 'normalWeightLoss';

//       const macros = calculateMacros(
//         bodyWeight,
//         height,
//         gender,
//         waistCircumference,
//         neckCircumference,
//         hipCircumference,
//         physicalActivityLevel,
//         goal
//       );
//       const dailyCaloriesNeed = Math.round(macros.dailyCaloriesNeed);
//       const dailyProteinsNeed = Math.round(macros.dailyProteinsNeed);
//       const dailyFatsNeed = Math.round(macros.dailyFatsNeed);
//       const dailyCarbsNeed = Math.round(macros.dailyCarbsNeed);
//       let currentCalories = 0;
//       let currentProteins = 0;
//       let currentFats = 0;
//       let currentCarbs = 0;

//       fetch('/api/history', {
//         method: 'GET',
//         credentials: 'include',
//       }).then((res) => {
//         res.json().then((history) => {
//           history.products.forEach((product) => {
//             currentCalories
//               += Math.round(product.calories * product.weight * 0.01);
//             currentProteins
//               += Math.round(product.proteins * product.weight * 0.01);
//             currentFats
//               += Math.round(product.fats * product.weight * 0.01);
//             currentCarbs
//               += Math.round(product.carbs * product.weight * 0.01);
//           });

//           /* eslint-disable max-len */
//           const currentCaloriesRemainder = dailyCaloriesNeed - currentCalories;
//           const currentPercentOfDailyCaloriesNeed = Math.round(currentCalories / dailyCaloriesNeed * 100);
//           const currentPercentOfDailyProteinsNeed = Math.round(currentProteins / dailyProteinsNeed * 100);
//           const currentPercentOfDailyFatsNeed = Math.round(currentFats / dailyFatsNeed * 100);
//           const currentPercentOfDailyCarbsNeed = Math.round(currentCarbs / dailyCarbsNeed * 100);
//           /* eslint-disable max-len */
//           const caloriesPerGramOfProtein = 4.1;
//           const caloriesPerGramOfFat = 9.3;
//           const caloriesPerGramOfCarb = 4.1;
//           const currentProteinsToCalories = currentProteins * caloriesPerGramOfProtein;
//           const currentFatsToCalories = currentFats * caloriesPerGramOfFat;
//           const currentCarbsToCalories = currentCarbs * caloriesPerGramOfCarb;
//           const percentageOfProteinsInDailyCaloriesNeed = (currentProteinsToCalories / dailyCaloriesNeed) * 100;
//           const percentageOfFatsInDailyCaloriesNeed = (currentFatsToCalories / dailyCaloriesNeed) * 100;
//           const percentageOfCarbsInDailyCaloriesNeed = (currentCarbsToCalories / dailyCaloriesNeed) * 100;
//           const percentageOfEmptyCaloriesInDailyCaloriesNeed = (((currentCalories - (currentProteinsToCalories + currentFatsToCalories + currentCarbsToCalories)) / dailyCaloriesNeed) * 100) > 0
//             ? (((currentCalories - (currentProteinsToCalories + currentFatsToCalories + currentCarbsToCalories)) / dailyCaloriesNeed) * 100)
//             : 0;

//           renderCaloriesChartSectors(
//             percentageOfProteinsInDailyCaloriesNeed,
//             percentageOfFatsInDailyCaloriesNeed,
//             percentageOfCarbsInDailyCaloriesNeed,
//             percentageOfEmptyCaloriesInDailyCaloriesNeed,
//             caloriesChart
//           );
//           renderCaloriesChartContent(
//             caloriesChart,
//             currentCaloriesRemainder,
//             caloriesNumber,
//             caloriesChartContent,
//             alternativeCaloriesChartContent,
//             caloriesHeadline,
//             caloriesSubheadline,
//             alternativeCaloriesChartContentNumber,
//             alternativeCaloriesChartContentPercent,
//             currentCalories,
//             dailyCaloriesNeed,
//             currentPercentOfDailyCaloriesNeed
//           );
//           renderMacrosProgressBars(
//             proteinsProgressBarInner,
//             fatsProgressBarInner,
//             carbsProgressBarInner,
//             proteinsPercentContainer,
//             fatsPercentContainer,
//             carbsPercentContainer,
//             currentPercentOfDailyProteinsNeed,
//             currentPercentOfDailyFatsNeed,
//             currentPercentOfDailyCarbsNeed,
//           );
//         })
//           .catch(error => console.error(error));
//       });
//     });
//   });
//   listenToButtons(
//     eatenFoodsButton,
//     addFoodButton
//   );
// };

const render = async () => {
  const app = document.getElementById('app');
  app.innerHTML = homepageTemplate;



  // const caloriesChart = document.querySelector('.calories-chart');
  // const caloriesChartContent = document
  //   .querySelector('.calories-chart-content');
  // const caloriesHeadline = document.querySelector('.calories-headline');
  // const caloriesSubheadline = document.querySelector('.calories-subheadline');
  // const caloriesNumber = document.querySelector('.calories-number');
  // const alternativeCaloriesChartContent = document
  //   .querySelector('.alternative-calories-chart-content');
  // const alternativeCaloriesChartContentNumber = document
  //   .querySelector('.alternative-calories-chart-content-number');
  // const alternativeCaloriesChartContentPercent = document
  //   .querySelector('.alternative-calories-chart-content-percent');
  // const proteinsProgressBarInner = document
  //   .querySelector('.proteins-progress-bar-inner');
  // const fatsProgressBarInner = document
  //   .querySelector('.fats-progress-bar-inner');
  // const carbsProgressBarInner = document
  //   .querySelector('.carbs-progress-bar-inner');
  // const proteinsPercentContainer = document
  //   .querySelector('.proteins-percent-container');
  // const fatsPercentContainer = document
  //   .querySelector('.fats-percent-container');
  // const carbsPercentContainer = document
  //   .querySelector('.carbs-percent-container');
  // const eatenFoodsButton = document.querySelector('.eaten-foods-button');
  // const addFoodButton = document.querySelector('.add-food-button');

  const data = await getUsersData();
  const history = await getUsersHistory();

  renderCaloriesChartSectors(
    getParams(data, history).percentageOfProteinsInDailyCaloriesNeed,
    getParams(data, history).percentageOfFatsInDailyCaloriesNeed,
    getParams(data, history).percentageOfCarbsInDailyCaloriesNeed,
    getParams(data, history).percentageOfEmptyCaloriesInDailyCaloriesNeed,
    getElements().caloriesChart,
  );

  renderCaloriesChartContent(
    getElements().caloriesChart,
    getParams(data, history).currentCaloriesRemainder,
    getElements().caloriesNumber,
    getElements().caloriesChartContent,
    getElements().alternativeCaloriesChartContent,
    getElements().caloriesHeadline,
    getElements().caloriesSubheadline,
    getElements().alternativeCaloriesChartContentNumber,
    getElements().alternativeCaloriesChartContentPercent,
    getParams(data, history).currentCalories,
    getParams(data, history).dailyCaloriesNeed,
    getParams(data, history).currentPercentOfDailyCaloriesNeed,
  );

  renderMacrosProgressBars(
    getElements().proteinsProgressBarInner,
    getElements().fatsProgressBarInner,
    getElements().carbsProgressBarInner,
    getElements().proteinsPercentContainer,
    getElements().fatsPercentContainer,
    getElements().carbsPercentContainer,
    getParams(data, history).currentPercentOfDailyProteinsNeed,
    getParams(data, history).currentPercentOfDailyFatsNeed,
    getParams(data, history).currentPercentOfDailyCarbsNeed,
  );

  listenToButtons(
    getElements().eatenFoodsButton,
    getElements().addFoodButton,
  );
};

export default () => {
  loadCSS(cssUrl);
  render();
};
