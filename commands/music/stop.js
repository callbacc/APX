
const { MessageEmbed } = require("discord.js");
const { COLOR } = require("../../config.json");

const discord = require("discord.js");

module.exports = {
    name: "stop",
    aliases: ["disconnect"],
    category: "music",
    description: "Stop playing the song.",
    usage: "[work]",
    run: async (client, message, args) => {
        let embed = new MessageEmbed()
        .setColor(COLOR);
        
            const { channel } = message.member.voice;
              
            if (!channel) {
              embed.setAuthor("You need to be in a voice channel.")
              return message.channel.send(embed);
            }
        
            const serverQueue = message.client.queue.get(message.guild.id);
        
            if (!serverQueue) {
              embed.setAuthor("There is nothing playing that i could stop")
              return message.channel.send(embed);
            }
        
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }
    }