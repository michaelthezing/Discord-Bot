require('dotenv').config();

const{REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
    {
        name: 'add',
        description: 'add 2 numbers',
      options:[
        {
            name: 'first-number',
            description: 'Put first mumber',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'second-number',
            description: 'put second nyumber',
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
      ]
    },

];

const rest = new REST ({version: '10'}).setToken(process.env.TOKEN);
(async () =>{
    try {
        console.log('Registering commands');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_id, process.env.GUILD_id),
            
               {body:commands}
            
        );
        console.log('Slash Commands Were Registered');
    } catch (error) {
        console.log(`error: ${error}`)
    }
})();