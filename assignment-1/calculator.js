/**
 * calculator.js
 * A simple CLI-based calculator using process.argv
 *
 * Usage:
 *   node calculator.js <operation> <num1> <num2>
 *
 * Examples:
 *   node calculator.js add 10 5
 *   node calculator.js sub 10 5
 *   node calculator.js mul 10 5
 *   node calculator.js div 10 5
 */

// process.argv layout:
// [0] -> path to node executable
// [1] -> path to this script
// [2] -> operation
// [3] -> first number
// [4] -> second number

console.log('--- CLI Calculator ---');
console.log('Raw arguments received:', process.argv);

const [, , operation, rawA, rawB] = process.argv;

function printUsageAndExit() {
  console.log('\nUsage: node calculator.js <add|sub|mul|div> <num1> <num2>');
  console.log('Example: node calculator.js add 10 5');
  process.exit(1);
}

// Basic presence validation
if (!operation || rawA === undefined || rawB === undefined) {
  console.error('Error: Missing arguments.');
  printUsageAndExit();
}

const a = Number(rawA);
const b = Number(rawB);

// Validate numbers
if (Number.isNaN(a) || Number.isNaN(b)) {
  console.error(`Error: "${rawA}" or "${rawB}" is not a valid number.`);
  printUsageAndExit();
}

let result;

switch (operation.toLowerCase()) {
  case 'add':
    result = a + b;
    break;
  case 'sub':
    result = a - b;
    break;
  case 'mul':
    result = a * b;
    break;
  case 'div':
    if (b === 0) {
      console.error('Error: Division by zero is not allowed.');
      process.exit(1);
    }
    result = a / b;
    break;
  default:
    console.error(`Error: Unknown operation "${operation}".`);
    printUsageAndExit();
}

console.log(`\nOperation: ${operation}`);
console.log(`Numbers: ${a}, ${b}`);
console.log(`Result: ${result}`);
