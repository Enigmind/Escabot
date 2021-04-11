module.exports = {
  name: 'permission',
  description: "get bot permissions",
  usage: '<user> <permission>',
  args: true,
  aliases: ['perm'],
  execute(message, args) {
    if (args.length == 0) {
      message.reply("`permission`a besoin d'un argument.")
    } else {
      let hasPermission = message.guild.me.hasPermission(args[0])
      message.reply(hasPermission)
    }
  },
};