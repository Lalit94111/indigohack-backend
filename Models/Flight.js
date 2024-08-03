const { DataTypes } = require('sequelize');
const sequelize = require('../database'); 

const Flight = sequelize.define('Flight', {
  flight_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Flight ID',
  },
  airline: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Airline Name',
  },
  status: {
    type: DataTypes.ENUM('On Time', 'Delayed', 'Cancelled'),
    allowNull: false,
    comment: 'Flight Status',
  },
  departure_gate: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Departure Gate',
  },
  arrival_gate: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Arrival Gate',
  },
  scheduled_departure: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Scheduled Departure Time',
  },
  scheduled_arrival: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Scheduled Arrival Time',
  },
  actual_departure: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Actual Departure Time',
  },
  actual_arrival: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Actual Arrival Time',
  },
}, {
  tableName: 'flights',
  timestamps: true, 
  comment: 'Flights Table',
});

module.exports = Flight;
