const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	let reason = args.slice(1).join(' ');
	let user = msg.mentions.users.first();
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) return msg.reply(lang.ban_nomention).then(m => m.delete(10000));
	if (user === msg.author) return msg.channel.send(lang.ban_yourself);
	if (!reason) return msg.reply(lang.ban_noinput).then(m => m.delete(10000));

	if (!msg.guild.member(user).bannable) return msg.reply(lang.ban_nopermission).then(m => m.delete(10000));
	msg.guild.ban(user);

	var banned = lang.ban_banned.replace('%usertag', user.tag);
	msg.channel.send(banned);

	var bandescription = lang.ban_bandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason);
	const embed = new Discord.RichEmbed()
	.setAuthor(`${lang.ban_bannedby} ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
	.setThumbnail(user.displayAvatarURL)
	.setColor('#FF0000')
	.setTimestamp()
	.setDescription(bandescription);

	user.send({ embed: embed });

	if (tableload.modlog === 'true') {
		const modlogchannel = client.channels.get(tableload.modlogchannel);
		return modlogchannel.send({ embed: embed });
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['b'],
    userpermissions: ['BAN_MEMBERS']
};
exports.help = {
	name: 'ban',
	description: 'Ban a user from the discord server with a certain reason',
	usage: 'ban @User {reason}',
	example: ['ban @Monkeyyy11#7584 Toxic behavior'],
	category: 'moderation',
    botpermissions: ['BAN_MEMBERS', 'SEND_MESSAGES']
};

