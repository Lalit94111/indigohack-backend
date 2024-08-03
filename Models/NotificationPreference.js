const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Passenger = require("./Passenger");
const Flight = require("./Flight");

const NotificationPreference = sequelize.define(
  "NotificationPreference",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary Key',
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Passenger,
        key: "user_id",
      },
      allowNull: false,
      comment: 'User ID',
    },
    flight_id: {
      type: DataTypes.STRING,
      references: {
        model: Flight,
        key: "flight_id",
      },
      allowNull: false,
      comment: 'Flight ID',
    },
    notificationMode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Notification Mode',
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Is Deleted',
    },
  },
  {
    tableName: "notification_preferences",
    timestamps: true,
    comment: 'Notification Preferences Table',
  }
);

NotificationPreference.belongsTo(Passenger, { foreignKey: "user_id" });
NotificationPreference.belongsTo(Flight, { foreignKey: "flight_id" });

module.exports = NotificationPreference;
