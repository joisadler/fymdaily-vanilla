/* eslint-disable max-len */
const physicalActivityRatios = {
  veryLight: 1.2, // Sitting, watching TV, talking, very little to almost no activity.
  light: 1.4, // Typing, teaching, retail work, combined with some walking throughout the day.
  moderate: 1.6, // Jobs that involve some movement, combined with activities such as cycling, tennis, dancing, or weight training for 1-2 hours per day.
  heavy: 1.8, // Heavy manual labor such working on construction site, combined with activities such as football or body building for 2 for 4 hours per day.
  veryHeavy: 2 // A combination of moderate and heavy activity for 8 or more hours per day, plus 2-4 hours of intence training per day.
};
const calorieSurplusRatios = {
  fastWeightLoss: 0.8,
  normalWeightLoss: 0.9,
  weightMaintenance: 1,
  massGain: 1.1
};
const proteinNeedPerKg = {
  fastWeightLoss: 3,
  normalWeightLoss: 2.5,
  weightMaintenance: 2,
  massGain: 2.5
};
const fatNeedPerKg = 1.5;
const caloriesPerGramOfProtein = 4.1;
const caloriesPerGramOfFat = 9.3;
const caloriesPerGramOfCarb = 4.1;

const calculateMacros = (bodyWeight,
  height,
  gender,
  waistCircumference,
  neckCircumference,
  hipCircumference,
  physicalActivityLevel,
  goal) => {
  const physicalActivityRatio = physicalActivityRatios[physicalActivityLevel];
  const calorieSurplusRatio = calorieSurplusRatios[goal];
  // const bodyFatPercentage = gender === 'male' // US Navy method to calculate body fat percentage
  //   ? 86.01 * Math.log10(waistCircumference - neckCircumference) - 70.041 * Math.log10(height) + 36.76
  //   : 163.205 * Math.log10(waistCircumference + hipCircumference - neckCircumference) - 97.684 * Math.log10(height) - 78.387;
  const bodyFatPercentage = gender === 'male' // US Navy method to calculate body fat percentage
    ? 495 / (1.0324 - 0.19077 * Math.log10(waistCircumference - neckCircumference) + 0.15456 * Math.log10(height) ) - 450
    : 495 / (1.29579 - 0.35004 * Math.log10(waistCircumference + hipCircumference - neckCircumference) + 0.22100 * Math.log10(height)) - 450;
  const leanBodyMass = (bodyWeight * (100 - bodyFatPercentage)) / 100;
  const basalMetabolicRate = 370 + (21.6 * leanBodyMass); // Katch-McArdle equation
  const totalEnergyExpenditure = basalMetabolicRate * physicalActivityRatio;
  const dailyCaloriesNeed = totalEnergyExpenditure * calorieSurplusRatio;
  const dailyProteinsNeed = leanBodyMass * proteinNeedPerKg[goal];
  const dailyFatsNeed = leanBodyMass * fatNeedPerKg;
  const dailyCarbsNeed = (dailyCaloriesNeed - (dailyProteinsNeed * caloriesPerGramOfProtein) - (dailyFatsNeed * caloriesPerGramOfFat)) / caloriesPerGramOfCarb;
  return {
    leanBodyMass,
    bodyFatPercentage,
    dailyCaloriesNeed,
    dailyProteinsNeed,
    dailyFatsNeed,
    dailyCarbsNeed
  };
};

export default calculateMacros;
