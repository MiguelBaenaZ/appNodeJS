/* ESTE ES EL ARCHIVO PRINCIPAL DONDE SE EJECUTA TODO */
//llamado a los modulos 
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path'); //path sirve para unir directorios 
const flash = require('connect-flash');
const session = require('express-session'); //almacena los datos en la memoria del servidor en este caso de flash
const mysqlstore = require('express-mysql-session'); // es para guardar la session dentro del servidor para el uso de flash
const passport = require('passport');
const { database } = require('./keys');

//inicializacion
const app = express();
require('./lib/passport'); //aqui se llama el passport.js

//define el puerto donde cargara el server
app.set('port',process.env.PORT || 4000);

//aqui se le dice donde esta y concatena la direccion 
app.set('views',path.join(__dirname,'views'));

// se le da el nombre al engine de .hbs y se le da uno objeto
app.engine('.hbs',exphbs({
    defaultLayout: 'main',//nombre plantilla principal
    layoutsDir: path.join(app.get('views'),'layouts'),//aqui se le da dir concatena app.get.. con 'lay...' 
    partialsDir: path.join(app.get('views'),'partials'),
    extname:'.hbs',
    helpers: require('./lib/handlebars')// este modulo solo puede usar funciones desde otro js 
}));

//para usar este motor (engine) creado debemos
app.set('view engine','.hbs');

//middlewares
app.use(session({
    secret: 'no importa',
    revase:false,
    saveUninitialized: false,
    store: new mysqlstore(database)
}));
app.use(flash());
app.use(morgan('dev'));// muestra en consola las acciones del server
app.use(express.urlencoded({extended: false}));//unrlencoded es para aceptar los datos desde los formularios false para acep solo string o int no img
app.use(express.json());// para una aplicacion cliente enviar y recibir json
app.use(passport.initialize());//para iniciarlo
app.use(passport.session());//para guardar la sesion y para manejar los datos 

//VARIABLES GLOBALES............................................
app.use((req,res,next)=>{
    app.locals.success = req.flash('success');// hace que el mensaje este disponible desde todas las vistas
    app.locals.message = req.flash('message');
    app.locals.user = req.user; //almacena o guarda el usuario activo
    next();
});

//rutas
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

//archivos publicos
app.use(express.static(path.join(__dirname,'public')));

//inicio del servidor
app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
});


