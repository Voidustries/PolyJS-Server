const routes = require('express').Router();

const authRoutes = require('./auth/authRoutes');

routes.use('/auth', authRoutes);

module.exports = routes;