const Flight = require('../Models/Flight'); 
const NotificationPreference = require('../Models/NotificationPreference')
const Passenger = require('../Models/Passenger')
const Notification = require('../Models/Notification')
// const {userSocketMap} = require('../index')

const {publishToQueue,connectToQueue} = require('../Utils/queue')

exports.addFlight = async (req, res,next) => {
  try {
    const {id,role,email} = req.user
    if(role!=='Admin'){
        const err = new Error("Only Admin Allowed to do this Operation")
        err.statusCode = 405
        throw err
    }
    const { flight_id, airline, status, departure_gate, arrival_gate, scheduled_departure, scheduled_arrival } = req.body;

    const newFlight = await Flight.create({
      flight_id,
      airline,
      status,
      departure_gate,
      arrival_gate,
      scheduled_departure,
      scheduled_arrival,
    });

    res.status(201).json({ message: 'Flight added successfully', flight: newFlight });
  } catch (error) {
    if(!error.statusCode) error.statusCode = 500;
    next(error)
  }
};

exports.getAllFlights = async (req, res,next) => {
  try {
    const flights = await Flight.findAll();
    res.status(200).json(flights);
  } catch (error) {
    if(!error.statusCode) error.statusCode = 500;
    next(error)
  }
};

exports.getFlightById = async (req, res,next) => {
  try {
    const { flight_id } = req.params;

    const flight = await Flight.findOne({ where: { flight_id } });
    if (!flight) {
      const err = new Error("Flight Not Found")
        err.statusCode = 404
        throw err
    }
    

    res.status(200).json(flight);
  } catch (error) {
    if(!error.statusCode) error.statusCode = 500;
    next(error)
  }
};

exports.updateFlight = async (req, res,next,io) => {
  try {
    const {id,role,email} = req.user
    if(role!=='Admin'){
        const err = new Error("Only Admin Allowed to do this Operation")
        err.statusCode = 405
        throw err
    }

    const { flight_id } = req.params;
    const {type,data} = req.body;

    const flight = await Flight.findOne({ where: { flight_id } });
    if (!flight) {
      const err = new Error("Flight Not Found")
        err.statusCode = 404
        throw err
    }

    // console.log(flight_id,type,data)

    let message ;

    if (type === 'Delayed') {
    const { updated_departure_time } = data;
    flight.status = 'Delayed';
    flight.scheduled_departure = updated_departure_time;

    message = `Flight ${flight_id} is Delayed. The new departure time is ${updated_departure_time}.`;
    } else if (type === 'Cancelled') {
        flight.status = 'Cancelled';

        message = `Flight ${flight_id} has been Cancelled.`;
    } else if (type === 'Gate Change') {
        const { updated_departure_gate } = data;
        flight.departure_gate = updated_departure_gate;

        message = `Flight ${flight_id} has a Gate Change. The new departure gate is ${updated_departure_gate}.`;
    }


    await flight.save()
    await sendNotification(message,flight_id,io)

    res.status(200).json({ message: 'Flight updated successfully', flight:flight_id });
  } catch (error) {
    if(!error.statusCode) error.statusCode = 500;
    next(error)
  }
};

const sendNotification = async ( message, flight_id ,io) => {
    try {
      // Broadcast the update to all connected clients
        io.emit('fetch_updated_flight', { flight_id });

        const userPreferences = await getUserPreferencesForFlight(flight_id);

        const channel = await connectToQueue();

        userPreferences.forEach(async (userPreference) => {
            const { user_id, preference, User } = userPreference;

            if (preference & 1) {
                // Send Email
                const data = {
                    message: message,
                    method: "Email",
                    recipient: User.email, 
                };
                const notification = {
                  flight_id: flight_id,  
                  message: message  || "",
                  timestamp: new Date(), 
                  method: "Email",
                  recipient: User.email, 
                };

                await Notification.create(notification);
                await publishToQueue(channel, data);
            }

            if (preference & 2) {
                // Send SMS
                const data = {
                    message: message,
                    method: "SMS",
                    recipient: User.phone_number, 
                };
                const notification = {
                  flight_id: flight_id,  
                  message: message || "",
                  timestamp: new Date(), 
                  method: "SMS",
                  recipient: User.phone_number, 
                };

                await Notification.create(notification);
                await publishToQueue(channel, data);
            }

            if (preference & 4) {
                // Send In-App Notification
                // Implement your in-app notification logic here

                const notification = {
                  flight_id: flight_id,  
                  message: message || "",
                  timestamp: new Date(), 
                  method: "App",
                  recipient: user_id, 
                };

                if (io && io.to) {
                const socketId = user_id.toString()
                if (socketId) {
                  io.to(socketId).emit('flightUpdate', {
                    flight_id: flight_id,
                    message: message,
                    timestamp: new Date()
                  });
                } else {
                  console.error(`No socket found for user ${user_id}`);
                }

                await Notification.create(notification);
              } else {
                console.error('Socket.IO instance is not available');
              }
                // await Notification.create(notification);
            }
        });
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
}

const getUserPreferencesForFlight = async (flight_id) => {
    try {
        const preferences = await NotificationPreference.findAll({
            where: { flight_id: flight_id },
            attributes: ['user_id', 'notificationMode'],
            include: [{
                model: Passenger,
                attributes: ['email', 'phone_number'] 
            }]
        });

        return preferences.map(preference => ({
            user_id: preference.user_id,
            preference: preference.notificationMode,
            User: preference.Passenger 
        }));
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        throw error;
    }
}

