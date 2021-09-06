const mongoose = require('mongoose');
const schema = mongoose.Schema;

const talkschema = new schema({
    name:{
        type:String,
    },
    talk:{
        type:String,
    }
}, {timestamps:true});

const Star = mongoose.model('Star' , talkschema);
module.exports = Star;