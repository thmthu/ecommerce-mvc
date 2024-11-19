const express = require('express');
const path = require('path');

const configViewEngine = (app) => {
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'ejs');
    app.use('/css', express.static(path.join(__dirname, '../views/css')));
    app.use('/img', express.static(path.join(__dirname, '../views/img')));
    app.use('/js', express.static(path.join(__dirname, '../views/js')));
    app.use('/lib', express.static(path.join(__dirname, '../views/lib')));
    app.use('/mail', express.static(path.join(__dirname, '../views/mail')));
    app.use('/scss', express.static(path.join(__dirname, '../views/scss')));
    app.use('/partials', express.static(path.join(__dirname, '../views/partials')));
};

module.exports = configViewEngine;