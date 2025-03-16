const express = require('express');

const chatRouter = express.Router();
const Chat = require('../Models/chat');
const {userAuth} = require('../MiddleWares/userAuth');

chatRouter.get('/chat/:targetUserId',userAuth,async (req,res) => {
    const user = req.user;
    const userId = user._id;
    const {targetUserId} = req.params;
    try{
        let chat = await Chat.findOne({
            participants : { $all : [userId,targetUserId]},
        }).populate({
            path : "messages.senderId",
            select : "firstName lastName",
        })
        if(!chat)
        {
            chat = new Chat({
                participants : [userId,targetUserId],
                messages : [],
            });
            await chat.save();
        }
        res.json(chat);
    }
    catch(err)
    {
        res.send("ERROR : "+err.message);
    }
})

module.exports = chatRouter;