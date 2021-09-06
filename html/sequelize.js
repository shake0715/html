const Sequelize = require('sequelize');

const sequelize = new Sequelize('node' , 'root' , 'Lotus6061830133-' ,{
    dialect:'mysql',
    host:'localhost'
})

module.exports = sequelize;