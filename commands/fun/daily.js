const { MessageEmbed } = require('discord.js');
const db = require("../../managers/Connection.js");

function remainingCooldown(time) {
    const timeLeft = time - Date.now();
    const hoursLeft = timeLeft / 1000 / 60 / 60;
    const minutesLeft = (hoursLeft - ~~(hoursLeft)) * 60;
    const secondsLeft = (minutesLeft - ~~(minutesLeft)) * 60;

    const displaySeconds = ~~secondsLeft &&
        `${~~secondsLeft} second(s)`;
    const displayMinutes = ~~minutesLeft &&
        `${~~minutesLeft} minute(s) `;
    const displayHours = ~~hoursLeft &&
        `${~~hoursLeft} hour(s) `;

    return `${displayHours || ""}${displayMinutes || ""}${displaySeconds || ""}`;
}

module.exports = {
    name: "daily",
    aliases: ["d"],
    category: "fun",
    description: "Get the daily bonus.",
    usage: "[daily]",
    run: async (client, message, args) => {
        const con = await db.connect();
        let cd = parseInt(24 * 60 * 60 * 1000) + Date.now();
        try {
            const [ rows ] = await con.execute(`SELECT * FROM users WHERE id = ? AND guildid = ?`, [`${message.author.id}`, `${message.guild.id}`]);
            if (rows.length == 0) return;
            let bonus = rows[0].bonus;
            let coins = rows[0].coins;
            let bonuss = 50 + bonus * 10;
            if(bonus >= 7) {
                if (rows[0].dailyCooldown > Date.now()) return message.channel.send(`You need to wait ${remainingCooldown(rows[0].dailyCooldown)} more!`);
                let embed2 = new MessageEmbed() 
                    .setColor("#00FF00")
                    .setAuthor(`${message.author.tag} - ${coins} coins`)
                    .setTimestamp()
                    .setDescription(`You have reached max bonus (7/7)! You got a bigger bonus!`);
                bonuss = 50 + bonus * 50;
                con.execute(`UPDATE users SET coins = coins + '${bonuss}' WHERE id = ? AND guildid = ?`, [`${message.author.id}`, `${message.guild.id}`]);
                con.execute(`UPDATE users SET bonus = '0' WHERE id = ? AND guildid = ?`, [`${message.author.id}`, `${message.guild.id}`]);
                con.execute(`UPDATE users SET dailyCooldown = ? WHERE id = ? AND guildid = ?`, [`${cd}`, `${message.author.id}`, `${message.guild.id}` ]);
                return message.channel.send(embed2);
            } else {
                let embed1 = new MessageEmbed()
                    .setColor("#00FF00")
                    .setAuthor(`${message.author.tag} - ${coins} coins`)
                    .setTimestamp()
                    .setDescription(`You have *${bonus}/7* bonus! You got ${bonuss} coins!`);
                let success = new MessageEmbed()
                    .setColor("#00FF00")
                    .setAuthor(`${message.author.tag} - ${coins} coins`)
                    .setTimestamp()
                    .setDescription(`You got 50 coins as a daily bonus!`);
                if (rows[0].dailyCooldown > Date.now()) return message.channel.send(`You need to wait ${remainingCooldown(rows[0].dailyCooldown)} more!`);
                con.execute(`UPDATE users SET dailyCooldown = ? WHERE id = ? AND guildid = ?`, [`${cd}`, `${message.author.id}`, `${message.guild.id}` ]);
                con.execute(`UPDATE users SET coins = coins + '${bonuss}' WHERE id = ? AND guildid = ?`, [`${message.author.id}`, `${message.guild.id}`]);
                con.execute(`UPDATE users SET bonus = bonus + '1' WHERE id = ? AND guildid = ?`, [`${message.author.id}`, `${message.guild.id}`]);
                if(bonus > 0) {
                    message.channel.send(embed1);
                } else {
                    message.channel.send(success);
                }
            }
        } catch (error) {
            let errors = new MessageEmbed()
                .setColor("#FF0000")
                .setDescription(error.message);
            message.channel.send(errors);
        }
    }
}