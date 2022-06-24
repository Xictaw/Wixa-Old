module.exports = {
  infos: {
    name: 'warnings',
    aliases: ['ws'],
    usage: '<*user> <warning case number>',
	  description: 'See a user warnings',
  },

  args: (message) => {return [true, `Please specify someone to see the warns ${message.author}.`];},
  
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
        .setTitle(':x: Cannot See User Warns')
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

    const guildWarns = guildData.warns;
    
    if (!guildWarns || Object.keys(guildWarns).length === 0 && guildWarns.constructor === Object) {
      messageReply
        .setColor('YELLOW')
        .setTitle(`:warning: Bruh`)
        .setDescription(`You haven't even warned anyone in this server so how could you be searching for that user?`); 
      return message.channel.send(messageReply);
    }

    const targetWarns = guildWarns[`${targetMember.id}`];

    const messageAuthor = await message.guild.members.cache.get(message.author.id);
    const guildOwner = await message.guild.members.cache.get(message.guild.owner.user.id);

    const authorRole = messageAuthor.roles.highest.position;
    const targetRole = targetMember.roles.highest.position;
    const botRole = bot.roles.highest.position;

    if (targetMember === guildOwner) {
      messageReply
        .setColor('RED')
        .setDescription(`That's the server owner xD`);
      return message.channel.send(messageReply);
    }

    if (targetMember === bot) {
      messageReply
        .setColor('RED')
        .setDescription(`Bruh, I can't even be warned so why do you want to see my warns ${messageAuthor}?`);
      return message.channel.send(messageReply);
    }

    if (authorRole < targetRole) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot See User Warns')
        .setDescription(`Your role is lower than ${targetMember.user.tag}, sorry ${message.author}! you can only warn someone that have lower role than you.`);
      return message.channel.send(messageReply);
    }

    if (isNaN(args[1]) && args[1]) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot See User Warns')
        .setDescription('The warning case number **MUST** be a number');
      return message.channel.send(messageReply);
    }

    if (!targetWarns || Object.keys(targetWarns).length === 0 && targetWarns.constructor === Object) {
      messageReply
        .setColor('YELLOW')
        .setTitle(`:warning: User ${targetMember.user.tag} Warnings`)
        .setDescription(`User ${targetMember.user.tag} have no warnings`); 
      return message.channel.send(messageReply);
    }

    if (!args[1]) {
      messageReply
        .setColor('YELLOW')
        .setTitle(`:warning: User ${targetMember.user.tag} Warnings`)
        .setDescription(`That user have ${Object.keys(targetWarns).length} warnings`);  
      return message.channel.send(messageReply);
    }

    if (!(`case${args[1]}` in targetWarns)) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot See User Warning Case')
        .setDescription(`${targetMember.user.tag} have no Warning Case ${args[1]}`);
      return message.channel.send(messageReply);
    }

    messageReply
      .setColor('YELLOW')
      .setTitle(`:warning: User ${targetMember.user.tag} Warning Case ${args[1]}`)
      .setDescription(`**Warned by:** ${targetWarns[`case${args[1]}`][0]}\n**Reason:** ${targetWarns[`case${args[1]}`][1]}`);    
    
    return message.channel.send(messageReply);
	},
};