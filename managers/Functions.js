const fs = require("fs");
const moment = require("moment");
const discord = require("discord.js");
const fetch = require("node-fetch");

const db = require("../managers/Connection.js");

require('moment-duration-format');
module.exports = async (bot, utils, ytdl, config) => {
  const con = await db.connect();
  fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");

    if (jsfiles.length <= 0)
      return console.log("There are no commands to load...");

    console.log(`Loading ${jsfiles.length} commands...`);
    jsfiles.forEach((f, i) => {
      let props = require(`../commands/${f}`);
      console.log(`${i + 1}: ${f} loaded!`);
      bot.commands.set(props.help.name, props);
      props.help.aliases.forEach(alias => {
        bot.aliases.set(alias, props.help.name);
      });
    });
  });

  bot.loadCommand =  commandName => {
    try {
      let props = require(`../commands/${commandName}`);
      if (props.init) props.init(bot);
      bot.commands.set(commandName, props);
      props.help.aliases.forEach(alias => {
        bot.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (err) {
      return utils.cmd_fail(
        `Error: ${err}\nCommand \`${commandName}\` cannot be found.`,
        `${config.prefix}reload <command>`
      );
    }
  };

  bot.unloadCommand = async commandName => {
    try {
      if (!commandName)
        return `The command \`${commandName}\` doesn"t seem to exist. Try again!`;

      if (commandName.shutdown) await commandName.shutdown(bot);
      delete require.cache[require.resolve(`../commands/${commandName}.js`)];
      return false;
    } catch (err) {
      return utils.cmd_fail(
        `Error: ${err}\nCommand \`${commandName}\` cannot be found.`,
        `${config.prefix}reload <command>`
      );
    }
  };
  async function getGuildLanguage(guildid) {
    const [ rows ] = await con.execute(`SELECT * FROM guildsettings WHERE id = '${guildid}'`);
    var language = "";
    if(rows.length === 0) {
        language = "english";
    } else if(rows[0].language === "english") {
        language = "english";
    } else {
        language = "romanian";
    }
    return language;
  }
  bot.handleVideo = async (video, message, vc, playlist = false) => {
    let queue = bot.queue.get(message.guild.id);
    let music = {
      id: video.id,
      title: video.title,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      thumbnail: `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
      duration: video.duration,
      ct: video.channel.title,
      channel: video.channel.id,
      published: video.publishedAt,
      channelURL: `https://www.youtube.com/channel/${video.channel.id}`
    };
    if (!queue) {
      let queueConstruct = {
        textChannel: message.channel,
        voiceChannel: vc,
        connection: null,
        musics: [],
        volume: 100,
        playing: true,
        loop: false
      };
      let voteConstruct = {
        votes: 0,
        voters: []
      };

      bot.queue.set(message.guild.id, queueConstruct);
      bot.votes.set(message.guild.id, voteConstruct);
      queueConstruct.musics.push(music);

      try {
        var connection = await vc.join();
        queueConstruct.connection = connection;
        bot.play(message.guild, queueConstruct.musics[0]);
      } catch (err) {
        bot.queue.delete(message.guild.id);
        console.error(`**I could not join your voice channel!** : (${err})`);
      }
    } else {
      queue.musics.push(music);
      let embed3 = new discord.RichEmbed();
      if (playlist) return;
      else
        return message.channel.send(
          embed3
            .setColor(bot.embedColor)
            .setAuthor("Added To Queue", bot.user.displayAvatarURL)
            .setDescription(`**[${music.title}](${music.url})**`)
            //.addField("Song Channel", `**[${music.ct}](${music.channelURL})**` , true)
           // .addField(
            //  "Song Duration",
           //   `**${moment.duration(music.duration).format('DD:HH:mm:ss')}**`, true
          //  )
         // .setImage(music.thumbnail)

           .setThumbnail(music.thumbnail)

           // .setTimestamp(Date.now())
        );
    }
    return;
  };

  bot.play = (guild, music) => {
    let queue = bot.queue.get(guild.id);
    let votes = bot.votes.get(guild.id);
    let embed2 = new discord.RichEmbed();
    if (!music) {
      queue.voiceChannel.leave();
      bot.queue.delete(guild.id);
      bot.votes.delete(guild.id);
      return queue.textChannel.send(
        embed2.setTitle("Queue Has Ended").setColor(bot.embedColor)
      );
    }
    
    
//const { Canvas } = require('canvas-constructor');
 
     let dispatcher = queue.connection.playStream(ytdl(music.url, {
              filter: 'audioonly'
            }, {quality: 'highestaudio'}), {
              bitrate: 384000,
              volume: queue.volume / 100,
              highWaterMark: 1024 * 1024 * 10
            })
      .on("end", reason => {
        if (reason === "Stream is not generating quickly enough.")
          console.log("Song ended.");
        else console.log(reason);

        if (queue.loop === true) queue.musics.push(queue.musics.shift());
        else queue.musics.shift();
        bot.play(guild, queue.musics[0]);
      })
      .on("error", err => console.error(err));
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    
  //  const img = await fetch(music.thumbnail);
//    const image = await img.buffer();
    
   // new Canvas(1280, 720)
 //   .addImage(image, 0, 0, 1280, 720)
    
    
    let embed1 = new discord.RichEmbed();
    queue.textChannel.send(
      embed1
        .setColor(bot.embedColor)
        .setAuthor(" Now Playing", bot.user.displayAvatarURL)
        .setDescription(`**[${music.title}](${music.url})**`)
       //.addField("Song Channel", `**[${music.ct}](${music.channelURL})**` , true)
      /* .addField(
         "Song Duration",
         `**${moment.duration(music.duration).format('DD:HH:mm:ss')}**` , true
        )*/
.setImage(music.thumbnail)
       // .setThumbnail(music.thumbnail)

        .setTimestamp(Date.now())
    );
  };
};
