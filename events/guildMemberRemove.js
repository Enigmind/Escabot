// Need to work on it while Esca in production is sleeping
module.exports = {
	name: 'guildMemberRemove',
	execute(member) {
		client.channels.cache.get('743410236689350676').send(`${member.user.username} has been ejected. It was an imposter.\n<:fine:785276116558151690> **CHEH** <:fine:785276116558151690>`);
		console.log(`member in SUS quit. name was : ${member.user.username}`)
	},
};