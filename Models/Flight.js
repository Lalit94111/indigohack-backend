const { DataTypes } = require('sequelize');
const sequelize = require('../database'); 

const Flight = sequelize.define('Flight', {
  flight_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  airline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('On Time', 'Delayed', 'Cancelled'),
    allowNull: false,
  },
  departure_gate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  arrival_gate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  scheduled_departure: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  scheduled_arrival: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  actual_departure: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  actual_arrival: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'flights',
  timestamps: true, 
});

module.exports = Flight;
