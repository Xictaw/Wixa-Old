const ms = require('ms');

module.exports = {
  infos: {
    name: 'tempmute',
    aliases: ['tmp'],
    usage: '<*user> <reason> <duration s(seconds)/m(minutes)/h(hours)>',
	  description: 'Mute a user for a specific duration of time',
  },

  args: (message) => {return [true, `Please specify someone to be tempmuted ${message.author}.`];},
  
  guildOnly: true,

  permissions: ['MANAGE_MESSAGES', 'MANAGE_ROLES'],

	execute: async (client, message, args, filterInput, messageReply, db) => {
    const target = await client.users.cache.get(filterInput(args[0])) || await client.users.cache.find(user => user.username === filterInput(args[0]));

    let guildData = await db.get(`${message.guild.id}`);

    const muterole = guildData.muterole;

    if (!target) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Tempmute User')
        .setDescription(`There is no user called ${args[0]}!`)
        .setFooter('If the name of the user have spaces in it try using it\'s id or mention');
      return message.channel.send(messageReply);
    } 

    const bot = await message.guild.members.cache.get(client.user.id);
    const targetMember = await message.guild.members.cache.get(target.id);

    if (!targetMember) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Tempmute User')
        .setDescription(`There is no user called ${args[0]} in this server!`);
      return message.channel.send(messageReply);
    }

    const messageAuthor = await message.guild.members.cache.get(message.author.id);
    const guildOwner = await message.guild.members.cache.get(message.guild.owner.user.id);

    const authorRole = messageAuthor.roles.highest.position;
    const targetRole = targetMember.roles.highest.position;
    const botRole = bot.roles.highest.position;

    let reason = 'No Reason Specified';
    const time = args.slice(-1).toString() || '1m'

    if (args[1]) {
      reason = `Reason: ${args.slice(1, -1).join(' ')}`;
    }

    if (targetMember === messageAuthor) {
      messageReply
        .setColor('RED')
        .setDescription(`What The.., why do you want to tempmute yourself?`);
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
        .setDescription(`Bruh, why do you want to tempmute me ${messageAuthor}?`);
      return message.channel.send(messageReply);
    }
    
    if (authorRole == targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Tempmute User')
        .setDescription(`Your role is equal to ${args[0]}, Btw ${message.author}! the guy probably notice this now so prepare yourself!`);
      return message.channel.send(messageReply);
    }
    
    if (authorRole < targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Tempmute User')
        .setDescription(`Your role is lower than ${args[0]}, lol ${message.author}! You'll get scolded by the user.`);
      return message.channel.send(messageReply);
    }
    
    if (botRole == targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Tempmute User')
        .setDescription(`My role is equal to ${args[0]}, so you need to make my role higher for me to tempmute the user.`);
      return message.channel.send(messageReply);
    }
    
    if (botRole < targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Tempmute User')
        .setDescription(`Sorry, but my role is lower than ${args[0]}, so I can't do it.`);
      return message.channel.send(messageReply);
    }

    if (!muterole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Tempmute User')
        .setDescription(`**You haven't even set the tempmute role so how can you tempmute someone? Please set it with ${process.env.PREFIX}muterole**`);
      return message.channel.send(messageReply);
    }

    messageReply
      .setColor('GREEN')
      .setTitle(`**\`${targetMember.user.tag}\` Was Tempmuted || ${reason}** || **Duration:** ${time}`)
      .setDescription('');

    await targetMember.roles.add(muterole);

    await message.channel.send(messageReply);
    
    if (!targetMember.user.bot) {
      messageReply
        .setColor('RED')
        .setTitle(`You're Tempmuted from ${message.guild.name}`)
        .setDescription(`**Tempmuted by:** ${messageAuthor.user.tag}\n**Duration:** ${time}\n${reason.replace('Reason:', '**Reason:**')}`)
        .setTimestamp();
      await targetMember.send(messageReply);
    }

    return setTimeout(async function (){
      await targetMember.roles.remove(muterole);
      await messageReply
        .setColor('GREEN')
        .setTitle(`You're unmuted from **${message.guild.name}**`)
        .setDescription('You have been unmuted since your mute durations have come to an end')
        .setTimestamp();
      await targetMember.send(messageReply);
    }, ms(time));

	},
};