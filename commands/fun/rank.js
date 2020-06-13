const { MessageEmbed } = require('discord.js');
const db = require("../../managers/Connection.js");

module.exports = {
    name: "rank",
    aliases: ["xp", "level"],
    category: "fun",
    description: "Commit a crime.",
    usage: "[crime]",
    run: async (client, message, args) => {
    	const con = await db.connect();
    	try {
            const [ rows ] = await con.execute(`SELECT * FROM users WHERE id = ? AND guildid = ?`, [`${message.author.id}`, `${message.guild.id}`]);
            if (rows.length === 0) return;
            const { xp, level } = rows[0];
            const rank = new MessageEmbed()
                .setColor("#00FF00")
                .setTimestamp()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription(`You have **${xp}** xp and you are on level **${level}**! Good job!`);
            message.channel.send(rank);
        } catch(error) {
            let embed = new MessageEmbed()	
                .setColor("#FF0000")
                .setDescription(error.message);
            message.channel.send(embed);
        }
    }
}