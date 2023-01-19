const express = require('express');
const app = express();
app.set('view engine' , 'ejs');
app.listen(3000);
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'))

app.get('/' , (req,res)=>{
    res.render('home');
})

app.get('/mh', (req,res)=>{
    res.render('mh');
})

app.get('/lik', (req,res)=>{
    res.render('lik');
})

app.get('/YQ', (req,res)=>{
    res.render('YQ');
})

app.get('/ti', (req,res)=>{
    res.render('ti');
})

app.get('/first-ti', (req,res)=>{
    res.render('first-ti');
})