const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('A simple ping command'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
