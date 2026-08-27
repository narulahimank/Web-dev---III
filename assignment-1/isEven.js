/**
 * isEven.js
 * A custom module that checks whether a number is even.
 * Demonstrates module.exports for reuse in other files.
 */

function isEven(num) {
  if (typeof num !== 'number' || Number.isNaN(num)) {
    throw new TypeError('isEven expects a valid number');
  }
  return num % 2 === 0;
}

// Export the function so other files can require() it
module.exports = isEven;
