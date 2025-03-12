const express = require('express');

const profileRouter = express.Router();
const User = require('../Models/User');
const {userAuth} = require('../MiddleWares/userAuth');
const {validateEditProfileData} = require('../Models/validateSignUpData')
const validator = require('validator');
const bcrypt = require('bcrypt');


profileRouter.get("/profile/view", userAuth , async (req,res) => {
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err)
    {
        res.send("ERROR :"+ err.message);
    }
});

profileRouter.patch("/profile/edit",userAuth,async (req,res) => {
    try
    {
        if(!validateEditProfileData(req))
        {
            throw new Error("Invalid Edit Request!!!!");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        console.log(loggedInUser);
        await loggedInUser.save();
        res.json({
            message : `${loggedInUser.firstName} your profile updated successfully!!!`,
            user : loggedInUser
        })
    }
    catch(err)
    {
        res.status(400).send("ERROR :" + err.message);
    }
});

profileRouter.patch("/profile/password",userAuth,async (req,res) => {
    try
    {
        console.log(req.body.existingPassword);
        const loggedInUser = req.user;
        const isPasswordValid = await loggedInUser.validatePassword(req.body.existingPassword);
        if(!isPasswordValid)
        {
            throw new Error("Existing Password Not valid!!!");
        }
        const isStrongPassword = validator.isStrongPassword(req.body.newPassword);
        if(!isStrongPassword)
        {
            throw new Error("Invalid credentials");
        }
        const passwordHash = await bcrypt.hash(req.body.newPassword,10);
        console.log(passwordHash);
        loggedInUser.password = passwordHash;
        await loggedInUser.save();
        res.json({
            message : `${loggedInUser.firstName} your password updated successfully!!!`,
            user : loggedInUser
        })
    }
    catch(err)
    {
        res.status(400).send("ERROR :" + err.message);
    }
})


module.exports = profileRouter;
