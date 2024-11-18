const passport = require('passport');//metodos de autenticacion
const LocalStrategy = require('passport-local').Strategy;//este es el tipo de autenticacion permite por redes sociales face twi etc
const pool = require('../database');// llamo al archivo database.js
const helpers = require('./helpers');

//esta es otra autenticacion  de inicio de sesion
passport.use('local.signin',new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async(req,username,password,done)=>{
    const rows = await pool.query('SELECT * FROM users WHERE username = ?',[username]);
    if(rows.length>0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password,user.password);
        if(validPassword){
            done(null,user,req.flash('success','Bienvenido '+ user.username));
        }else{
            done(null,false,req.flash('message','Contraseña Incorrecta'));
        }
    }else{
        return done(null,false,req.flash('message','Usuario Incorrecto'));
    }
}));

//esto es para definir la autenticacion, el nombre de la autenticacion es local.signup es para crear un user
//new LocalStrategy es una instanciacion
passport.use('local.signup',new LocalStrategy({
    usernameField: 'username', //estos son los datos que recibe
    passwordField: 'password',
    passReqToCallback: true
},async(req,username,password,done)=>{ //callback es algo que se ejecuta despues de localstrategy
    //console.log(req.body);
    const {fullname} = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password); 
    const result = await pool.query('INSERT INTO users SET ?',[newUser]);
    newUser.id = result.insertId;
    return done(null,newUser); //done es un callback para que continue le doy el newUser para que lo almacene en una session
}));


//SERIALIZACION DEL USUARIO...............................
//se guarda el id de usuario
passport.serializeUser((user,done)=>{
    done(null,user.id);
});

//consulta a la base de datos para saber si el id existe y volver a obtener los datos
passport.deserializeUser(async(id,done)=>{
    const rows = await pool.query('SELECT * FROM users WHERE id = ?',[id])
    done(null,rows[0]);
});