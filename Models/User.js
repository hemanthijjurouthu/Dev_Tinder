const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    },
    lastName : {
        type : String,
        required : true
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        validate(value) {
            if(!validator.isEmail(value))
            {
                throw new Error("Email is not valid!!!");
            }
        }
    },
    password : {
        type : String,
    },
    age : {
        type : Number,
    },
    gender : {
        type : String,
        validate(value)
        {
            if(!["Male","Female","Other"].includes(value))
            {
                throw new Error("Gender data is not valid!!!");
            }
        }
    },
    isPremium : {
        type : Boolean,
        default : false,
    },
    membershipType : {
        type : String,
    },
    photoURL : {
        type : String,
        default : "https://hancockogundiyapartners.com/wp-content/uploads/2019/07/dummy-profile-pic-300x300.jpg",
    },
    about : {
        type : String,
        default : "This is all about section",
    }
},{timestamps : true});

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Ram@1234#", { expiresIn: "7d" }); // 🔹 Set expiry time
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    console.log(this);
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);
    return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema);