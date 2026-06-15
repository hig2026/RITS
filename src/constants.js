export const WORK_MODES = Object.freeze({
  WORLDWIDE_REMOTE: 'Worldwide Remote',
  VISA_SPONSORSHIP: 'Visa Sponsorship',
});

export const ELIGIBLE_WORK_MODES = Object.freeze([
  WORK_MODES.WORLDWIDE_REMOTE,
  WORK_MODES.VISA_SPONSORSHIP,
]);

export const CONFIDENCE_THRESHOLD = 0.9;

export const MAX_STARS = 5;

export const SCORE_CRITERIA = Object.freeze([
  'cultureAndSafety',
  'workLifeBalance',
  'deiAndGlobalAccess',
  'mobilityAndGrowth',
  'legalAndPayHygiene',
]);
