const express = require('express');

const requestRouter = express.Router();
const {userAuth} = require('../MiddleWares/userAuth');
const ConnectionRequest = require('../Models/connectionRequests');
const User = require('../Models/User');

requestRouter.post("/request/send/:status/:userId",userAuth,async (req,res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
 
        const user = await User.findOne({_id : toUserId});
        console.log(user);
        if(!user)
        {
            throw new Error("user not found");
        }

        const allowedStatus = ["interested" , "ignored"];
        if(!allowedStatus.includes(status))
        {
            throw new Error("status is not valid!!");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({ $or : [
            {fromUserId , toUserId},
            {fromUserId : toUserId,toUserId : fromUserId}
        ] })

        if(existingConnectionRequest)
        {
            throw new Error("cannot send connection request");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequest.save();
        res.json({
            message : "Connection Request sent successfully!!!!",
            data
        })
    }
    catch(err)
    {
        res.send("ERROR : "+err.message);
    }
})

requestRouter.post("/request/review/:status/:userId",userAuth,async (req,res) => {
    try{
        const user = req.user;
        const {status} = req.params;
        const {userId} = req.params;

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status))
        {
            throw new Error("status is not allowed");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            fromUserId : userId,
            toUserId : user._id,
            status : "interested",
        })
        console.log(connectionRequest);
        if(!connectionRequest)
        {
            throw new Error("connection request not found");
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message : status,
            data,
        })
    }
    catch(err)
    {
        res.send("ERROR :"+ err.message);
    }
})

module.exports = requestRouter;