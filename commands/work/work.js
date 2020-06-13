const { MessageEmbed } = require("discord.js");
const db = require("../../managers/Connection.js");

function remainingCooldown(time) {
    const timeLeft = time - Date.now();
    const hoursLeft = timeLeft / 1000 / 60 / 60;
    const minutesLeft = (hoursLeft - ~~(hoursLeft )) * 60;
    const secondsLeft = (minutesLeft - ~~(minutesLeft )) * 60;
    
    const displaySeconds = ~~secondsLeft
        && `${~~secondsLeft} second(s)`;
    const displayMinutes = ~~minutesLeft 
        && `${~~minutesLeft} minute(s) `;
    const displayHours = ~~hoursLeft
        && `${~~hoursLeft} hour(s) `;
    
    return `${displayHours || ""}${displayMinutes || ""}${displaySeconds || ""}`;
}

module.exports = {
    name: "work",
    aliases: ["w"],
    category: "fun",
    description: "Start working, get a job.",
    usage: "[work]",
    run: async (client, message, args) => {
        const con = await db.connect();
        const random = Math.floor(Math.random() * 100) + 1;
        const messages = [ 
            `You have successful worked as a garbage man and got ${random} coins for that!`,
            `You worked as a professional professional and got ${random} coins for that!`
        ];
        const messageNumber = messages[Math.floor(Math.random() * messages.length)];
        const cd = Date.now() + 2 * 60 * 60 * 1000;
        try {
            const [ rows ] = await con.execute(`SELECT * FROM users WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            if(rows.length === 0) return message.channel.send("You need to type something first!");
            if(rows[0].workCooldown > Date.now()) return message.channel.send(`You need to wait ${remainingCooldown(rows[0].workCooldown)} more!`);
            con.execute(`UPDATE users SET workCooldown = '${cd}' WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            let embed = new MessageEmbed()
                .setColor("#00FF00")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setDescription(messageNumber);
            message.channel.send(embed);
            con.execute(`UPDATE users SET coins = coins + '${random}' WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
        } catch (error) {
            let embe1 = new MessageEmbed()
                .setColor("#FF0000")
                .setDescription(error.message);
            message.channel.send(embe1);
        }
    }
}