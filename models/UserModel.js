const mongoose = require('mongoose');
const registerSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password:{
        type: String,
        require:true
    },
    resetlink: {
        data: String,
        default: ''
    }
});

module.exports = mongoose.model('UserModel', registerSchema, 'Users');