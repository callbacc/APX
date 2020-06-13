const { MessageEmbed } = require('discord.js');
const db = require("../../managers/Connection.js");

module.exports = {
    name: "transfer",
    aliases: ["pay"],
    category: "fun",
    description: "Get the daily bonus.",
    usage: "[daily]",
    run: async (client, message, args) => {
    	try {
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
    		const to = getUserFromMention(args[0]);
    		if(isNaN(args[1])) return message.channel.send("It has to be a number.");
    		const amount = parseInt(args[1]);
    		const con = await db.connect();
    		const [ rows ] = await con.execute(`SELECT * FROM users WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
    		if(rows[0].coins < amount) return message.channel.send("You don't have that much.");
    		con.execute(`UPDATE users SET coins = coins - '${amount}' WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
    		con.execute(`UPDATE users SET coins = coins + '${amount}' WHERE id = ? AND guildid = ?`, [ `${to}`, `${message.guild.id}` ]);
    		let meb = new MessageEmbed()
    			.setColor("#00FF00")
    			.setAuthor(message.author.tag, message.author.displayAvatarURL())
    			.setTimestamp()	
    			.setDescription(`You have succesfully transfered ${amount} coins to ${to} !`);
    		message.channel.send(meb);
    		let sendthis = new MessageEmbed()	
    			.setColor("#00FF00")
    			.setAuthor(message.author.tag, message.author.displayAvatarURL())
    			.setTimestamp()
    			.setDescription(`${message.author.tag} transfered you ${amount} coins!`);
    		to.send(sendthis);
    	} catch (error) {
    		let embed = new MessageEmbed()	
    			.setColor("#FF0000")
    			.setDescription(error.message);
    		message.channel.send(embed);
    	}
    }
}