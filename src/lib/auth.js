//CREACION DE METODO PARA VERIFICAR EL ESTADO ACTIVO DE UN USER
module.exports = {
    isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/signin');
    },
    isNotLoggedIn(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('profile');
    }
};