const Database = require("@replit/database");
const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');
const fs = require('fs');

const db = new Database()

module.exports = {
  infos: {
    name: 'eval',
    aliases: ['e'],
    usage: '<code>',
	  description: 'Evaluate the given code and send the output',
  },

  devsOnly: true,

  args: (message) => {return [true];},

	execute: async (client, message, args) => {
    const inputCode = args.join(' ');
    const evalMessage = new MessageEmbed().addField('**Input :**', `**\`\`\`js\n${inputCode}\n\`\`\`**`);
    
    function clean(text) {
      if (typeof(text) === "string") {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      } else {
        return text;
      }
    }

    try {
      const result = await eval(inputCode);
      let outputCode = result;

      if (typeof result !== 'string') {
        outputCode = inspect(result);
      }

      const cleanedCode = clean(outputCode);
      if (cleanedCode.length < 1024) {
        evalMessage
          .setColor('GREEN')
          .setTitle(':white_check_mark: Eval Result :white_check_mark:')
          .addField('**Output :**', `**\`\`\`js\n${cleanedCode}\n\`\`\`**`);
      } else {
        fs.writeFileSync('output.js', cleanedCode);
        evalMessage
          .setColor('GREEN')
          .setTitle(':white_check_mark: Eval Result :white_check_mark:')
          .addField('**Output :**', '**```Check The output.js file on the prgram because it\'s length is more than 1024```**');
      }
      return message.channel.send(evalMessage);
    }catch(error) {
      evalMessage
        .setColor('RED')
        .setTitle(':x: Eval Error :x:')
        .addField('**Output :**', `**\`\`\`yaml\n${error}\n\`\`\`**`);
      return message.channel.send(evalMessage);
    }
	},
};