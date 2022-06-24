const express = require('express');

const server = express();

module.exports = {
	infos: {
		name: 'ready',
	},

	once: true,

	execute: async (client) => {
		console.log(`[API]\n Logged in as ${client.user.tag}\n With ${client.user.id} as bot ID\n`);

		client.user.setActivity(`${process.env.PREFIX}help`, { type: 'LISTENING' });

		server.all('/', (req, res) => {
			res.send('Website is online if you want to check if your bot is online or not check down add /bot in the url');
		});
		server.all('/bot', (req, res) => {
			res.send(`${client.user.username} is online!`);
		});
		server.listen(3000, () => {
			console.log(`[WebServer]\n${client.user.username} Bot is Online`);
		});
	},
};
