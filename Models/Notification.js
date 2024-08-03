const { DataTypes } = require('sequelize');
const sequelize = require('../database'); 
const Flight = require('./Flight'); 

const Notification = sequelize.define('Notification', {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Notification ID',
  },
  flight_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Flight,
      key: 'flight_id',
    },
    comment: 'Related Flight ID',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Notification Message',
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Timestamp of Notification',
  },
  method: {
    type: DataTypes.ENUM('Email', 'SMS', 'App'),
    allowNull: false,
    comment: 'Notification Method',
  },
  recipient: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Recipient of Notification',
  },
}, {
  tableName: 'notifications',
  timestamps: true,
  comment: 'Notifications Table',
});

Notification.belongsTo(Flight, { foreignKey: 'flight_id', targetKey: 'flight_id' });

module.exports = Notification;
