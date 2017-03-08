'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const log = require('./config/logger');

const app = express();

process.env.NODE_ENV = ( process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() == 'production' ? 'production' : 'development' );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// initialize routes
require('./routes')(app);

// error handler
require('./ErrorHandler')(app);

// Server Port Set
const PORT = 3000;
app.listen(PORT, () => {
  console.info(`[VVN Server] Application Listening on Port ${PORT}`);
});

module.exports = app;
