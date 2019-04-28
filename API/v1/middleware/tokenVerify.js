const jwt = require("jsonwebtoken");


//Verify the token and request data from it
module.exports = (req,res,next) =>{
    try{
        let token = {}
        //Splits token from the Bearer
        if(req.headers.authorization){
            token = req.headers.authorization.split(" ")[1];
        }
        else if (req.query.token){
            token = req.query.token;
        }
        //Attempts to decode the token
        const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET, null);
        //The resulting data from the decoding is set in req
        req.userData = decoded;
        return next();
    }
    catch(error){
        return res.status(401).json({message: "Not verified user, please login and add the token"});
    }
};
