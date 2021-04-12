const Discord = require('discord.js')

module.exports = {
  name: 'help',
  description: "List all of my commands or info about a specific command.",
  aliases: ['aled', 'commands'],
  execute(message, args) {
    if (args.length > 0) {
      message.channel.send("TODO -> faire des commandes d'aide personnalisées :thinking:")
    } else {
      const cmd_list = new Discord.MessageEmbed()
        //header
        .setColor('#800000')
        .setTitle("Liste des commandes")
        .setThumbnail('https://images.emojiterra.com/google/android-pie/512px/2699.png')

        //content
        .addField("among", "Envoie un message pour proposer à tout le monde de jouer à Among Us (utile quand t'as la flemme d'écrire le message toi même grosse feignasse).\n*Exemple :* `?among`", false)
        .addField("aled", "Affiche l'aide. Mais comme le dev est un turbo flemmard, elle est pas encore au point.\n*Exemple :* `?aled`", false)
      message.reply(cmd_list)
    }
  },
};