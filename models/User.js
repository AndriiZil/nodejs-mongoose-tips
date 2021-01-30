const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
})

module.exports = model('user', UserSchema);
