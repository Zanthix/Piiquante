const jsonWebToken = require('jsonwebtoken');
require('dotenv').config()

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jsonWebToken.verify(token, process.env.JWT_RANDOM_TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    }catch(error){
        res.status(401).json({error});
    }
};