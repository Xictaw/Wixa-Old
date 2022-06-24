module.exports = {
  infos: {
    name: 'ban',
    aliases: ['b'],
    usage: '<*user> <reason>',
	  description: 'Ban a user',
  },

  args: (message) => {return [true, `Please specify someone to be banned ${message.author}.`];},
  
  guildOnly: true,

  permissions: 'BAN_MEMBERS',

	execute: async (client, message, args, filterInput, messageReply, db) => {
    const target = await client.users.cache.get(filterInput(args[0])) || await client.users.cache.find(user => user.username === filterInput(args[0]));

    if (!target) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Ban User')
        .setDescription(`There is no user called ${args[0]}!`)
        .setFooter('If the name of the user have spaces in it try using it\'s id or mention');
      return message.channel.send(messageReply);
    }

    const bot = await message.guild.members.cache.get(client.user.id);
    const targetMember = await message.guild.members.cache.get(target.id)

    if (!targetMember) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Ban User')
        .setDescription(`There is no user called ${args[0]} in this server!`);
      return message.channel.send(messageReply);
    }

    const messageAuthor = await message.guild.members.cache.get(message.author.id);
    const guildOwner = await message.guild.members.cache.get(message.guild.owner.user.id);

    const authorRole = messageAuthor.roles.highest.position;
    const targetRole = targetMember.roles.highest.position;
    const botRole = bot.roles.highest.position;

    let reason = 'No Reason Specified'; 

    if (args.length > 1) {
      reason = `Reason: ${args.slice(1).join(' ')}`;
    }
    
    if (targetMember === messageAuthor) {
      messageReply
        .setColor('RED')
        .setDescription(`What The.., why do you want to ban yourself?`);
      return message.channel.send(messageReply);
    }
    
    if (targetMember === guildOwner) {
      messageReply
        .setColor('RED')
        .setDescription(`That's the server owner xD`);
      return message.channel.send(messageReply);
    }

    if (targetMember === bot) {
      messageReply
        .setColor('RED')
        .setDescription(`Bruh, why do you want to ban me ${messageAuthor}?`);
      return message.channel.send(messageReply);
    }
    
    if (authorRole == targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Ban User')
        .setDescription(`Your role is equal to ${args[0]}, Btw ${message.author}! the guy probably notice this now so prepare yourself!`);
      return message.channel.send(messageReply);
    }
    
    if (authorRole < targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Ban User')
        .setDescription(`Your role is lower than ${args[0]}, lol ${message.author}! You'll get scolded by the user.`);
      return message.channel.send(messageReply);
    }
    
    if (botRole == targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Ban User')
        .setDescription(`My role is equal to ${args[0]}, so you need to make my role higher for me to ban the user.`);
      return message.channel.send(messageReply);
    }
    
    if (botRole < targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Ban User')
        .setDescription(`Sorry, but my role is lower than ${args[0]}, so I can't do it.`);
      return message.channel.send(messageReply);
    }
    
    if (!targetMember.kickable) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Ban User')
        .setDescription(`Idk why, but I can't ban this user`);
      return message.channel.send(messageReply);
    }

    if (!targetMember.user.bot) {
      messageReply
        .setColor('RED')
        .setTitle(`You're Banned from ${message.guild.name}`)
        .setDescription(`**Banned by:** ${messageAuthor.user.tag}\n${reason}`)
        .setTimestamp();
      await targetMember.send(messageReply);
    }

    messageReply
      .setColor('GREEN')
      .setTitle(`**\`${targetMember.user.tag}\` Was Banned || ${reason}**`)
      .setDescription('');

    if (!reason.toLowerCase().includes('test')) {
      targetMember.ban();
    } else {
      messageReply.setFooter('Because the reason includes test then the user will not be really banned but this means the ban commands is working');
    }
    return message.channel.send(messageReply);    
	},
};