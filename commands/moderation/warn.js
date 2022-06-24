module.exports = {
  infos: {
    name: 'warn',
    aliases: ['w'],
    usage: '<*user> <reason>',
	  description: 'Warn a user',
  },

  args: (message) => {return [true, `Please specify someone to be warned ${message.author}.`];},
  
  guildOnly: true,

  permissions: 'MANAGE_MESSAGES',

	execute: async (client, message, args, filterInput, messageReply, db) => {
    let guildData = await db.get(`${message.guild.id}`);
    
    if (!guildData || Object.keys(guildData).length === 0 && guildData.constructor === Object) {
      guildData = {warns: {},};
      await db.set(`${message.guild.id}`, guildData);
    }
    
    const target = await client.users.cache.get(filterInput(args[0])) || await client.users.cache.find(user => user.username === filterInput(args[0]));
    
    if (!target) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Warn User')
        .setDescription(`There is no user called ${args[0]}!`)
        .setFooter('If the name of the user have spaces in it try using it\'s id or mention');
      return message.channel.send(messageReply);
    }

    const bot = await message.guild.members.cache.get(client.user.id);
    const targetMember = await message.guild.members.cache.get(target.id);

    if (!targetMember) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Warn User')
        .setDescription(`There is no user called ${args[0]} in this server!`);
      return message.channel.send(messageReply);
    }

    let guildWarns = guildData.warns;

    if (!guildWarns || Object.keys(guildWarns).length === 0 && guildWarns.constructor === Object) {
      guildData.warns = {};
      guildData.warns[`${targetMember.user.id}`] = {};
      guildWarns = guildData.warns;
      await db.set(`${message.guild.id}`, guildData);
    }

    const targetWarns = guildWarns[`${targetMember.id}`];

    const messageAuthor = await message.guild.members.cache.get(message.author.id);
    const guildOwner = await message.guild.members.cache.get(message.guild.owner.user.id);

    const authorRole = messageAuthor.roles.highest.position;
    const targetRole = targetMember.roles.highest.position;
    const botRole = bot.roles.highest.position;

    let reason = 'No Reason Specified';

    if (args.length > 1) {
      reason = args.slice(1).join(' ');
    }

    if (targetMember === messageAuthor) {
      messageReply
        .setColor('RED')
        .setDescription(`What The.., why do you want to warn yourself?`);
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
        .setDescription(`Bruh, why do you want to warn me ${messageAuthor}?`);
      return message.channel.send(messageReply);
    }
    
    if (authorRole == targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Warn User')
        .setDescription(`Your role is equal to ${args[0]}, Btw ${message.author}! the guy probably notice this now so prepare yourself!`);
      return message.channel.send(messageReply);
    }
    
    if (authorRole < targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Warn User')
        .setDescription(`Your role is lower than ${args[0]}, lol ${message.author}! You'll get scolded by the user.`);
      return message.channel.send(messageReply);
    }
    
    if (botRole == targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Warn User')
        .setDescription(`My role is equal to ${args[0]}, so you need to make my role higher for me to warn the user.`);
      return message.channel.send(messageReply);
    }
    
    if (botRole < targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Warn User')
        .setDescription(`Sorry, but my role is lower than ${args[0]}, so I can't do it.`);
      return message.channel.send(messageReply);
    }

    if (!targetMember.user.bot) {
      messageReply
        .setColor('RED')
        .setTitle(`You're Warned from ${message.guild.name}`)
        .setDescription(`**Warned by:** ${messageAuthor.user.tag}\n${reason}`)
        .setTimestamp();
      await targetMember.send(messageReply);
    }

    messageReply
      .setColor('YELLOW')
      .setTitle(':warning: Warning')
      .setDescription(`<@${targetMember.user.id}> **you are warned** || **${reason}**`);
    
    if (!reason.toLowerCase().includes('test')) {
      guildData.warns[`${targetMember.user.id}`][`case${Object.keys(targetWarns).length + 1}`] = [`${messageAuthor.user.tag}`, reason];

      await db.set(`${message.guild.id}`, guildData);
    } else {
      messageReply.setFooter('Because the reason includes test then the user will not be really warned but this means the warn commands is working');
    }
    return message.channel.send(messageReply);   
	},
};