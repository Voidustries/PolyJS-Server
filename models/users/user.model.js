const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR=10

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email Address'})
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String
        }
    }],
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

// Before saving, generate a salt and hash the password if it has changed or is new
userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next(); 
        });
    });
});

// Compare the input password to the one on record
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Generate a JWT token for this user that will be used to ID them
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET);
    this.tokens = this.tokens.concat({ token });
    this.save();
    return token;
};

// Revoke a token
userSchema.methods.revokeAuthToken = function(token) {
    
    this.tokens = this.tokens.filter((item) => {
        return item.token != token;
    });
    this.save();
};

module.exports = mongoose.model('User', userSchema);