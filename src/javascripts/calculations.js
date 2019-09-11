/* eslint-disable max-len */
const physicalActivityRatios = {
  veryLight: 1.2, // Sitting, watching TV, talking, very little to almost no activity.
  light: 1.4, // Typing, teaching, retail work, combined with some walking throughout the day.
  moderate: 1.6, // Jobs that involve some movement, combined with activities such as cycling, tennis, dancing, or weight training for 1-2 hours per day.
  heavy: 1.8, // Heavy manual labor such working on construction site, combined with activities such as football or body building for 2 for 4 hours per day.
  veryHeavy: 2 // A combination of moderate and heavy activity for 8 or more hours per day, plus 2-4 hours of intence training per day.
};
const calorieSurplusRatios = {
  fastWeightLoss: 0.75,
  normalWeightLoss: 0.85,
  weightMaintenance: 1,
  massGain: 1.15
};
const proteinNeedPerKg = {
  fastWeightLoss: 2.1,
  normalWeightLoss: 1.75,
  weightMaintenance: 1.5,
  massGain: 1.75
};
const caloriesPerGramOfProtein = 4;
const caloriesPerGramOfFat = 9;
const caloriesPerGramOfCarb = 4;

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
  const bodyFatPercentage = gender === 'male' // US Navy method to calculate body fat percentage
    ? 495 / (1.0324 - 0.19077 * Math.log10(waistCircumference - neckCircumference) + 0.15456 * Math.log10(height) ) - 450
    : 495 / (1.29579 - 0.35004 * Math.log10(waistCircumference + hipCircumference - neckCircumference) + 0.22100 * Math.log10(height)) - 450;
  const leanBodyMass = (bodyWeight * (100 - bodyFatPercentage)) / 100;
  const basalMetabolicRate = 370 + (21.6 * leanBodyMass); // Katch-McArdle equation
  const totalEnergyExpenditure = basalMetabolicRate * physicalActivityRatio;
  const dailyCaloriesNeed = totalEnergyExpenditure * calorieSurplusRatio;
  const dailyProteinsNeed = leanBodyMass * proteinNeedPerKg[goal];
  // const dailyFatsNeed = leanBodyMass * fatNeedPerKg;
  const dailyFatsNeed = (dailyCaloriesNeed * 0.3) / caloriesPerGramOfFat;
  const dailyCarbsNeed = (dailyCaloriesNeed - (dailyProteinsNeed * caloriesPerGramOfProtein) - (dailyFatsNeed * caloriesPerGramOfFat)) / caloriesPerGramOfCarb;
  // console.log(`
  // dailyProteinsNeed: ${dailyProteinsNeed}
  // (${(dailyProteinsNeed * 4) / dailyCaloriesNeed * 100}%)
  // dailyFatsNeed: ${dailyFatsNeed}
  // (${(dailyFatsNeed * 9) / dailyCaloriesNeed * 100}%)
  // dailyCarbsNeed: ${dailyCarbsNeed}
  // (${(dailyCarbsNeed * 4) / dailyCaloriesNeed * 100}%)
  // `)
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
