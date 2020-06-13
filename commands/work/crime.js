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
    name: "crime",
    aliases: ["c"],
    category: "fun",
    description: "Commit a crime.",
    usage: "[crime]",
    run: async (client, message, args) => {
        const con = await db.connect();
        let cd = parseInt(1 * 60 * 60 * 1000);
        try {
            let coins = Math.floor(Math.random() * 101);
            const [ rows ] = await con.execute(`SELECT * FROM users WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            if (rows[0].crimeCooldown > Date.now()) return message.channel.send(`You need to wait **${remainingCooldown(rows[0].crimeCooldown)}** more!`);
            con.execute(`UPDATE users SET coins = coins + '${coins}' WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            con.execute(`UPDATE users SET crimeCooldown = '${Date.now() + cd}' WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            let success = new MessageEmbed()
                .setColor("#00FF00")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setDescription(`You have succesfully commited a crime for ${coins} coins!`);
            message.channel.send(success);
        } catch (error) {
            let embed = new MessageEmbed()
                .setColor("#FF0000")
                .setDescription(error.message);
            message.channel.send(embed);
        }
    }
}