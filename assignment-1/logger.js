/**
 * logger.js
 * A custom logger module demonstrating module.exports with an object
 * (multiple reusable functions exported from one module).
 */

function info(message) {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
}

function error(message) {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
}

function success(message) {
  console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`);
}

module.exports = { info, error, success };
