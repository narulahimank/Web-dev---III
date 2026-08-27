/**
 * server.js
 * A basic HTTP server built using Node's core "http" module.
 * Demonstrates simple routing without any external framework.
 *
 * Usage:
 *   node server.js
 * Then open in a browser or test with curl/Postman:
 *   http://localhost:3000/
 *   http://localhost:3000/about
 *   http://localhost:3000/contact
 *   http://localhost:3000/anything-else  -> 404
 */

const http = require('http');
const logger = require('./modules/logger');

const PORT = process.env.PORT || 3000;

const routes = {
  '/': {
    statusCode: 200,
    body: 'Welcome to the Smart Utility Toolkit server!',
  },
  '/about': {
    statusCode: 200,
    body: 'About page: This server is built with Node.js core "http" module only.',
  },
  '/contact': {
    statusCode: 200,
    body: 'Contact page: reach us at example@smartutility.local',
  },
};

const server = http.createServer((req, res) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);

  const route = routes[req.url];

  res.setHeader('Content-Type', 'text/plain');

  if (route) {
    res.writeHead(route.statusCode);
    res.end(route.body);
    logger.success(`Responded ${route.statusCode} for ${req.url}`);
  } else {
    res.writeHead(404);
    res.end('404 - Page Not Found');
    logger.error(`404 for unmatched route: ${req.url}`);
  }
});

server.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`);
  console.log('Available routes: /, /about, /contact');
});
