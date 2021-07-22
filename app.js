const express = require('express');

const app = express();

app.set('view engine' , 'ejs');

app.listen(3000);

app.get('/',(req,res) =>{
   res.render('first' , {title: 'Home'});
})

app.get('/about',(req,res) =>{
    res.render('about', {title: 'about'});
 })

 app.get('/blogs/create',(req,res) =>{
     res.render('create', {title: 'create a new blog'});
 })

 app.use((req,res) =>{
    res.status(404).render('404', {title: '404'});
 })