const Database = require('@replit/database');
const { Collection, MessageEmbed } = require('discord.js');

const db = new Database()

module.exports = {
	infos: {
    name: 'message',
  },

	execute : async (client, message) => {
    const messageReply = new MessageEmbed().setColor('RED');

    let guildData = await db.get(`${message.guild.id}`);

    const prefix = guildData.prefix || '>';

	  const args = message.content.slice(prefix.length).trim().split(/ +/g);
	  const commandName = args.shift().toLowerCase();

    if (!message.content.startsWith(prefix) || message.author.bot || commandName == '') return;

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.infos.aliases && cmd.infos.aliases.includes(commandName));
    
    if (!command) {
      messageReply.setDescription(`There is no command with that name or alias **\`${commandName}\`**, ${message.author}!`);
      return message.channel.send(messageReply);
    } 
    
    if (command.devsOnly && !process.env.DEVS.includes(message.author.id)) {
      messageReply.setDescription(`That command is developer exclusive only. What are you trying to do with it ${message.author}!`);
      return message.reply(messageReply);
    }

    if (command.guildOnly && message.channel.type === 'dm') {
      messageReply.setDescription('I can\'t execute that command inside DMs! It can only be executed in a server.');
	    return message.reply(messageReply);
    }

    const authorPerms = message.channel.permissionsFor(message.author);
    
    if (command.permissions &&!authorPerms || !authorPerms.has(command.permissions)) {
      messageReply.setDescription(`You lack permission to do this command, Permission required **\`${command.permissions}\`**`);
      return message.reply(messageReply);
    }
    
    if (command.args) {
      if (command.args(message)[0] && !args.length) {
        let reply = command.args(message)[1] || `You didn't provide any arguments, ${message.author}!`;

        if (command.infos.usage) {
          reply += `\nThe proper usage would be: **\`${prefix}${command.infos.name} ${command.infos.usage}\`**`;
        }

        messageReply.setDescription(reply)

        return message.channel.send(messageReply);
	    }
    }

    const { cooldowns } = client;
    
    if (!cooldowns.has(command.infos.name)) {
	    cooldowns.set(command.infos.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.infos.name);
    const cooldownAmount = (command.infos.cooldown || 2) * 1000;

    if (timestamps.has(message.author.id)) {
	    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	    if (now < expirationTime) {
		    const timeLeft = (expirationTime - now) / 1000;
        messageReply
          .setTitle(':x: Please wait, my friend')
          .setDescription(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the **\`[${command.infos.name}]\`** command.`)
          .setTimestamp();
		    return message.reply(messageReply);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    function filterInput(input) {
	    if (!input) return;

	    if (input.startsWith('<@') && input.endsWith('>')) {
		    input = input.slice(2, -1);

		    if (input.startsWith('!')) {
			    input = input.slice(1);
		    }
      } else if (input.includes('#')) {
        input = input.split('#')[0]
      }
      return input;
    }

    try {
	   return await command.execute(client, message, args, filterInput, messageReply, db); 
    } catch (error) {
	    console.error(`\nError:\n${error.stack}`);
      messageReply.setDescription('There was an error trying to execute that command, this should have never occured, please contact \`Xictaw#9899\`')
	    return message.reply(messageReply);
    }
	},
};