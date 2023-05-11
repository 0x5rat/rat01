import { Telegraf, Markup} from 'telegraf'

const MONGO = 'mongodb+srv://0x5rat:jMKqo7t80in2Yn4g@cluster0.vtba2mq.mongodb.net/?retryWrites=true&w=majority'
import mongoose from 'mongoose'
mongoose.connect(MONGO);

const Cat = mongoose.model('Cat', { 
  id: String,
  first_name: String,
  username: String,
  rat: String,
  context: String
})
// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));

async function getOrCreateRat(loginOptions, ctx) {
  let cat
  cat = await Cat.findOne({id: loginOptions.id})
  console.log(cat)
  if (!cat) {
    if (!(loginOptions.id || loginOptions.first_name || loginOptions.username)) {
      ctx.reply('нет каких-то данных на вашем аккаунте')
      return
    }
    cat = (await new Cat({
      id: loginOptions.id,
      first_name: loginOptions.first_name,
      username: loginOptions.username,
      rat: '{}',
      context: 'name'
    }).save())
    ctx.reply('Приветсткую в симулякре крысиных авантюр. Альфа версия. Введите имя для вашего крыса:')
    return 'name'
  }
  return cat
}

const token = '6284363330:AAHvDusgtQtAeuOxfMktmLyMAAXDKTEQ5fI'
const bot = new Telegraf(token)

bot.use(async (ctx, next) => {
  const loginOptions = {
    id: `${ctx.message.chat.id}`,
    first_name: ctx.message.chat.first_name,
    username: ctx.message.chat.username
  }
  let rat = await getOrCreateRat(loginOptions, ctx)
  ctx.rat = rat
  if (rat === 'name') {
    return
  }

  if (rat.context === 'name') {
    if (ctx.message.text.length > 10) {
      ctx.reply('имя не может быть больше десяти букв')
      return
    }
    rat.context = ''
    rat.rat = JSON.stringify({
      name: ctx.message.text,
      cheese: 0
    })
    ctx.reply(
      `Имя успешно выбрано: ${ctx.message.text}`,
      Markup.keyboard([
        [
          Markup.button.callback('крыса', 'start'),
          // Markup.button.callback('покормить крысу', 'stop'),
          Markup.button.callback('выйти на поиски пищи', 'start'),
        ],
        [
          Markup.button.callback('главная', 'start2'),
        ]
      ]),
    )
    await rat.save()
    return
  } else {
    await next()
  }
})

bot.hears('выйти на поиски пищи', async (ctx) => {
  let pet = JSON.parse(ctx.rat.rat)
  ctx.reply('Идете искать сыр, тут можно сделать ожидание в минутах/что-то такое.')
  ctx.reply('Вернулись с сыром 🧀, +1')
  pet.cheese += 1
  ctx.rat.rat = JSON.stringify(pet)
  await ctx.rat.save()
})

bot.hears('главная', (ctx) => {
  ctx.reply(
    'Вернулись на главную страницу',
    Markup.keyboard([
      [
        Markup.button.callback('крыса', 'start'),
        // Markup.button.callback('покормить крысу', 'stop'),
        Markup.button.callback('выйти на поиски пищи', 'start'),
      ],
      [
        Markup.button.callback('главная', 'start2'),
      ]
    ]),
  )
});

bot.hears('крыса', async (ctx) => {
  let rat = JSON.parse(ctx.rat.rat)
  ctx.reply(`Информация о вашей крысе:
Имя: ${rat.name}
Количество сыра: ${rat.cheese}`)
})

bot.launch()

/*
async function getOrCreateRat(loginOptions: LoginOptions) {
  if (!loginOptions.id) {
    throw new Error()
  }
  let rat: DocumentType<Rat> | undefined
  rat = await RatModel.findOne({ id: loginOptions.id })
  console.log(rat)
  if (!rat) {
    if (!(loginOptions.id || loginOptions.first_name || loginOptions.username)) {
      throw new Error()
    }
    rat = (await new RatModel({
      id: loginOptions.id,
      first_name: loginOptions.first_name,
      username: loginOptions.username,
      rat: '',
      context: ''
    }).save()) as DocumentType<Rat>
  }
  return rat
}
export {RatModel, getOrCreateRat}
*/

