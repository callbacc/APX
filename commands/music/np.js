
const { MessageEmbed } = require("discord.js")

const { COLOR } = require("../../config.json");


module.exports = {
    name: "np",
    category: "music",
    run: async (client, message, args) => {
        let embed = new MessageEmbed()
        .setColor(COLOR)
              
            const { channel } = message.member.voice;
            if (!channel) {
              //IF AUTHOR IS NOT IN VOICE CHANNEL
              embed.setAuthor("YOU NEED TO BE IN VOICE CHANNEL :/")
              return message.channel.send(embed);
            }
        
            const serverQueue = message.client.queue.get(message.guild.id);
        
            if (!serverQueue) {
              embed.setAuthor("Bot is not playing anything")
              return message.channel.send(embed);
            }
            embed.setDescription(`**NOW PLAYING** - ${serverQueue.songs[0].title}`)
            embed.setThumbnail(client.user.displayAvatarURL())
            message.channel.send(embed)
        
    }
}