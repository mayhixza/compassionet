const User = require('../models/User.js');
const path = require('path');
const jwt = require("jsonwebtoken");

const getUserID = async function(req,res,next){
    //redirect if not logged in
    if(!req.cookies.verify){
        return res.redirect("/login");
    }
    let token = req.cookies.verify;
    let userid;
    jwt.verify(token,process.env.JWT_SECRET,(err, authData) => {
        if(err){
            return res.redirect('/logout');    
        }
        if(authData._id){
            userid = authData._id;
        }else{
            userid = authData.id;
        }
    });
    req.id = userid;
    next();
}

module.exports =  { getUserID }