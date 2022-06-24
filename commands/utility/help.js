const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  infos: {
    name: 'help',
    aliases: ['h', 'commands'],
    usage: '[command name]',
	  description: 'List of all of my commands or info about specific command',
  },
  
	execute: async (client, message, args) => {
    const data = new MessageEmbed()

    if (!args.length) {
      data
        .setColor('BLUE')
        .setTitle(`${client.user.username} Commands List`)
        .addField('**Prefix :**', `\`\`\`yaml\n${process.env.PREFIX}\n\`\`\``, true)
        .setFooter(`Use ${process.env.PREFIX}help [command name] to display specific command | Help command by Xictaw#9899`);

      const commandFolders = await fs.promises.readdir('./commands')

      for (const folder of commandFolders) {
        const fixedFiles = [];
        const commandFiles = await fs.promises.readdir(`./commands/${folder}`)
        const jsCommandFiles = commandFiles.filter(file => file.endsWith('.js'));

        for (file of jsCommandFiles) {
          fixedFiles.push(file.split('.js').join(''));
        }
        data.addField(`**${folder.toUpperCase()} Commands**`, `\`\`\`yaml\n${fixedFiles.join(', ')}\n\`\`\``);
      }
      return message.channel.send(data);
    } else {
      const name = args[0].toLowerCase();
      const command = client.commands.get(name) || client.commands.find(c => c.infos.aliases && c.infos.aliases.includes(name));
      
      data.setColor('GREEN');

      if (!command) {
        data
          .setColor('RED')
          .setDescription('There is no command with that name!')
	      return message.reply(data);
      }

      data
        .setTitle(`${command.infos.name.toUpperCase()} Specification`)
        .addField('**Name:**', `\`${command.infos.name}\``)
        .setFooter(`Use ${process.env.PREFIX}help to display all commands | Help command by Xictaw#9899`);

      if (command.infos.aliases) data.fields.push({name: '**Aliases:**',value: `\`${command.infos.aliases.join(', ')}\``});
      if (command.infos.description) data.fields.push({name: '**Description:**',value: `\`${command.infos.description}\``});
      if (command.infos.usage) data.fields.push({name: '**Usage:**',value: `\`${process.env.PREFIX}${command.infos.name} ${command.infos.usage}\``});

      return message.channel.send(data);
    }
  },  
};