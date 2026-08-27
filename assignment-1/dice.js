/**
 * dice.js
 * Simulates rolling a six-sided die using Node's core "crypto" module
 * for cryptographically secure randomness (instead of Math.random()).
 *
 * Usage:
 *   node dice.js            -> rolls the dice once
 *   node dice.js <count>    -> rolls the dice <count> times
 *
 * Example:
 *   node dice.js 5
 */

const crypto = require('crypto');
const logger = require('./modules/logger');

/**
 * Rolls a single die (1-6) using crypto.randomInt,
 * which provides uniform, secure random integers.
 */
function rollDice() {
  // crypto.randomInt(min, max) -> min inclusive, max exclusive
  return crypto.randomInt(1, 7);
}

const rawCount = process.argv[2];
const rollCount = rawCount ? Number(rawCount) : 1;

if (Number.isNaN(rollCount) || rollCount < 1) {
  logger.error('Please provide a valid positive number of rolls.');
  console.log('Usage: node dice.js <count>');
  process.exit(1);
}

console.log(`--- Rolling the dice ${rollCount} time(s) ---`);

for (let i = 1; i <= rollCount; i += 1) {
  const value = rollDice();
  console.log(`Roll ${i}: Dice Rolled: ${value}`);
}

logger.success('Dice rolling complete.');
