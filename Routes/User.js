const express = require('express');
const router = express.Router();
const User = require('../Controller/UserController');
const NotificationPreference = require('../Controller/notifyController')
const authMiddleware = require('../authMiddleware');

router.post("/register",User.register);

router.post("/login",User.login)

router.post("/subscribe",authMiddleware.verifyToken,NotificationPreference.addNotificationPreference)

module.exports = router