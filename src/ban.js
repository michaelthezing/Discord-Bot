const {Client, Interaction,ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");


module.exports = {
 /**
  * 
  * @param {Client} client 
  * @param {Interaction} interaction 
  */
    callBack:async(client, interaction) =>{
        const targetuserID = interactions.options.get('kick-user').value;
        const reason = interactions.options.get('reason').value;
       
        await interaction.deferReply();
        const targetuser = await interaction.guild.user.members.fetch(targetuserID)

        if(!targetuser)
        {
            await interaction.editReply('That user is not in the server silly');
            return;
        }
        if(targetuser.id === interaction.guild.ownerId)
        {   
             await interaction.editReply('You cannot kick the owner');
            return;
        }
        try {
            await targetuser.ban({reason})
            await interaction.editReply(`The user ${targetuser} was banned\nReason: ${reason}`)
        } catch (error) {
            console.log(`There is an error ${errror}`)
        }
    },
    name: 'kick',
    description: 'Kick Person from Server',
    options:[
        {
            name: "Kick-User",
            description: 'The user you want gone',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "reason",
            description: 'Why do you want to Kick them?',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
    
}