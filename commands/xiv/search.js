const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI({
    private_key: process.env.XIV_TOKEN,
    language: 'en',
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xivsearch')
        .setDescription('Returns the description of the abilitiy provided.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Achievement, Action, Status, Mount, Item, Fate, Quest')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The name of the ability to search')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('index')
                // eslint-disable-next-line quotes
                .setDescription("Use this if you haven't found the ability that you wanted (leave to 0 if unsure)")
                .setRequired(false)),

    async execute(interaction) {
        const search_type = interaction.options.getString('type');
        const search_index = interaction.options.getNumber('index') ?? 0;

        xiv.search(interaction.options.getString('query'), { indexes: [search_type] }).then(response => {
            const result_count = response.Pagination.ResultsTotal;

            if (result_count == 0) {
                interaction.reply(`Could not find the ability named **${interaction.options.getString('query')}**`);
                return;
            }

            fetch('https://xivapi.com' + response.Results[search_index].Url)
                .then(response => response.json())
                .then(data => {

                    if (search_type == 'Action') {
                        const desc = data.Description;
                        let desc_replace = desc.replace(/<\/?span(?:\s+style="color:\s*[^"]+"){1}[^>]*>/gi, '').replace(/<\/span>/gi, '');
                        let cost_value = data.PrimaryCostValue;

                        if (cost_value == 0) { cost_value = 'No MP cost.'; }
                        if (desc_replace == '') { desc_replace = 'No description was found.'; }

                        const embed = new EmbedBuilder()
                            .setColor(0x000000)
                            .setTitle(`${data.Name_en} / ${data.Name_de} / ${data.Name_fr} / ${data.Name_ja}`)
                            .setDescription(`*Found ${result_count} results, displaying ID:${search_index}.*`)
                            .setThumbnail('https://xivapi.com' + data.IconHD)
                            .addFields(
                                { name: 'Class', value: `${data.ClassJob.NameEnglish}`, inline: true },
                                { name: 'Category', value: `${data.ActionCategory.Name}`, inline: true },
                                { name: 'Expansion', value: `${data.GamePatch.ExName}`, inline: true },
                                { name: 'Patch', value: `${data.GamePatch.Name}`, inline: true },
                                { name: 'Description', value: `${desc_replace}` },
                                { name: 'Mana', value: `${data.PrimaryCostValue * 100}` },
                            )
                            .setFooter({ text: `xivapi.com | Response time: ${response.SpeedMs}ms` });

                        interaction.reply({ embeds: [embed] });
                        return;
                    }

                    if (search_type == 'Achievement') {
                        const desc = data.Description;
                        let desc_replace = desc.replace(/<\/?span(?:\s+style="color:\s*[^"]+"){1}[^>]*>/gi, '').replace(/<\/span>/gi, '');
                        let title_replace = '';

                        if (desc_replace == '') { desc_replace = 'No description was found.'; }
                        if (data.Title == null) { title_replace = 'No title.'; }
                        else { title_replace = data.Title.Name; }

                        const embed = new EmbedBuilder()
                            .setColor(0x000000)
                            .setTitle(`${data.Name_en} / ${data.Name_de} / ${data.Name_fr} / ${data.Name_ja}`)
                            .setDescription(`*Found ${result_count} results, displaying ID:${search_index}.*`)
                            .setThumbnail('https://xivapi.com' + data.IconHD)
                            .addFields(
                                { name: 'Expansion', value: `${data.GamePatch.ExName}`, inline: true },
                                { name: 'Patch', value: `${data.GamePatch.Name}`, inline: true },
                                { name: '\u200B', value: '\u200B' },
                                { name: 'Points', value: `${data.Points}`, inline: true },
                                { name: 'Title', value: `${title_replace}`, inline: true },
                                { name: 'Description', value: `${desc_replace}` },
                            )
                            .setFooter({ text: `xivapi.com | Response time: ${response.SpeedMs}ms` });

                        interaction.reply({ embeds: [embed] });
                        return;
                    }

                    const embed = new EmbedBuilder()
                        .setColor(0x0000FF)
                        .setTitle('Not yet implemented!')
                        .setFooter({ text: `xivapi.com | Response time: ${response.SpeedMs}ms` });

                    interaction.reply({ embeds: [embed] });
                },
            ).catch((err) => {
                console.log(err);

                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Something went wrong!')
                    .setFooter({ text: `xivapi.com | Response time: ${response.SpeedMs}ms` });

                interaction.reply({ embeds: [embed] });
            });
        });
    },
};

/*
    ACTION:
    Name_en / Name_de / Name_fr / Name_ja
    ActionCategory.Name / GamePatch.ExName / GamePatch.Name
    PrimaryCostValue * 100
    Description
    IconHD (https://xivapi.com/...)

    ACHIVEMENT:
    Name_en / Name_de / Name_fr / Name_ja
    GamePatch.ExName / GamePatch.Name
    Points / Title
    Description
    IconHD (https://xivapi.com/...)
*/