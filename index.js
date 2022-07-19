process.env.NTBA_FIX_319 = 1;
process.env.PORT||5000;
const TelegramApi = require('node-telegram-bot-api')
const {words, films, books} = require('./db')
const fs = require("fs");

const token = '5277345264:AAFfR1ZhCiO9xRwuJHGpJ3__s3puKR09i88'
const bot = new TelegramApi(token, {polling: true});

const alfabite = {
    reply_markup: JSON.stringify(
        {
            inline_keyboard:
            [                
                [{text:'A', callback_data:'A'},
                {text:'B', callback_data:'B'},
                {text:'C', callback_data:'C'},
                {text:'D', callback_data:'D'},
                {text:'E', callback_data:'E'}],

                [{text:'F', callback_data:'G'},
                {text:'G', callback_data:'G'},
                {text:'H', callback_data:'H'},
                {text:'I', callback_data:'I'}, 
                {text:'L', callback_data:'L'}],

                [{text:'M', callback_data:'M'},
                {text:'N', callback_data:'N'},
                {text:'O', callback_data:'O'},
                {text:'P', callback_data:'P'},
                {text:'R', callback_data:'R'}],

                [{text:'S', callback_data:'S'},
                {text:'T', callback_data:'T'},
                {text:'U', callback_data:'U'},
                {text:'W', callback_data:'W'},
                {text:'Y', callback_data:'Y'}],    
                
                [{text:'Числа', callback_data:'num'}], 
                [{text:'Я, ты, они...', callback_data:'pnoun'}],
                [{text:'Дни и месяцы', callback_data:'daymonth'}],
            ]
        }
    )
}

const phraseMenu = {
    reply_markup: JSON.stringify(
        {
            inline_keyboard:
            [ 
                [{text:'Фразы из фильмов...', callback_data:'filmsPhrase'}]
            ]
        }
    ) 
}
const infoText = 
`Этот бот поможет Вам изучить эльфиский язык. 

Эльфийский язык, который можно услышать в том или ином
фильме, является в действительности одним из наречий, 
придуманных Дж. Толкином.А таких более пятнадцати:
эльдарин, тэлерин, лемберин, квенья, синдарин 
(сероэльфийский),голдогрин и многие другие. Для 
каждого автор придумал расу со своей историей и ее
изменениями, в ходе которых совершенствовалась сама речь.
Мы будем изучать синдарин, самый популярный из них.
`;
const startText =
`👋Suilad, mellonegen!🧝‍♂️
Приветсвую тебя, друг мой!

I eneth nin Ihtorius. Heniog?
Меня зовут Ихториус. Понимаешь?
        
Uin? Avaro neath! Aphado nin a geliathag!
Нет? Следуй за мной и научишсья!
`;


bot.on('message', async msg =>{
    const text = msg.text;
    const chatId = msg.chat.id;
 
    if(text==="/start"){
        await bot.sendMessage(chatId, startText);
        await bot.sendSticker(chatId,'https://t.me/learnelvish/29');
        bot.sendMessage(msg.chat.id, "Выбирай одну из команд👇🏻", {
        "reply_markup": {
            'resize_keyboard' : true,
            "keyboard": [["Краткий словарь📓"], ["Список фраз🗣"], ["Письмо🪶" ], ["Список фильмов🎥", "Лорная литература 📚"]]
            }, 
        });
            const logtime = new Date(Date.now()).toLocaleString();
           fs.appendFile("logs.txt", logtime + " user:" + msg.from.first_name + "\n", function (error) {
            if (error) throw error;
        });
    }
    
    if(text==="/info"){
        await bot.sendMessage(chatId,infoText);
    }
    if(text==="Краткий словарь📓"){
        await bot.sendMessage(chatId,"Выберте нужную букву:",alfabite);
    }
    if(text==="Список фильмов🎥"){
        await bot.sendMessage(chatId,films.list);
        await bot.sendSticker(chatId,"https://chpic.su/_data/stickers/s/SmeaGollum/SmeaGollum_024.webp");
    }
    if(text==="Лорная литература 📚"){
        await bot.sendMessage(chatId,books.list);
        await bot.sendSticker(chatId,"https://chpic.su/_data/stickers/s/SmeaGollum/SmeaGollum_020.webp");
    }
    if(text==="Список фраз🗣"){
        await bot.sendMessage(chatId,films.pharses,phraseMenu);
        await bot.sendSticker(chatId,'https://t.me/learnelvish/31');
    }
    if(text==="Письмо🪶"){
        await bot.sendPhoto(chatId, "https://www.mirf.ru/wp-content/uploads/2018/04/The_One_Ring_1510632814498.jpg", {caption: films.ring});
        await bot.sendPhoto(chatId,"https://t.me/learnelvish/10", {caption:words.aboutTengwar});
        await bot.sendPhoto(chatId,"https://t.me/learnelvish/9", {caption:films.Gilthoniel});
    }
})
bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    
    if(data>="A" && data<="Y"){
        await bot.sendMessage(chatId,`Список слов на букву  '${data}'  :`);
        bot.sendMessage(chatId,words[`${data}`]);
    }
 
    if(data==="filmsPhrase"){
        await bot.sendMessage(chatId,films.dialoges);
    }

    if(data==="num"){
        await bot.sendPhoto(chatId,"https://t.me/learnelvish/14",{caption:words.numbers});        
    }

    if(data==="pnoun"){
        await bot.sendVideo(chatId,"https://t.me/learnelvish/34",{caption:words.pronouns});  
    }
    if(data==="daymonth"){
        await bot.sendMessage(chatId,words.daymonth);
        await bot.sendPhoto(chatId,"https://t.me/learnelvish/23",{caption:"Март - Sulime\nАпрель - Viresse\nМай - Lotesse"});  
        await bot.sendPhoto(chatId,"https://t.me/learnelvish/19",{caption:"Июнь - Narie\nИюль - Cermie\nАвгуст - Urime"});  
        await bot.sendPhoto(chatId,"https://t.me/learnelvish/20",{caption:"Сентябрь - Yavannie\nОктябрь - Narquelie\nНоябрь - Hisime"});  
        await bot.sendPhoto(chatId,"https://t.me/learnelvish/22",{caption:"Декабрь - Ringare\nЯнварь - Narvinye\nФевраль - Nenime"});  
    }
   
})
