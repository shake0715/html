const express = require('express');
const app = express();
app.set('view engine' , 'ejs');
app.listen(3000);
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'))

app.get('/' , (req,res)=>{
    res.render('home');
})

app.get('/about', (req,res)=>{
    res.render('about');
})

app.get('/language', (req,res)=>{
    res.render('language');
})

app.get('/1' ,(req,res)=>{
    res.render('1');
})