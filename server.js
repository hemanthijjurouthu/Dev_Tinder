const express = require('express');
const connectDB = require('./config/database');

const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config()

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));

app.use(cookieParser());
app.use(express.json());


const authRouter = require('./Routers/auth');
const profileRouter = require('./Routers/profile');
const requestRouter = require('./Routers/request');
const userRouter = require('./Routers/user');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDB()
.then(() => {
    console.log('successfully connected to database')
    app.listen(process.env.PORT,() => {
        console.log("server started successfully at 3000!");
    })
})
.catch(() => {
    console.log('Error in connecting to the database')
});