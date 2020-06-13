const db = require("../managers/Connection.js");
const { MessageEmbed } = require("discord.js");

module.exports = async (client, message) => {
    const con = await db.connect();
    const prefix = ".";
    try {
        const xp = Math.floor(Math.random() * 5) + 1;
        if(message.channel.type === "dm") return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();  
        const command = client.commands.get(cmd) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmd));
        const [ rows ] = await con.execute(`SELECT * FROM users WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
        if(rows.length === 0) {
            return con.execute(`INSERT INTO users (id, guildid) VALUES ('${message.author.id}', '${message.guild.id}')`);
        }
        if(rows[0].xpCooldown <= Date.now()) {
            var xpNeeded = rows[0].xp * 100;
            con.execute(`UPDATE users SET xp = xp + '${xp}' WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            con.execute(`UPDATE users SET xpCooldown = '${Date.now() + 10000}' WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
        }
        if(rows[0].xp >= xpNeeded) {
            con.execute(`UPDATE users SET xp = xp - '${xpNeeded}' WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
            con.execute(`UPDATE users SET level = level + '1' WHERE id = ? AND guildid = ?`, [ `${message.author.id}`, `${message.guild.id}` ]);
        } 
        if(!message.content.startsWith(prefix)) return;
        if(!message.member) message.member = message.guild.members.fetch(message);
        if(!command) return;
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
            return message.channel.send(reply);
        }
        try {
            await command.run(client, message, args);
        } catch (error) {
            console.log(error);
            let mebed = new MessageEmbed()
                .setColor("#FF0000")
                .setDescription(error.message);
            return message.channel.send(mebed);
        }
    } catch (error) {
        console.log(error);
        let smebed = new MessageEmbed()
            .setColor("#FF0000")
            .setDescription(error.message);
        return message.channel.send(smebed);
    }
}