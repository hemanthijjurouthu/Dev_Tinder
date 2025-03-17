const {Server} = require('socket.io');
const Chat = require('../Models/chat');

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        socket.on('joinChat',({firstName,lastName,userId,targetUserId}) => {
            console.log(targetUserId);
            const roomId = [userId,targetUserId].sort().join("_");
            console.log(firstName + " " + lastName + " Joining Room : ",roomId);
            socket.join(roomId); 
        });

        socket.on('sendMessage',async ({firstName,lastName,userId,targetUserId,newMessage}) => {
            try{
                const roomId = [userId,targetUserId].sort().join("_");
                console.log(firstName + " " + lastName + newMessage);
                
                let chat = await Chat.findOne({
                    participants : {$all : [userId,targetUserId]},
                });

                if(!chat)
                {
                    chat = new Chat({
                        participants : [userId,targetUserId],
                        messages : [],
                    });
                }

                chat.messages.push({
                    senderId : userId,
                    text : newMessage,
                })

                await chat.save();

                io.to(roomId).emit("messageReceived", { userId,firstName,lastName,newMessage });
            }
            catch(err)
            {
                console.log("ERROR : ",err.message);
            }
        });

    });
}

module.exports = initializeSocket;