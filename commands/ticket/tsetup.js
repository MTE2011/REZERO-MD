const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'tsetup',
    category: 'ticket',
    description: 'Setup the ticket panel (Owner only)',
    async execute(message, args, client) {
        // Main owner of the bot
        const OWNER_ID = process.env.OWNER_ID;

        if (message.author.id !== OWNER_ID) {
            return message.reply('❌ Only the bot owner can use this command!');
        }

        const channelId = process.env.TICKET_CHANNEL_ID || message.channel.id;
        const channel = client.channels.cache.get(channelId) || message.channel;

        // Delete old ticket messages to avoid duplicates
        try {
            const messages = await channel.messages.fetch({ limit: 50 });
            const oldBotMessages = messages.filter(m => m.author.id === client.user.id);
            
            for (const msg of oldBotMessages.values()) {
                await msg.delete().catch(err => console.error('Failed to delete old ticket message:', err));
            }
        } catch (error) {
            console.error('Error cleaning up old messages:', error);
        }

        const embed = new EmbedBuilder()
            .setColor(0x00aaff)
            .setTitle('📩 Support Ticket System')
            .setDescription('Need help? Select a category below or click the button to open a ticket!\n\n**Available Ticket Types:**\n🛠️ **Support** - General help and support\n🚩 **Report** - Report a user or incident\n💰 **Buy** - Inquiries about purchases\n⚖️ **Appeal** - Appeal a ban or warning\n🤝 **Partnership** - Partnership inquiries\n❓ **Other** - Anything else')
            .setFooter({ text: 'REZERO-MD Support System' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('open_ticket')
                    .setLabel('Open Ticket')
                    .setEmoji('🎫')
                    .setStyle(ButtonStyle.Primary)
            );

        const menuRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_category_direct')
                    .setPlaceholder('Or select a category directly...')
                    .addOptions([
                        { label: 'Support', value: 'support', emoji: '🛠️' },
                        { label: 'Report', value: 'report', emoji: '🚩' },
                        { label: 'Buy', value: 'buy', emoji: '💰' },
                        { label: 'Appeal', value: 'appeal', emoji: '⚖️' },
                        { label: 'Partnership', value: 'partnership', emoji: '🤝' },
                        { label: 'Other', value: 'other', emoji: '❓' },
                    ])
            );

        await channel.send({ 
            content: '@everyone', 
            embeds: [embed], 
            components: [row, menuRow],
            allowedMentions: { parse: ['everyone'] }
        });

        if (channel.id !== message.channel.id) {
            message.reply(`✅ Ticket panel has been sent to <#${channel.id}>`);
        }
    }
};
