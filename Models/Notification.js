const { DataTypes } = require('sequelize');
const sequelize = require('../database'); 
const Flight = require('./Flight'); 

const Notification = sequelize.define('Notification', {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  flight_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Flight,
      key: 'flight_id',
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  method: {
    type: DataTypes.ENUM('Email', 'SMS', 'App'),
    allowNull: false,
  },
  recipient: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'notifications',
  timestamps: true,
});

Notification.belongsTo(Flight, { foreignKey: 'flight_id', targetKey: 'flight_id' });

module.exports = Notification;
