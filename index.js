const Telegraf = require('telegraf');
const HttpsProxyAgent = require('https-proxy-agent');

const cfg = require('./helpers/config');
const otkrivator = require('./helpers/otkrivator');
const jitsi = require('./helpers/jitsi');
const myself = require('./helpers/myself');

const bot = new Telegraf(cfg.TG_TOKEN, {
    telegram: {
        agent: new HttpsProxyAgent('http://svg:svgpassw0rd@vslugin.ru:3128')
    }
});

const action = async (userId, userName, action) => {
    const ACCESS_DENIED_MESSAGE = userName + ', Вам доступ запрещён. Сообщите ваш ID для добавления полномочий: ' + userId;
    const WELCOME_MESSAGE = [
        'Добро пожаловать, ' + userName,
        'Действия:',
        'Статус Jitsi: /jh',
        'Открыть ВЦ: /open_vc',
        'Открыть мастерские: /open_m',
        'Самооценка: /myself',
    ].join('\n');

    const MYSELF_MENU_L1 = [
        'Самооценка:',
        'Просмотр: /myselfList',
        'Добавить: /myselfNew',
    ].join('\n');

    const ACTION = (action) ? action : '*';
    // check access
    if (cfg.VALID_USERS.indexOf(userId) === -1) {
        return ACCESS_DENIED_MESSAGE;
    }

    switch (action) {
        case 'start':
            return WELCOME_MESSAGE;
        case 'open_vc':
            return await otkrivator.openItPark();
        case 'jh':
            return userName + ', ' + await jitsi.health();
        case 'open_m':
            return await otkrivator.openMasterskie();
        case 'myself':
            return MYSELF_MENU_L1;
        case 'myselfList':
            return myself.list(userId, userName);
        case 'myselfNew':
            return myself.new(userId, userName);
        case '*':
            return 'test';
    }

};

bot.start(async (ctx) => {
    ctx.reply(await action(ctx.from.id.toString(), ctx.from.first_name, 'start'));
});

bot.command('open_vc', async (ctx) => {
    ctx.reply(await action(ctx.from.id.toString(), ctx.from.first_name, 'open_vc'));
});

bot.command('jh', async (ctx) => {
    ctx.reply(await action(ctx.from.id.toString(), ctx.from.first_name, 'jh'));
});

bot.command('open_m', async (ctx) => {
    ctx.reply(await action(ctx.from.id.toString(), ctx.from.first_name, 'open_m'));
});

bot.command('myself', async (ctx) => {
    ctx.reply(await action(ctx.from.id.toString(), ctx.from.first_name, 'myself'));
});

bot.command('myselfList', async (ctx) => {
    ctx.replyWithMarkdown(await action(ctx.from.id.toString(), ctx.from.first_name, 'myselfList'));
});

bot.command('myselfNew', async (ctx) => {
    ctx.reply(await action(ctx.from.id.toString(), ctx.from.first_name, 'myselfNew'));
});


// dfl
// bot.start((ctx) => ctx.reply('Welcome'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));
// bot.on('sticker', (ctx) => ctx.reply('👍'));
// bot.hears('hi', (ctx) => ctx.reply('Hey there'));
// bot.hears('Ебот?', (ctx) => ctx.reply('Да, я тут. Твои возможности: /new'));
// bot.hears('/new', (ctx) => ctx.reply('Ага'));



bot.launch();
