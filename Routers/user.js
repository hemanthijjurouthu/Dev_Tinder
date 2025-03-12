const express = require('express');
const userRouter = express.Router();

const {userAuth} = require('../MiddleWares/userAuth');
const ConnectionRequests = require('../Models/connectionRequests');
const User = require('../Models/User');

//it will retrieves all the pending connections of a user
userRouter.get("/user/requests/recieved",userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequests.find({
            toUserId : loggedInUser._id,
            status : "interested",
        }).populate("fromUserId","firstName lastName photoURL age gender about");

        res.json({
            message : "Data fetched successfully",
            connectionRequests
        })
    }
    catch(err)
    {
        console.log("ERROR :" + err.message);
    }
})

userRouter.get("/user/connections",userAuth,async (req,res) => {
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequests.find({
            $or : [
                {fromUserId : loggedInUser._id , status : "accepted"},
                {toUserId : loggedInUser._id,status : "accepted"},
            ]
        }).populate("fromUserId").populate("toUserId");

        const data = connections.map((document) => {
            if(document.fromUserId._id.toString() === loggedInUser._id.toString())
            {
                return document.toUserId;
            }
            return document.fromUserId;
        })

        res.json({
            message : "connections",
            data
        });
    }
    catch(err)
    {
        res.status(400).send("ERROR :",err.message);
    }
})

userRouter.get("/feed",userAuth,async (req,res) => {
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 4;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        //retrieve all the connection requests send and recieved by loggedIn user
        const connections = await ConnectionRequests.find({
            $or : [
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        })
        //hide connections
        const hideUserIds = new Set();
        connections.forEach((conn) => {
            hideUserIds.add(conn.fromUserId.toString());
            hideUserIds.add(conn.toUserId.toString());
        })

        const data = await User.find({
            $and : [{_id : { $nin : Array.from(hideUserIds) }},
                    {_id : {$ne : loggedInUser._id}}],
        }).skip(skip).limit(limit);

        res.send(data);
    }
    catch(err)
    {
        res.status(400).send("ERROR :"+err.message);
    }
});

module.exports = userRouter;