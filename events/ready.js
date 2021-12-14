module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// client.channels.cache.get('743410236689350676').send('message');
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setPresence({ activities: [{ name: 'Among Us' }] });
	},
};