const jwt = require('jsonwebtoken')

exports.isAuthenticated = (req, res, next) => {
    if(req.headers.authorization == null || req.headers.authorization == ""){
        return res.status(401).json("Unauthorized access")
    }
    // const token = req.headers.authorization.split(" ");
    jwt.verify(req.headers.authorization, process.env.SECRET, (err, data) => {
        if(err){
            return res.status(401).json({
                error:err.message
            })
        }
        req.auth = data;
        next();
    })
}