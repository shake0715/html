const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

const people = sequelize.define('people',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING
    },
    talk:{
        type:Sequelize.STRING
    }
});

module.exports = people ;