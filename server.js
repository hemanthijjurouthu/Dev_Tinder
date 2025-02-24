const express = require('express');
const app = express();

app.use("/test",(req,res) => {
    res.send("testing");
})

app.use("/route",(req,res) => {
    res.send("routung");
})

app.use("/",(req,res) => {
    res.send("Hello World!");
})

app.listen(3000,() => {
    console.log("server started successfully!");
})