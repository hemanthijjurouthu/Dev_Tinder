const express = require('express');
const connectDB = require('./config/database');
const User = require('./Models/User');
const app = express();

app.post('/signup',async (req,res) => {
    const user = new User({
        firstName : "Ramakrishna",
        lastName : "Ijjurouthu",
        emailId : "Ramakrishna@gmail.com",
        password : "Ram@1234#",
        age : "35",
        gender : "Male",
    });

    await user.save();
    res.send("user saved successfully!!!");
})

connectDB()
.then(() => {
    console.log('successfully connected to database')
    app.listen(3000,() => {
        console.log("server started successfully!");
    })
})
.catch(() => {
    console.log('Error in connecting to the database')
});