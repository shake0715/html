const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

const user = sequelize.define('user',{
    email:{
        type:Sequelize.STRING,
        require:true
    },
    resettoken:{
        type:Sequelize.STRING
    },
    /*resettokenexpiration:{
        type:Sequelize.DATE
    },*/
    password:{
        type:Sequelize.STRING,
        require:true
    }
});

module.exports = user ;