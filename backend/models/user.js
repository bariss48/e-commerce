const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30 , 'max charachters :limit 30']
    },
    email: {
        type: String,
        required: [true, 'please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid e-mail address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6 , 'your password must be longer than 6 digit'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

//encrypt password
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})
//compare password
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//GENERATE JWT TOKEN
userSchema.methods.getJwtToken = function () {
   return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
       expiresIn: process.env.JWT_EXPIRES_TIME  
   });
}
// generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    //encrypt token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000
    return resetToken;
}

module.exports = mongoose.model('User', userSchema);