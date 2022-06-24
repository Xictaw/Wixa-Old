const { MessageEmbed } = require('discord.js')

module.exports = {
  infos: {
    name: 'shutdown',
    aliases: ['s'],
	  description: 'Shutdown the bot',
  },

  devsOnly: true,

	execute: async (client, message, args) => {
    const sMessage = new MessageEmbed();

    try {
      sMessage
        .setColor('BLUE')
        .setTitle(`Shutting Down ${client.user.tag}`);
      await message.channel.send(sMessage);

      return process.exit();
    }catch(error) {
      sMessage
        .setColor('RED')
        .setTitle(':x: Error :x:')
        .setDescription(`**\`\`\`yaml\n${error}\n\`\`\`**`);
      return message.channel.send(sMessage);
    }
	},
};