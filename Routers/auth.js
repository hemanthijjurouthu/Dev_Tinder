const express = require('express');
const authRouter = express.Router();
const {validateSignUpData} = require('../Models/validateSignUpData');
const bcrypt = require('bcrypt');
const User = require('../Models/User');

authRouter.post('/signup',async (req,res) => {
    try {
        validateSignUpData(req);
        const {firstName,lastName,emailId,password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        console.log(passwordHash);

        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password : passwordHash,
        });

        await newUser.save();
        const token = await newUser.getJWT();
        console.log(token);
        res.cookie("token",token,{ expires: new Date(Date.now()+ 7 * 86400000) });
        res.send(newUser);
    }
    catch(err)
    {
        res.status(400).send("Error saving the user : " + err.message);
    }
})

authRouter.post("/login",async (req,res) => {
    try {
        
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId});
        if(!user)
        {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        console.log(isPasswordValid);
        if(!isPasswordValid)
        {
            throw new Error("Invalid credentials");
        }
        else
        {
            const token = await user.getJWT();
            console.log(token);
            res.cookie("token",token,{ expires: new Date(Date.now()+ 7 * 86400000) });
            res.send(user);
        }
    }
    catch(err)
    {
        res.status(400).json(err.message);
    }
})
authRouter.post("/logout",(req,res) => {
    res.cookie("token",null,{
        expires : new Date(Date.now())
    });

    res.send("logout successful!!!!");
})

module.exports = authRouter;