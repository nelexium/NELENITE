const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Provides details about the server.'),
    async execute(interaction) {
        await interaction.reply(`This server is called ${interaction.guild.name}`);
    },
};