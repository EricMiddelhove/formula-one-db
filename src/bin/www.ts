#!/usr/bin/env node

// Set environment, if not specified
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.title = `Formula 1 DB ${process.env.NODE_ENV.toUpperCase()}`;
console.clear();

/**
 * Module dependencies.
 */
import http, { createServer } from 'http';
import { DataSource } from 'typeorm';
import connectionInfo from '../ormconfig';

let server: http.Server;
let port: string | number | boolean;

export const connection = new DataSource(connectionInfo);

connection.initialize()
  .then(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const app = require('../app');

    /**
     * Get port from environment and store in Express.
     */
    port = normalizePort(process.env.PORT || 4500);
    app.set('port', port);

    /**
     * Create HTTP server.
     */
    server = createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  })
  .catch((err) => {
    console.error(err);
  });



/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string | number): string | number | boolean {
  const port = parseInt(val as string, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

