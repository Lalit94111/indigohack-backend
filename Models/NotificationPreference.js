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
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Passenger,
        key: "user_id",
      },
      allowNull: false,
    },
    flight_id: {
      type: DataTypes.STRING,
      references: {
        model: Flight,
        key: "flight_id",
      },
      allowNull: false,
    },
    notificationMode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "notification_preferences",
    timestamps: true,
  }
);

NotificationPreference.belongsTo(Passenger, { foreignKey: "user_id" });
NotificationPreference.belongsTo(Flight, { foreignKey: "flight_id" });

module.exports = NotificationPreference;
