/**
 * Rounds a number to a specified number of decimal places.
 * @param num The number to round.
 * @param precision The number of decimal places (default is 1 for tenths).
 * @returns The rounded number.
 */
export const roundToPrecision = (num: number, precision: number = 1): number => {
  const factor = Math.pow(10, precision);
  // Using Number.EPSILON can help mitigate minor floating-point errors
  return Math.round((num + Number.EPSILON) * factor) / factor;
};

// A specific function for the nearest tenth
export const roundToNearestTenth = (num: number): number => {
  return roundToPrecision(num, 1);
};
