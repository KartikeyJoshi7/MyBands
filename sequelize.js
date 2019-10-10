const Sequelize = require('sequelize')
const sequelize = new Sequelize('MyBands', 'kartikey', '123456', {
  dialect: 'sqlite',
  storage: './db.sqlite3'
})

module.exports = sequelize 