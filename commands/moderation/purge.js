module.exports = {
  infos: {
    name: 'purge',
    aliases: ['p'],
    usage: '<*count>',
	  description: 'Bulk delete messages',
  },

  args: (message) => {return [true, `Please specify the ammount of messages to be deleted ${message.author}.`];},

  guildOnly: true,
  
  permissions: 'MANAGE_MESSAGES',

	execute: async (client, message, args, filterInput, messageReply, db) => {
    const countNumber = parseInt(args[0]);

    if (!countNumber) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Purge Messages')
        .setDescription('Count must be a number!')
        .setFooter(`Example: ${process.env.PREFIX}purge 50`);
      return message.channel.send(messageReply);
    }
    
    if(countNumber > 1000) {
      messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Purge Messages')
        .setDescription('I cannot delete more than 1000 messages')
        .setFooter('max 1000, min 1');
      return message.channel.send(messageReply);
    }
    
    if(countNumber < 1) {
       messageReply
        .setColor('RED')
        .setTitle(':x: Cannot Purge Messages')
        .setDescription('I cannot delete less than 1 messages')
        .setFooter('max 1000, min 1');
      return message.channel.send(messageReply);
    }

    messageReply
      .setColor('GREEN')
      .setTitle(`Succesfullly deleted ${countNumber} messages`)
      .setDescription('');
    
    await message.channel.bulkDelete(countNumber);

    return message.channel.send(messageReply);
  }
}
