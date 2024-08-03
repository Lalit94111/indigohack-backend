const { DataTypes } = require('sequelize');
const sequelize = require('../database'); 

const Passenger = sequelize.define('Passenger', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'User ID',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Passenger Name',
  },
  role: {
    type: DataTypes.ENUM('Admin', 'User'),
    allowNull: false,
    comment: 'User Role',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
    comment: 'Email Address',
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Password Hash',
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Phone Number',
  },
}, {
  tableName: 'passengers',
  timestamps: true, 
  comment: 'Passengers Table',
});

module.exports = Passenger;
