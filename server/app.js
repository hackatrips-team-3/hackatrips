const restify = require('restify')
const builder = require('botbuilder')

const config = require('./config')
const dispatcher = require('./dispatcher')

const connector = new builder.ChatConnector({
   appId: config.appId,
  appPassword: config.appPassword
  })

const bot = new builder.UniversalBot(connector)

bot.dialog('/', dispatcher)

const server = restify.createServer()
server.listen(8080)
server.post('/', connector.listen())
console.log('listening')