export default {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({ activities: [{ name: 'La fin du monde', type: 'WATCHING' }] });
  },
};
