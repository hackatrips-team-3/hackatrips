const restify = require('restify')
const builder = require('botbuilder')

const config = require('./config')

const connector = new builder.ChatConnector({
   appId: config.appId,
  appPassword: config.appPassword
  })

const bot = new builder.UniversalBot(connector)

bot.dialog('/', function (session) {
  console.log(session.message)
})

const server = restify.createServer().listen(8080)
server.post('/', connector.listen())