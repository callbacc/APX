const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "docs",
    aliases: ["bal", "balance", "bank"],
    category: "fun",
    description: "Commit a crime.",
    usage: "[crime]",
    run: async (client, message, args) => {
        try {
            const fetch = require('node-fetch');
            const query = args.join(' ');
            const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`;
            fetch(url)
            .then(res => res.json())
            .then(embed => {
                if(embed && !embed.error) {
                message.channel.send({ embed });
                } else {
                message.reply(`I don't know mate, but "${query}" doesn't make any sense!`);
                }
            })
        } catch(error) {

        }
    }
}