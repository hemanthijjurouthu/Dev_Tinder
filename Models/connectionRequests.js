const mongoose = require('mongoose');

const connectionRequestsSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["ignored","interested","accepted","rejected"],
            message : `{VALUE} is incorrect status type`,
        },
    },
},{timeStamps : true});

connectionRequestsSchema.pre("save",function () {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
    {
        throw new Error("you cannot send connection request to himself");
    }
})

connectionRequestsSchema.index({fromUserId : 1,toUserId : 1});

module.exports = mongoose.model("ConnectionRequest",connectionRequestsSchema);
