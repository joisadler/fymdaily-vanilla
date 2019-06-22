import calculateMacros from './calculations';

export default () => {
  const caloriesContainer = document.querySelector('.calories-container');
  const caloriesChart = document.querySelector('.calories-chart');
  const caloriesChartContent = document.querySelector('.calories-chart-content');
  const caloriesNumber = document.querySelector('.calories-number');
  const alternativeCaloriesChartContent = document
    .querySelector('.alternative-calories-chart-content');
  const alternativeCaloriesChartContentNumber = document
    .querySelector('.alternative-calories-chart-content-number');
  const alternativeCaloriesChartContentPercent = document
    .querySelector('.alternative-calories-chart-content-percent');
  const macrosLines = [...document.querySelectorAll('.macros-line')];
  const macrosImageContainers = [...document
    .querySelectorAll('.macros-image-container')];
  const homepageButtons = [...document.querySelectorAll('.homepage-button')];
  const proteinsProgressBarInner = document
    .querySelector('.proteins-progress-bar-inner');
  const fatsProgressBarInner = document
    .querySelector('.fats-progress-bar-inner');
  const carbsProgressBarInner = document
    .querySelector('.carbs-progress-bar-inner');
  const percentContainers = [...document.querySelectorAll('.percent-container')];
  const proteinsPercentContainer = document
    .querySelector('.proteins-percent-container');
  const fatsPercentContainer = document
    .querySelector('.fats-percent-container');
  const carbsPercentContainer = document
    .querySelector('.carbs-percent-container');
  
  if (window.innerHeight > window.innerWidth
    || !(/Android|webOS|iPhone|iPad|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent))) {
    caloriesContainer.style.height = `${caloriesContainer.offsetWidth}px`;
  } else {
    caloriesContainer.style.width = `${caloriesContainer.offsetHeight}px`;
  }
  window.addEventListener('resize', () => {
    if (window.innerHeight > window.innerWidth ||
    !(/Android|webOS|iPhone|iPad|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent))) {
      caloriesContainer.style.height = `${caloriesContainer.offsetWidth}px`;
    } else {
      caloriesContainer.style.width = `${caloriesContainer.offsetHeight}px`;
    }
  });
  
  /* eslint-disable no-param-reassign */
  
  macrosLines.forEach((line) => {
    const lineHeight = ((caloriesChart.offsetWidth
       - caloriesChartContent.offsetWidth) / 2) + 2;
    line.style.height = `${lineHeight}px`;
  });
  window.addEventListener('resize', () => {
    macrosLines.forEach((line) => {
      const lineHeight = ((caloriesChart.offsetWidth
         - caloriesChartContent.offsetWidth) / 2) + 2;
      line.style.height = `${lineHeight}px`;
    });
  });
  
  macrosImageContainers.forEach((container) => {
    container.style.width = `${container.offsetHeight}px`;
  });
  
  homepageButtons.forEach((button) => {
    button.style.width = `${button.offsetHeight}px`;
  });
  
  percentContainers.forEach((container) => {
    container.style.width = `${container.offsetHeight}px`;
  });
  /* eslint-enable no-param-reassign */
  
  fetch('/user', {
    method: 'GET',
    withCredentials: true,
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
  
      // делаем запрос к сегодняшней истории и вычисляем следующие значения (пока пропишем в константах):
      const currentCalories = 2152;
      const currentProteins = 246;
      const currentFats = 77;
      const currentCarbs = 107;
      /* eslint-disable max-len */
      const currentCaloriesRemainder = dailyCaloriesNeed - currentCalories;
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
        sector.style.visibility = 'hidden';
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
        }, 25);
      };
      caloriesChartSectorsLoop();
  
      caloriesNumber.innerText = `${currentCaloriesRemainder}`;
      alternativeCaloriesChartContentNumber.innerText = `${currentCalories}/${dailyCaloriesNeed}`;
      alternativeCaloriesChartContentPercent.innerText = `${currentPercentOfDailyCaloriesNeed}%`;
  
      caloriesChart.addEventListener('click', () => {
        if (caloriesChartContent.style.display === 'flex') {
          alternativeCaloriesChartContent.style.display = 'flex';
          caloriesChartContent.style.display = 'none';
        } else {
          caloriesChartContent.style.display = 'flex';
          alternativeCaloriesChartContent.style.display = 'none';
        }
      });
  
      proteinsProgressBarInner.style.width = currentPercentOfDailyProteinsNeed > 100
        ? '100%' : `${currentPercentOfDailyProteinsNeed}%`;
      fatsProgressBarInner.style.width = currentPercentOfDailyFatsNeed > 100
        ? '100%' : `${currentPercentOfDailyFatsNeed}%`;
      carbsProgressBarInner.style.width = currentPercentOfDailyCarbsNeed > 100
        ? '100%' : `${currentPercentOfDailyCarbsNeed}%`;
  
      proteinsPercentContainer.innerText = `${currentPercentOfDailyProteinsNeed}%`;
      fatsPercentContainer.innerText = `${currentPercentOfDailyFatsNeed}%`;
      carbsPercentContainer.innerText = `${currentPercentOfDailyCarbsNeed}%`;
    });
  });
};
