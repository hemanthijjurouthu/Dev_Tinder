const validator = require('validator');

const validateSignUpData = (req) => {
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName)
    {
        throw new Error("Name is not valid!!!");
    }
    else if(!validator.isEmail(emailId))
    {
        throw new Error("Email is not valid!!!");
    }
    else if(!validator.isStrongPassword(password))
    {
        throw new Error("Password is not valid!!!");
    }
}


const validateEditProfileData = (req) => {
    //user was not allowed to edit all the fields restricted to edit the field;

    const allowedEditFields = ["firstName","lastName","emailId","age","gender","photoURL","about"];
    const isAllowed = Object.keys(req.body).every((key) => 
        allowedEditFields.includes(key)
    );
    return isAllowed;
}

module.exports = {validateSignUpData,
    validateEditProfileData
};