const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

fs.readdir(`${__dirname}/events`, (err, files) => {
	if (err) return console.error(err);

	files.forEach(file => {
		console.log(`Loading Events File : ${file}`);

		const event = require(`${__dirname}/events/${file}`);

		if (!event.infos) {
			console.log(
				"Event File Can't Be Loaded ❌ , Because there is no information about it\n"
			);
		} else {
			if (event.once) {
				client.once(event.infos.name, event.execute.bind(null, client));
				console.log('Event File Binded Once ✅\n');
			} else {
				client.on(event.infos.name, event.execute.bind(null, client));
				console.log('Event File Binded ✅\n');
			}
		}
	});
});

fs.readdir(`${__dirname}/commands`, (err, folders) => {
	if (err) return console.error(err);

	folders.forEach(folder => {
		fs.readdir(`${__dirname}/commands/${folder}`, (err, files) => {
			if (err) return console.error(err);

			files.forEach(file => {
				const command = require(`${__dirname}/commands/${folder}/${file}`);

				console.log(`Loading Command File : ${file}`);

				if (!command.infos) {
					console.log(
						"Command File Can't Be Loaded ❌ , Because there is no information about it\n"
					);
				} else {
					client.commands.set(command.infos.name.toLowerCase(), command);
					console.log('Command File Loaded ✅\n');
				}
			});
		});
	});
});

client.login(process.env.TOKEN);
