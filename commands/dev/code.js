const fs = require('fs')
const { MessageEmbed } = require('discord.js')

module.exports = {
  infos: {
    name: 'code',
    aliases: ['c'],
    usage: '<file name>',
	  description: 'See the code of an internal javascript file',
  },

	execute: async (client, message, args) => {
    const codeMessage = new MessageEmbed();

    const name = args[0].toLowerCase();
    const folders = await fs.promises.readdir('./commands').catch((err) => {return console.log(err);});

    function clean(text) {
      if (typeof(text) === "string") {
        return text.replace(/`/g, "`" + String.fromCharCode(8203));
      } else {
        return text;
      }
    }
    
    if (args.length > 1) {
       codeMessage
        .setColor('RED')
        .setTitle(':x: Cannot See Code')
        .setDescription(`\`\`\`You can only see one code per command\`\`\``)
      return message.channel.send(codeMessage);
    }

    for (const folder of folders) {
      const files = await fs.promises.readdir(`./commands/${folder}`).catch((err) => {return console.log(err);});

      if (files.includes(`${name}.js`)) {
        const fileContent = await fs.promises.readFile(`./commands/${folder}/${name}.js`, 'utf-8').catch((err) => {return console.log(err);});
        const cleanedFile = clean(fileContent);

        console.log(`**${name}.js**\n\n${cleanedFile}`)
        
        return message.channel.send(`**${name}.js**\n\n\`\`\`\js${cleanedFile}\`\`\``);
      }
    }
	},
};