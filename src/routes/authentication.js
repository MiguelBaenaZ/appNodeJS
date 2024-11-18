const express = require('express');
const router = express.Router();
const passport = require('passport');//llamo al archivo passport.js

const {isLoggedIn,isNotLoggedIn} = require('../lib/auth');//metodo para saber si hay un usuario

//REGISTRO DE USUARIO...............................................
router.get('/signup',isNotLoggedIn,(req,res)=>{
    res.render('auth/signup');
});

router.post('/signup',passport.authenticate('local.signup',{
        successRedirect:'/profile', 
        failureRedirect:'/signup',        
        failureFlash:true
}));

/* OTRA FORMA DE HACER EL ROUTER.POST ANTERIOR
router.post('/signup',(req,res)=>{
    passport.authenticate('local.signup',{
        successRedirect:'/profile', //aqui lo envia cuando todo esta funcionando bien
        failureRedirect:'/signup', //lo manda de nuevo a inicio de sesion
        failureFlash:true
    });
    //console.log(req.body);
    //res.send('recibido');
}); */

//INICIO DE SESION...............................................
router.get('/signin',isNotLoggedIn,(req,res)=>{
    res.render('auth/signin');
});

router.post('/signin',(req,res,next)=>{
    passport.authenticate('local.signin',{
        successRedirect:'/profile',
        failureRedirect:'signin',
        failureFlash:true
    })(req,res,next);
});

router.get('/profile',isLoggedIn,(req,res)=>{
    res.render('profile');
});

//CIERRE DE SESION...............................................
router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;