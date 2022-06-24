const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  infos: {
    name: 'reload',
    aliases: ['r'],
    usage: '[command]',
	  description: 'Reloading all or specific commands in a folder or individualy',
  },
  
  devsOnly: true,

  args: (message) => {return [true];},

	execute: async (client, message, args) => {
    const reloadThis = args[0].toLowerCase();
    const reloadEmbed = new MessageEmbed();

    const folders = await fs.promises.readdir('./commands').catch((err) => {return console.log(err);});

    if (reloadThis === 'all') {
      for (const folder of folders) {
          const files = await fs.promises.readdir(`./commands/${folder}`).catch((err) => {return console.log(err);});

          for (const file of files) {
            const commandName = file.split('.')[0].toLowerCase();
            
            delete require.cache[require.resolve(`../${folder}/${file}`)];
            client.commands.delete(commandName);

            try {
	            const newCommand = require(`../${folder}/${file}`);
              if (!newCommand.infos) {
                continue;
              } else {
                message.client.commands.set(newCommand.infos.name, newCommand);
              }
            } catch (error) {
              console.error(`\nError:\n${error.stack}`);
              reloadEmbed
                .setTitle(':x: Error')
                .setDescription(`There was an error while reloading command \`${commandName}\`:\n\n\`${error.stack}\``)
                .setColor('RED');
              return message.channel.send(reloadEmbed);
            }
          }
      }
      reloadEmbed
        .setTitle(':white_check_mark: Reloads Succesfull')
        .setColor('GREEN')
        .setDescription('All commands have been reloaded');
      return message.channel.send(reloadEmbed);
    }

    const reloadedCommands = [];
    const reloadedFolders = [];

    for (const arg of args) {
      const lowerCaseArg = arg.toLowerCase();

      for (const folder of folders) {
        const files = await fs.promises.readdir(`./commands/${folder}`).catch((err) => {return console.log(err);});

        if (folder === lowerCaseArg) {
          for (const file of files) {
            const commandName = file.split('.')[0].toLowerCase();
            
            delete require.cache[require.resolve(`../${folder}/${file}`)];
            client.commands.delete(commandName);

            try {
	            const newCommand = require(`../${folder}/${file}`);
              
              if (!newCommand.infos) continue;
              
              message.client.commands.set(newCommand.infos.name, newCommand);
            } catch (error) {
              console.error(`\nError:\n${error.stack}`);
              reloadEmbed
                .setTitle(':x: Error')
                .setDescription(`There was an error while reloading command \`${commandName}\`:\n\n\`${error.stack}\``)
                .setColor('RED');
              return message.channel.send(reloadEmbed);            
            }
          }
          reloadedFolders.push(folder);
          break;
        }
        
        if (folders.includes(lowerCaseArg)) continue;
          
        const commandName = lowerCaseArg;
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.infos.aliases && cmd.infos.aliases.includes(commandName));

        if (!command) {
          reloadEmbed
            .setTitle(':x: Reloads Unsuccesfull')
            .setColor('RED')
            .setDescription(`There is no command or folder with that name or alias \`${commandName}\`, ${message.author}!`);
          return message.channel.send(reloadEmbed);
        }

        if (files.includes(`${command.infos.name}.js`)) {
          delete require.cache[require.resolve(`../${folder}/${command.infos.name}.js`)];
          client.commands.delete(commandName);

          try {
            const newCommand = require(`../${folder}/${command.infos.name}.js`);
            message.client.commands.set(newCommand.infos.name, newCommand);
            reloadedCommands.push(newCommand.infos.name);
          } catch (error) {
            console.error(`\nError:\n${error.stack}`);
            reloadEmbed
              .setTitle(':x: Error')
              .setDescription(`There was an error while reloading command \`${commandName}\`:\n\n\`${error.stack}\``)
              .setColor('RED');
            return message.channel.send(reloadEmbed);
          }
          break;
        }
      }
    }

    if (reloadedCommands.length && reloadedFolders.length) {
      reloadEmbed
        .setTitle(':white_check_mark: Reloads Succesfull')
        .setDescription(`All command(s) in \`${reloadedFolders.join(', ')}\` folder(s) and \`${reloadedCommands.join(', ')}\` command(s) have(s) been reloaded`)
        .setColor('GREEN');
      return message.channel.send(reloadEmbed);
    }

    if (reloadedCommands.length) {
      reloadEmbed
        .setTitle(':white_check_mark: Reloads Succesfull')
        .setDescription(`\`${reloadedCommands.join(', ')}\` command(s) have(s) been reloaded`)
        .setColor('GREEN');
    }

    if (reloadedFolders.length) {
      reloadEmbed
        .setTitle(':white_check_mark: Reloads Succesfull')
        .setDescription(`All command(s) in \`${reloadedFolders.join(', ')}\` folder(s) have(s) been reloaded`)
        .setColor('GREEN');
    }

    return message.channel.send(reloadEmbed);
  },  
};