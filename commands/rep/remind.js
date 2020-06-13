const { MessageEmbed } = require('discord.js');
const db = require("../../managers/Connection.js");
//const { TimeManager } = require("../../classes/TimeManager.js");

module.exports = {
    name: "remind",
    aliases: ["bal", "balance", "bank"],
    category: "fun",
    description: "Commit a crime.",
    usage: "[crime]",
    run: async (client, message, args) => {
        const con = await db.connect();
        try {
            if(isNaN(args[0])) return message.channel.send("That's not a number!");
            let time = parseInt(args[0]);
            let reason = args.slice(1).join(" ");
            let actualTime = Date.now() + time * 60000;
            if(reason >= 520) return message.channel.send("Please type something below 520 characters.");
            await con.execute(`INSERT INTO reminddata (user, reason, time) VALUES ('${message.author.id}', '${reason}', '${actualTime}')`);
            let embed = new MessageEmbed()
                .setColor("#00FF00")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setDescription(`I will remind you to ${reason} in ${time} minutes !`);
            message.channel.send(embed);
        } catch(error) {
            let er = new MessageEmbed()
                .setColor("#FF0000")
                .setDescription(error.message);
            message.channel.send(er);
        }
    }
}