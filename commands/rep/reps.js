const { MessageEmbed } = require('discord.js');
const db = require("../../managers/Connection.js");

module.exports = {
    name: "reps",
    aliases: ["d"],
    category: "fun",
    description: "Get the daily bonus.",
    usage: "[daily]",
    run: async (client, message, args) => {
        const con = await db.connect();
        try {
            const [ rows ] = await con.execute(`SELECT * FROM users WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            if(rows == 0) return;
            let reps = rows[0].reps;
            let repss = new MessageEmbed()
                .setColor("#00FF00")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setFooter(`Rep System`)
                .setDescription(`You have ${reps} rep(s)!`);
            message.channel.send(repss);
        } catch (error) {
            let embed = new MessageEmbed()
                .setColor("#FF0000")
                .setDescription(error.message);
            message.channel.send(embed);
        }
    }
}