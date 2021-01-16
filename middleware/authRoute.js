const jwt = require('jsonwebtoken');
const { model } = require('mongoose');

module.exports = (req, res, next) => {
    const token = req.cookies.verify;
    if (!token) {
        res.redirect("/login")
    }
    try {        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
    } catch(err) {
        console.log(err);
        res.status(400);
    }
    next()  
}