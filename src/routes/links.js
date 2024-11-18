const express = require('express');
const router = express.Router();
const pool = require('../database'); //conexion a db
const {isLoggedIn} = require('../lib/auth');//metodo para saber si hay un usuario


//CREA LA VISTA añadir link
router.get('/add',isLoggedIn,(req,res)=>{
    res.render('links/add');
});
//en esta ruta se ingresa el link
router.post('/add',isLoggedIn,async(req,res)=>{// cuando usamos en .post debemos darle algo para que de respuesta
    const { title,url,description } = req.body; //destructurando datos 
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    //ingresa los datos a la base de datos
    await pool.query('INSERT INTO links SET ?',[newLink]);
    req.flash('success','Enlace Guardo');
    res.redirect('/links');// redirecciona a la zona de links
    //res.send('recibido');//muestra un mensaje redireccionando la pag
    //console.log(newLink);
    //console.log(req.body);//aqui se muestran los valores tomados con el req.body    
});
//CREA LA LISTA DE LINKS en esta ruta es la links la principal donde el user ve sus enlaces y aqui se cargan
router.get('/',isLoggedIn,async(req,res)=>{
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?',[req.user.id]);
    console.log(links);
    res.render('links/list',{links});
});
//eliminar
router.get('/delete/:id',isLoggedIn,async(req,res)=>{
    //console.log(req.params.id);
    //res.send('eliminado');
    const {id} = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?',[id]);
    req.flash('success','Link Eliminado');
    res.redirect('/links'); 
});
//editar link
router.get('/edit/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    const link = await pool.query('SELECT * FROM links WHERE id = ?',[id]);
    console.log(link[0]);
    res.render('links/edit',{link: link[0]});
});
//reemplazar link
router.post('/edit/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params;
    const {title,description,url} = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?',[newLink,id]);
    req.flash('success','Link Editado');
    res.redirect('/links');
});
module.exports = router;