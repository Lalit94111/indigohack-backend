const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Passenger = require('../Models/Passenger');

const createToken = (user) => {
  return jwt.sign(
    { id: user.user_id, email: user.email,role:user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};


exports.register = async (req, res,next) => {
  try {
    const { name, email, password, phone_number,role } = req.body;

    const existingUser = await Passenger.findOne({ where: { email } });
    const existingPhoneNumber = await Passenger.findOne({ where: { phone_number } });

    if (existingUser || existingPhoneNumber) {
        const err = new Error("Email or Phone Number already in Use")
        err.statusCode = 400
        throw err
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await Passenger.create({ name, email, password_hash, phone_number,role });

    const token = createToken(newUser);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    if(!error.statusCode) error.statusCode = 500;
    next(error)
  }
};


exports.login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    const user = await Passenger.findOne({ where: { email } });

    if (!user) {
        const err = new Error('Invalid email or password')
        err.statusCode = 400
        throw err
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
        const err = new Error('Invalid email or password')
        err.statusCode = 400
        throw err
    }

    const token = createToken(user);

    const isAdmin = user.role==='Admin';

    res.status(200).json({ message: 'Login successful', token,isAdmin,user_id : user.user_id });
  } catch (error) {
    if(!error.statusCode) error.statusCode = 500;
    next(error)
  }
};