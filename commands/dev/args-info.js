const { MessageEmbed } = require('discord.js')

module.exports = {
  infos: {
    name: 'args-info',
    aliases: ['arin'],
    usage: '<args>',
	  description: 'Information about the arguments provided.',
  },

  devsOnly: true,

  args: (message) => {return [true];},

	execute: async (client, message, args) => {
    const arin = new MessageEmbed().setColor('YELLOW').setTitle('Arguments Information').setDescription(`Arguments: \`\`\`yaml\n${args.join(', ')}\n\`\`\`\nArguments length: \`\`\`yaml\n${args.length}\n\`\`\``)

		message.channel.send(arin);
	},
};