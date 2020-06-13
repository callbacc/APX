const { MessageEmbed } = require('discord.js');
var uuid = require("uuid");
const db = require("../../managers/Connection.js");

module.exports = {
    name: "premium",
    aliases: ["d"],
    category: "fun",
    description: "Get the daily bonus.",
    usage: "[daily]",
    run: async (client, message, args) => {
        const con = await db.connect();
        try {
            var tiers = [ "Basic", "Gold", "Platinum" ];
            if(!args[0]) {
                var tierText = "";
                const [ rows ] = await con.execute(`SELECT * FROM premiumservers WHERE server_id = ?`, [ `${message.guild.id}` ]);
                if(rows.length <= 0) return message.channel.send("This server isn't Premium!");
                const tierDb = rows[0].tier;
                if(tierDb === 1) tierText = "Basic";
                if(tierDb === 2) tierText = "Gold";
                if(tierDb >= 3) tierText = "Platinum";
                message.channel.send(`Yay! This server is Premium (**${tierText}**) !`);
            }
            if(args[0] === "buy") {
                var id = uuid.v4();
                let tier = args[1];
                if(tiers.includes(tier)) {
                    const [ rows ] = await con.execute(`SELECT * FROM pendingpremiumservers WHERE server_id = ?`, [ `${message.guild.id}` ]);
                    if(rows.length > 0) return message.channel.send(`Please contact the bot owner, there's a request already been made ($callback#0001)!`);
                    await con.execute(`INSERT INTO pendingpremiumservers (server_id, buyer_id, code, tier) VALUES ('${message.guild.id}', '${message.author.id}', '${id}', '${tier}')`);
                    message.author.send(`Your request for ${tier}, server ${message.guild.id} has been added! Please contact the bot owner ($callback#0001) and give him this number: ${id}`);
                } else {
                    message.channel.send(`Avalaible tiers: ${tiers}.`);
                }
            }
        } catch(error) {
            let embed = new MessageEmbed()	
                .setColor("#FF0000")
                .setDescription(error.message);
            message.channel.send(embed);
        }

    }
}