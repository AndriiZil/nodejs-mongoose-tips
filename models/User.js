const bcrypt = require('bcryptjs');
const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    password: String,
}, { toJSON: { virtuals: true } });

const fullName = UserSchema.virtual('fullName');
fullName.get(function (value, virtual, doc) {
    return `${this.firstName} ${this.lastName}`;
});

UserSchema.statics.getFullName = async function (firstName) {
    try {
        const user = await this.findOne({ firstName }).lean();
        return `Mr. ${user.firstName} ${user.lastName}`;
    } catch (err) {
        console.log(err);
    }
}

UserSchema.methods.getFullName = async function () {
    try {
        return `Mr. ${this.firstName} ${this.lastName}`;
    } catch (err) {
        console.log(err);
    }
}

UserSchema.pre('save', async function (next) {
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

UserSchema.post('save', function (doc) {
    console.log('%s has been saved', doc._id);
});

module.exports = model('user', UserSchema);
