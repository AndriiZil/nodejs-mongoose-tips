const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('morgan');
const sizeof = require('object-sizeof');

const User = require('./models/User');

const app = express();

const result = dotenv.config();

if (result.error) {
  throw result.error
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(e => console.error(e));

app.use(express.json());
app.use(logger('dev'));

app.post('/', async (req, res) => {
  try {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    });

    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

app.get('/', async (req, res) => {
  try {
    const fullName = await User.getFullName(req.query.firstName);

    const userWithoutLean = await User.findOne({ firstName: req.query.firstName });
    const userWithLean = await User.findOne({ firstName: req.query.firstName }).lean();

    console.log(sizeof(userWithoutLean)); // 31564
    console.log(sizeof(userWithLean)); // 292

    console.log(userWithoutLean.fullName); // Andrii Zilnyk

    const user = new User({
      firstName: 'Bob',
      lastName: 'James'
    });
    console.log('FULL NAME', await user.getFullName());

    console.log(userWithLean.fullName); // no virtual with lean()

    console.log(fullName); // Mr. Andrii Zilnyk

    res.send(userWithoutLean);
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log('Server was started');
});
