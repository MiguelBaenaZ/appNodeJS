//se importa el metodo formt el cual me da "el hace cuanto se creo"
const {format} = require('timeago.js');

//creo un objeto el cual voy a usar desde las vistas
const helpers = {};

//a el objeto helpers le añado un metodo
helpers.timeago = (timestamp)=>{
    return format(timestamp);
}

//asi se exporta el timeago
module.exports = helpers;