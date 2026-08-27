/**
 * fileManager.js
 * Implements Create, Read, Update, Delete (CRUD) operations
 * on a text file using Node's core "fs" module.
 *
 * Usage:
 *   node fileManager.js create <filename> <text>
 *   node fileManager.js read   <filename>
 *   node fileManager.js update <filename> <text>
 *   node fileManager.js delete <filename>
 *
 * Examples:
 *   node fileManager.js create notes.txt "Hello World"
 *   node fileManager.js read notes.txt
 *   node fileManager.js update notes.txt "Appended line"
 *   node fileManager.js delete notes.txt
 */

const fs = require('fs');
const path = require('path');
const logger = require('./modules/logger');

const [, , action, fileName, ...textParts] = process.argv;
const text = textParts.join(' ');

function printUsage() {
  console.log('\nUsage:');
  console.log('  node fileManager.js create <filename> <text>');
  console.log('  node fileManager.js read   <filename>');
  console.log('  node fileManager.js update <filename> <text>');
  console.log('  node fileManager.js delete <filename>');
}

if (!action || !fileName) {
  logger.error('Missing arguments.');
  printUsage();
  process.exit(1);
}

const filePath = path.join(__dirname, 'data', fileName);

// Ensure the "data" directory exists before writing
function ensureDataDir() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
}

switch (action.toLowerCase()) {
  case 'create': {
    ensureDataDir();
    fs.writeFile(filePath, text || '', (err) => {
      if (err) {
        logger.error(`Failed to create file: ${err.message}`);
        return;
      }
      logger.success(`File created: ${fileName}`);
    });
    break;
  }

  case 'read': {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          logger.error(`File not found: ${fileName}`);
        } else {
          logger.error(`Failed to read file: ${err.message}`);
        }
        return;
      }
      console.log(`\n--- Contents of ${fileName} ---`);
      console.log(data);
      console.log('--- End of file ---');
    });
    break;
  }

  case 'update': {
    fs.appendFile(filePath, `\n${text}`, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          logger.error(`Cannot update. File not found: ${fileName}`);
        } else {
          logger.error(`Failed to update file: ${err.message}`);
        }
        return;
      }
      logger.success(`File updated: ${fileName}`);
    });
    break;
  }

  case 'delete': {
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          logger.error(`Cannot delete. File not found: ${fileName}`);
        } else {
          logger.error(`Failed to delete file: ${err.message}`);
        }
        return;
      }
      logger.success(`File deleted: ${fileName}`);
    });
    break;
  }

  default: {
    logger.error(`Unknown action "${action}".`);
    printUsage();
    process.exit(1);
  }
}
