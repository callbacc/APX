const { MessageEmbed, Message } = require('discord.js');
const db = require("../../managers/Connection.js");

module.exports = {
    name: "coins",
    aliases: ["c"],
    category: "fun",
    description: "Commit a crime.",
    usage: "[crime]",
    run: async (client, message, args) => {
        const con = await db.connect();
        try {
            const [ rows ] = await con.execute(`SELECT * FROM users WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            if(rows.length == 0) return;
            let coins = rows[0].coins;

            let embedCoins = new MessageEmbed()
                .setColor("#00FF00")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setDescription(`Coins: ${coins} :money_with_wings:`);
            message.channel.send(embedCoins);
        } catch(error) {
            let err = new MessageEmbed()
                .setColor("#FF0000")
                .setDescription(error.message);
            message.channel.send(err);
        }
    }
}