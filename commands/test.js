module.exports = {
    name: 'test',
    description: "test command (useless)",
    aliases: ['perm'],
    execute(message, args) {
        message.reply("test réussi")
    },
  };