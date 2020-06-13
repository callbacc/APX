const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["bal", "balance", "bank"],
    category: "fun",
    description: "Commit a crime.",
    usage: "[crime]",
    run: async (client, message, args) => {
        let embed = new MessageEmbed()
            .setColor("#00FF00")
            .setDescription(`Fun: **daily, premium, rank, roulette, transfer**
            Info: **help, remind**
            Music: **loop, np, pause, play, queue, resume, skip, stop, volume**
            Rep: **rep, reps**
            Work: **coins, crime, work**`);
        message.channel.send(embed);
    }
}