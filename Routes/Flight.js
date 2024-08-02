const express = require('express')
const router = express.Router()

const flightController = require('../Controller/flightController');
const authMiddleware = require('../authMiddleware');

module.exports = (io) =>{
    router.post('/add', authMiddleware.verifyToken, flightController.addFlight);

    router.get('/', authMiddleware.verifyToken, flightController.getAllFlights);

    router.get('/:flight_id', authMiddleware.verifyToken, flightController.getFlightById);

    router.put('/:flight_id', authMiddleware.verifyToken, (req,res,next)=>{
        flightController.updateFlight(req,res,next,io)
    } );

return router
}

// router.post('/add', authMiddleware.verifyToken, flightController.addFlight);

// router.get('/', authMiddleware.verifyToken, flightController.getAllFlights);

// router.get('/:flight_id', authMiddleware.verifyToken, flightController.getFlightById);

// router.put('/:flight_id', authMiddleware.verifyToken, flightController.updateFlight);

// module.exports = router;