const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

const ask = sequelize.define('ask',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    reply:{
        type:Sequelize.STRING,
    }
});

module.exports = ask ;