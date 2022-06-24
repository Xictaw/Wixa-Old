module.exports = {
  infos: {
    name: 'muterole',
    aliases: ['mr'],
    usage: '<*role>',
	  description: 'Set a muterole',
  },

  args: (message) => {return [true, `Please specify a muterole${message.author}.`];},
  
  guildOnly: true,

  permissions: 'MANAGE_ROLES',

	execute: async (client, message, args, filterInput, messageReply, db) => {
    const role = await message.guild.roles.cache.get(filterInput(args[0])) || await message.guild.roles.cache.find(r => r.name === args[0]);

    let guildData = await db.get(`${message.guild.id}`);

    if (!role) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Set Muterole')
        .setDescription(`There is no role called ${args[0]}!`);
      return message.channel.send(messageReply);
    }

    if (!guildData || Object.keys(guildData).length === 0 && guildData.constructor === Object) {
      guildData = {muterole: `${role.id}`};
    }

    if (!guildData.muterole || Object.keys(guildData.muterole).length === 0 && guildData.muterole.constructor === Object) {
      guildData.muterole = role.id;
    }
    
    messageReply
      .setColor('GREEN')
      .setTitle(`**Muterole set as \`${role.name}\`.**`)
      .setDescription('');
    await message.channel.send(messageReply);
    
    return await db.set(`${message.guild.id}`, guildData)
	},
};