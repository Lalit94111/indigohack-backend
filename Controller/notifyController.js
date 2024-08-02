const NotificationPreference = require('../Models/NotificationPreference');
const Flight = require('../Models/Flight');

exports.addNotificationPreference = async (req, res, next) => {
    try {
        const { id, role, email } = req.user;
        const { flight_id, options } = req.body;

        const flight = await Flight.findOne({ where: { flight_id: flight_id } });

        if (!flight) {
            const err = new Error("No Flight Found with this Flight Id");
            err.statusCode = 404;
            throw err;
        }

        const existingPreference = await NotificationPreference.findOne({
            where: {
                user_id: id,
                flight_id: flight_id
            }
        });

        let notificationPreference;
        if (existingPreference) {
            existingPreference.notificationMode = options;
            await existingPreference.save();
            notificationPreference = existingPreference;
        } else {
            notificationPreference = await NotificationPreference.create({
                user_id: id,
                flight_id: flight_id,
                notificationMode: options
            });
        }

        res.status(201).json({
            message: "Notification Preference Added/Updated Successfully",
            preferenceId: notificationPreference.id
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
