const {gameOptions, againOptions} = require('./options')
const TelegramAPI = require('node-telegram-bot-api')
const token = '6014835512:AAFix25M1wlzWsOdXVrHycXdjkaRXd3nuls'

const bot = new TelegramAPI(token, {polling:true})
const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Guess the number of the current situation')
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Guess!', gameOptions)
}

bot.setMyCommands([
  {command:'/start', description:'opening greeting'},
  {command:'/info', description:'About your profile'},
  {command:'/game', description:'Guess the number'},
])

const start = () => {
  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    if(text === '/start'){
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/98d/f8f/98df8f25-ff80-46f0-9d18-6e0bc21334ac/4.webp')
      return bot.sendMessage(chatId, `We have too much commands like /start /info and other`)
    }
    if(text === '/info'){
      return  bot.sendMessage(chatId, `Your name ${msg.from.username}`)
    }
    if(text === '/game'){
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'There are no similar commands here at all!')

  })

  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if(data === '/again'){
      return startGame(chatId)
    }

    if(data === chats[chatId]){
      return bot.sendMessage(chatId, `That's a right guess ${chats[chatId]}`, againOptions)
    }else{
      return bot.sendMessage(chatId, `The answer isn't right it was ${chats[chatId]} `, againOptions)
    }
  })

}
start()

