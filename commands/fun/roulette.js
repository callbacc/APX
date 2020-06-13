const { MessageEmbed } = require('discord.js');
const db = require("../../managers/Connection.js");

module.exports = {
    name: "roulette",
    aliases: ["d"],
    category: "fun",
    description: "Get the daily bonus.",
    usage: "[daily]",
    run: async (client, message, args) => {
        const con = await db.connect();
        const bidAmount = args[0];
        if(!bidAmount) return message.channel.send("Usage: .reoulette <amount>");
        if(isNaN(bidAmount)) return message.channel.send("Usage: .reoulette <amount>");
        const [ rows ] = await con.execute(`SELECT * FROM users WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
        if(rows[0].coins < bidAmount) return message.channel.send("You don't have enought coins.");
        const dice1 = Math.floor(Math.random() * 5) + 1;
        const dice2 = Math.floor(Math.random() * 5) + 1;
        const sum = dice1 + dice2;
        try {
            if(sum >= 6) {
                let success = new MessageEmbed()
                    .setColor("#00FF00")
                    .setTimestamp()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setDescription(`You've won **${bidAmount * 2}** coins!`);
                message.channel.send(success);
                await con.execute(`UPDATE users SET coins = coins + '${bidAmount * 2}' WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            } else {
                let noluck = new MessageEmbed()
                    .setColor("#FF0000")
                    .setTimestamp()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setDescription(`You've lost ${bidAmount} coins 😭!`);
                message.channel.send(noluck);
                await con.execute(`UPDATE users SET coins = coins - '${bidAmount}' WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            }
        } catch(error) {
            let embed = new MessageEmbed()	
                .setColor("#FF0000")
                .setDescription(error.message);
            message.channel.send(embed);
        }
    }
}