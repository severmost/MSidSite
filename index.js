const telegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions } = require('./options');
const token = '6633531809:AAEaJBaD_EDlxWiqQA08lROGiZM9E6wi5ac';
const bot = new telegramApi(token, { polling: true });
const chats = {};

bot.setMyCommands([
    { command: '/start', description: 'Начало работы' },
    { command: '/info', description: 'Информация' },
    { command: '/game', description: 'Угадайка' },
]);
const startGame = async (chatId) => {
	await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты должен угадать');
	const randomNumber = Math.floor(Math.random() * 10);
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
};
const start = () => {
	bot.on('message', async (msg) => {
		const text = msg.text;
		const chatId = msg.chat.id;
		if (text === '/start') {
			await bot.sendSticker(
				chatId,
				'https://stickerswiki.ams3.cdn.digitaloceanspaces.com/originalsailormoon/210955.512.webp'
			);
			return bot.sendMessage(chatId, `Добро пожаловать в тг бот MSid`);
		}
		if (text === '/info') {
			return bot.sendMessage(
				chatId,
				`Тебя зовут ${msg.from.first_name} ${msg.from.last_name ? msg.from.last_name : ''}`
			);
		}
		if (text === '/game') {
			return startGame(chatId);
		}
		return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!');
	});
	bot.on('callback_query', (msg) => {
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (data == '/again') {
			return startGame(chatId);
		}
		if (data == chats[chatId]) {
			return bot.sendMessage(chatId, 'Верно!', againOptions);
		} else {
			return bot.sendMessage(chatId, `Неверно! Было загадано ${chats[chatId]}`, againOptions);
		}
	});
};

start();
