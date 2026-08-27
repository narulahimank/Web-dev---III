/**
 * app.js
 * Demonstrates reusability of custom modules (isEven, logger)
 * by importing them with require().
 *
 * Usage:
 *   node app.js
 */

const isEven = require('./modules/isEven');
const logger = require('./modules/logger');

logger.info('Starting module reuse demonstration...');

const numbersToCheck = [2, 7, 10, 15, 42];

numbersToCheck.forEach((num) => {
  try {
    const result = isEven(num);
    logger.success(`${num} is ${result ? 'even' : 'odd'}`);
  } catch (err) {
    logger.error(err.message);
  }
});

logger.info('Module reuse demonstration complete.');
