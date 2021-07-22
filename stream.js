const fs = require('fs');

const readStream = fs.createReadStream('./word1.txt' , {encoding:'utf8'});
const writestream = fs.createWriteStream('./word2.txt');

readStream.on('data' , (chunk) =>{
    console.log('-----------------------NEW CHUNK-------------------');
    console.log(chunk);
    writestream.write('\nNEW\n');
    writestream.write(chunk);
})

readStream.pipe(writestream);