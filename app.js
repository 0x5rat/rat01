const { Telegraf } = require('telegraf')

const token = '6284363330:AAHvDusgtQtAeuOxfMktmLyMAAXDKTEQ5fI'
const bot = new Telegraf(token)
// const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('Welcome'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

