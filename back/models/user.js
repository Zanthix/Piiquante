const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

//permet que chaque email soit utilisable une seule fois
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);