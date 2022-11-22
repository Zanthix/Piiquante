const mongoose = require('mongoose');
const MongooseErrors = require('mongoose-errors')
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

//permet que chaque email soit utilisable une seule fois
userSchema.plugin(uniqueValidator);
userSchema.plugin(MongooseErrors);

module.exports = mongoose.model('User', userSchema);