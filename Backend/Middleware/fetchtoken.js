var jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function(req, res, next) {
    const token = req.header('token');
    if (token) {
        return jwt.verify(token, JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(401).json({"error":"true","msg":"Unauthorized access" , err});
            }
            req.user = decoded;
            return next();
        });
    }
    return res.status(401).json({"error":"true","msg":"Unauthorized access"});
};