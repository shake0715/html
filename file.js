const fs = require('fs');

/*fs.readFile('./word.txt',(err,data) =>{
    if(err)
    {
        console.log(err);
    }
    console.log(data.toString());
})
setTimeout(() =>{
    console.log('hey');
},500)*/

fs.writeFile('./word.txt', 'I am a handsome guy', ()=>{
    console.log('finished');
})
/*if(!fs.existsSync('./folder')){
    fs.mkdir('./folder',(err) =>{
        if(err){
            console.log(err);
        }
        console.log('created');
    });
}
else{
    fs.rmdir('./folder',(err) =>{
        if(err)
        {
            console.log(err);
        }
        console.log('delete');
    })
}*/

if(fs.existsSync('./folder/deleteme.txt')){
    fs.unlink('./folder/deleteme.txt',(err) =>{
        if(err)
        {
            console.log(err);
        }
        console.log('delete');
    })
}