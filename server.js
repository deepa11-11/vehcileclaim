const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Replace with mysql2 if using MySQL
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB (replace with MySQL connection if necessary)
mongoose.connect('mongodb://localhost:27017/yourdbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema (Example for MongoDB)
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);

// Route for User Registration (Sign Up)
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });

  user.save((err) => {
    if (err) return res.status(500).send('Error saving user');
    res.status(200).send('User registered');
  });
});

// Route for User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).send('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  res.status(200).json({ token });
});

// Start the Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
