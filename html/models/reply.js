const mongoose = require('mongoose');
const schema = mongoose.Schema;

const replyschema = new schema({
    reply:{
        type:String,
    },
    talkid:{
        type:String,
        ref:'talk'
    }
}, {timestamps:true});

module.exports = mongoose.model('reply' , replyschema);
