require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js'); //client is our bot //intennts bit field is intent of bot
//each intent has a set of invents
const { Configuration, OpenAIApi } = require('openai');
const mongoose = require('mongoose')
const axios = require('axios');

const client = new Client({ //creates a new client and sets its intents to the guild: guild is a server
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages, //reads messages
        IntentsBitField.Flags.GuildMembers, //reads memebers
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    if(interaction.commandName === 'add')
    {
        const number1 = interaction.options.get('first-number').value;
        const number2 = interaction.options.get('second-number').value;
        interaction.reply(`The sum is ${number1+number2}`);
    }
   
});

client.on('ready', (c) =>{
    console.log(`IM READY IM READY IM READY ${
    c.user.tag //gives bot user name 
    } is online`  );
    client.user.setActivity({
        name: "Bikini Bottom Video Game"
    });
});//on has list of commands the bot can run, ready listens to the bot when its ready

const configuration = new Configuration({ //sets the configuration as the api key in env
    apikey: process.env.API_KEY
})

const openai = new OpenAIApi(configuration); //open ai takes the api key and stores it
client.on ('messageCreate', async(MSG) =>{ //occucrs whenever a message is typed
    if(MSG.content == "hello" || MSG.content == "hi" || MSG.content == 'hey') //if hello the prompt will show
    {
        MSG.reply('LEEDLE LEEDLE LEE');
    }
    if(MSG.author.bot) return; //if its a bots messaged it just returns, if it doesn return itll constantly run
    if(MSG.channel.id !== process.env.CHANNEL_ID) return; //if the channel the bot is in isnt in the specified channel ide
    if(MSG.content.startsWith('!')){ //if thr message startws with ! then return

  let conversationlog = [{role: 'system', content:'You are a friendly chatbot.'}] //sets the role of the bot to system and makes the bot act friendly
  conversationlog.push({
    role: 'user',
    content: MSG.content //pushes the content of the message on the bot
  });
   await MSG.channel.sendTyping(); //after the content is pushed the typing icon wil appear 
  
  try {
    const result = await openai.createChatCompletion({ //
        model: "gpt-3.5-turbo",  //uses the turbo model
        messages: conversationlog //takes in conversation log
    }); 
    MSG.reply(result.data.choices.message); //replies to the conversation log

} catch (error) {
    console.log(`Error ${error}`);
}
    }

   });
   client.on('guildMemberAdd', (member) => {
    
    const welcomeChannel = member.guild.channels.cache.get(process.env.CHANNEL_ID);
    if (welcomeChannel) {
      welcomeChannel.send(`Hi ${member}, welcome to the server!`);
    }
  });

  client.on('guildMemberRemove', (member) => {
    const channel = member.guild.channels.cache.find(channel => channel.name === process.env.CHANNEL_ID); 
    if (!channel) return; // If the 'goodbye' channel is not found, do nothingn
    channel.send(`Goodbye, ${member.user.tag}! We will miss you! :wave:`);
  });

  const getInspirationalQuote = async () => {
    try {
      const response = await axios.get('https://zenquotes.io/api/random');
      const quote = response.data[0].q;
      return quote;
    } catch (error) {
      console.error('Error fetching inspirational quote:', error.message);
      return null;
    }
  };
  
  const sendInspirationalQuote = async (channel) => {
    const quote = await getInspirationalQuote();
    if (quote) {
      channel.send(`Inspirational Quote:\n\n${quote}`);
    }
  };

  
  client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === '?quote') {
      sendInspirationalQuote(message.channel);
    } else if (message.content.toLowerCase() === '?help') {
      const commands = [
        '?quote - Get an inspirational quote.',
        '?help - Show a list of available commands.',
        '/add - Adds 2 inputed numbers together.'
        
        // Add more commands here if you have any additional functionalities.
      ];
      message.channel.send(commands.join('\n'));
    }
    
  });
  
client.login(process.env.TOKEN); //tokenn




