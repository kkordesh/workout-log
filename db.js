const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:981561@localhost:5432/workoutlog");

module.exports = sequelize; 