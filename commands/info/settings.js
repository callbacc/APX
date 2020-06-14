const { MessageEmbed } = require("discord.js");
const { getGuildLanguage, setGuildLanguage } = require("../../functions.js");

var languages = [ "english", "romanian" ];

module.exports = {
    name: "settings",
    aliases: ["bal", "balance", "bank"],
    category: "fun",
    description: "Commit a crime.",
    usage: "[crime]",
    run: async (client, message, args) => {
        if(!args[0]) return message.channel.send(`.options language romanian/english`);
        if(args[0] == "language") {
            const thisLang = await getGuildLanguage(message.guild.id);
            message.channel.send(`Actual language: **${thisLang}**`);
            const newLang = args[1];
            if(!languages.includes(newLang)) return message.channel.send("That's not a valid language.");
            setGuildLanguage(message.guild.id, newLang);
            message.channel.send(`New language set to: ${newLang}`);
        }
    }
}