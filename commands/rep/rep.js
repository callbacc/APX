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
    name: "rep",
    aliases: ["d"],
    category: "fun",
    description: "Get the daily bonus.",
    usage: "[daily]",
    run: async (client, message, args) => {
        const con = await db.connect();
        const repCooldown = 24 * 60 * 60 * 1000;
        function getUserFromMention(mention) {
            if (!mention) return;
            if (mention.startsWith('<@') && mention.endsWith('>')) {
                mention = mention.slice(2, -1);
                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }
                return client.users.cache.get(mention);
            }
        }
        try {
            const [ rows ] = await con.execute(`SELECT * FROM users WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            if (rows.length === 0) return;
            const repTaker = getUserFromMention(args[0]);
            if(!repTaker) return message.channel.send("You need to tag a person.");
            if(repTaker.id === message.author.id) return message.channel.send("You can't rep yourself.");
            const [ rowss ] = await con.execute(`SELECT * FROM users WHERE id = ? AND guildid = ?`, [ `${repTaker.id}`, `${message.guild.id}` ]);
            if(rowss.length === 0) return message.channel.send("That user needs to type something first.");
            const wait = new MessageEmbed()
                .setColor("#FF0000")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setDescription(`You need to wait ${remainingCooldown(rows[0].repCooldown)} more!`);
            if (rows[0].repCooldown > Date.now()) return message.channel.send(wait);
            con.execute(`UPDATE users SET reps = reps + '1' WHERE id = ? AND guildid = ?`, [ `${repTaker.id}`, `${message.guild.id}` ]);
            con.execute(`UPDATE users SET repCooldown = '${Date.now() + repCooldown}' WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            let success = new MessageEmbed()    
                .setColor("#00FF00")
                .setTimestamp()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription(`You have succesfully gave ${repTaker} a rep point!`);
            message.channel.send(success);
        } catch (error) {
            let er = new MessageEmbed()
                .setColor("#FF0000")
                .setDescription(error.message);
            message.channel.send(er);
        }
    }
}