module.exports = {
    name: 'among',
    description: "ask people to play among us",
    args: false,
    aliases: ['amongus'],
    execute(message, args) {
        if (args.length != 0) {
            message.reply("`among` n'a pas encore besoin d'arguments.")
        } else {
            message.delete()
            message.channel.send("Alors ? Ça joue à Among us ou bien <:impo:831235278822965290> ? \n@everyone")
                .then(sentMessage => sentMessage.react('👍')
                    .then(() => sentMessage.react('👎')))
        }
    },
};