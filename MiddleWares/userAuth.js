const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const userAuth = async (req,res,next) => {
    try{
        const {token} = req.cookies;
        if(!token)
        {
            return res.status(401).send("unauthorised access");
        }
        const decoded = jwt.verify(token,"Ram@1234#");
        const {_id} = decoded;
        const user = await User.findOne({_id});
        if(!user)
        {
            throw new Error("user was not found!!!");
        }
        req.user = user;
        next();
    }
    catch(err)
    {
        res.status(400).send("ERROR :"+err.message);
    }
}

module.exports = {userAuth};