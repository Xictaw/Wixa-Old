module.exports = {
    infos: {
      name: 'unmute',
      aliases: ['umt'],
      usage: '<*user> <reason>',
      description: 'Unmute a user',
    },

    args: (message) => {return [true, `Please specify someone to be unmuted ${message.author}.`];},

    guildOnly: true,

    permissions: 'MANAGE_ROLES',


  execute: async (client, message, args, filterInput, messageReply, db) => 
  {
    const target = await client.users.cache.get(filterInput(args[0])) || await client.users.cache.find(user => user.username === filterInput(args[0]));

    let guildData = await db.get(`${message.guild.id}`);
    
    const muterole = guildData.muterole;

    if (!target) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Unmute User')
        .setDescription(`There is no user called ${args[0]}!`)
        .setFooter('If the name of the user have spaces in it try using it\'s id or mention');
      return message.channel.send(messageReply);
    } 

    const bot = await message.guild.members.cache.get(client.user.id);
    const targetMember = await message.guild.members.cache.get(target.id);

    if (!targetMember) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Unmute User')
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
      reason = `**Reason:** ${args.slice(1).join(' ')}`;
    }

    if (targetMember === messageAuthor) {
      messageReply
        .setColor('RED')
        .setDescription(`Nice try but, You can't unmute yourself LOL.`);
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
        .setDescription(`I'm not muted so you can't unmute me xD`);
      return message.channel.send(messageReply);
    }
    
    if (authorRole == targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Unmute User')
        .setDescription(`Your role is equal to ${args[0]}, ${message.author}! you need a higher role to unmute him.`);
      return message.channel.send(messageReply);
    }
    
    if (authorRole < targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Unmute User')
        .setDescription(`Your role is lower than ${args[0]}, ${message.author}! so don't even try to unmute him`);
      return message.channel.send(messageReply);
    }

    if (botRole == targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Unmute User')
        .setDescription(`My role is equal to ${args[0]}, so you need to make my role higher for me to unmute the user.`);
      return message.channel.send(messageReply);
    }
    
    if (botRole < targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Unmute User')
        .setDescription(`Sorry, but my role is lower than ${args[0]}, so I can't do it.`);
      return message.channel.send(messageReply);
    }

    if (!targetMember.user.bot) {
      messageReply
        .setColor('RED')
        .setTitle(`You're Unmuted from ${message.guild.name}`)
        .setDescription(`**Unmuted by:** ${messageAuthor.user.tag}\n${reason}`)
        .setTimestamp();
      await targetMember.send(messageReply);
    }

    messageReply
      .setColor('GREEN')
      .setTitle(`**\`${targetMember.user.tag}\` Was Unmuted || ${reason}**`)
      .setDescription('');

    if (!reason.toLowerCase().includes('test')) {
      if (!muterole) {
        messageReply
          .setColor('RED')
          .setTitle(`**You haven't even set the mute role so how can you unmute someone? Please set it with ${process.env.PREFIX}muterole**`)
          .setDescription('');
      } else {
        targetMember.roles.remove(muterole);
      }
    } else {
      messageReply.setFooter('Because the reason includes test then the user will not be really muted but this means the unmute commands is working');
    }
    return message.channel.send(messageReply);
  },
};



