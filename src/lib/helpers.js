//AQUI VAMOS A GUARDAR VARIOS METODOS para exportarlos
const bcrypt = require('bcryptjs');
const helpers = {}

//metodo para encriptar la clave ingresada por el usuario
helpers.encryptPassword = async(password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    return hash;
};

//metodo para comparar la clave encriptada con la clave en el login
helpers.matchPassword=async(password,savedPassword)=>{
    try{
        return await bcrypt.compare(password,savedPassword);
    } catch(e){
        console.log(e);
    }
};

module.exports = helpers;