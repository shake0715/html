const express = require('express');
const puppeteer = require('./puppeteer');
//const fs= require('fs');
const app = express();
app.set('view engine' , 'ejs');
var port=process.env.PORT;
app.listen(port);
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'))

app.get('/home' , (req,res)=>{
    res.render('home');
})

app.get('/game' , (req,res)=>{
    puppeteer.getScoreboard().then(()=>{
        const arr = [];
        for(let i=0;i<puppeteer.map.length;i++){
            arr.push(parseInt(puppeteer.map[i], 10))
        }
        res.render('game',{score:arr});
    })
    /*fs.readFile("./test.txt",(error,data)=>{
        if(error){
            console.log(error)
        }
        else{
            const score = data.toString();
            const arr = [];
            let str="";
            let begin=0;
            for(let i=0;i<score.length;i++){
                if(score[i]==','){
                    arr.push(parseInt(str, 10))
                    str=""
                }
                else{
                    str+=score[i]
                }
            }
            arr.push(str)
            res.render('game',{score:arr});
            console.log(arr)
        }
    })*/
})

app.get('/day' , (req,res)=>{
    res.render('day');
})


app.get('/team' , (req,res)=>{
    res.render('team');
})
app.get("/name/:id",(req,res)=>{
    const name = req.params.id;
    if(name=="curry"){
        res.render('curry');
    }
    else if(name=="klay"){
        res.render('klay');
    }
    else if(name=="green"){
        res.render('green');
    }
})
