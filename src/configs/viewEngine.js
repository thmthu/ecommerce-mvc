const express = require('express');
const path = require('path');

const configViewEngine = (app) => {
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'ejs');
    app.use('/assets', express.static(path.join(__dirname, '../views/assets')));
};

module.exports = configViewEngine;