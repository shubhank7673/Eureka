const express = require('express');

const router = express.Router();

router.use((req,res,next) =>{
    if(!req.session.isLoggedIn){
        res.redirect('/login');
    }else{
        next();
    }
});

module.exports = router;