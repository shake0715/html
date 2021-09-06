const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

const user = sequelize.define('user',{
    email:{
        type:Sequelize.STRING,
        require:true
    },
    password:{
        type:Sequelize.STRING,
        require:true
    }
});

module.exports = user ;