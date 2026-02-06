const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ ${client.user.tag} is online!`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        console.log(`👥 Watching ${client.users.cache.size} users`);
        
        client.user.setActivity(`${process.env.PREFIX || '.'}help | REZERO-MD`, { type: 'PLAYING' });

        // 1. Connected / Ready Message in Log Channel
        const logChannelId = process.env.LOG_CHANNEL_ID;
        const ownerId = process.env.OWNER_ID;
        
        if (logChannelId) {
            try {
                const logChannel = await client.channels.fetch(logChannelId);
                if (logChannel) {
                    const readyEmbed = new EmbedBuilder()
                        .setColor(0x00ff00)
                        .setTitle('🤖 Bot Connected')
                        .setDescription(`The bot is now **online** and **ready**!`)
                        .addFields(
                            { name: 'Status', value: '🟢 Connected', inline: true },
                            { name: 'Owner', value: ownerId ? `<@${ownerId}>` : 'Not Set', inline: true },
                            { name: 'Latency', value: `${client.ws.ping}ms`, inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: 'REZERO-MD Status System' });

                    await logChannel.send({ 
                        content: ownerId ? `<@${ownerId}>` : null, 
                        embeds: [readyEmbed] 
                    });
                    console.log(`✅ Connected message sent to log channel: ${logChannelId}`);
                }
            } catch (error) {
                console.error('❌ Error sending connected message:', error);
            }
        }

        // 2. Auto-send/Update Ticket Panel on Startup
        const panelChannelId = process.env.TICKET_CHANNEL_ID;
        if (panelChannelId) {
            try {
                const channel = await client.channels.fetch(panelChannelId);
                if (channel) {
                    // Delete old ticket messages to avoid duplicates
                    const messages = await channel.messages.fetch({ limit: 50 });
                    const oldBotMessages = messages.filter(m => m.author.id === client.user.id);
                    
                    for (const msg of oldBotMessages.values()) {
                        await msg.delete().catch(err => console.error('Failed to delete old ticket message:', err));
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
                    console.log(`✅ Ticket panel updated in channel: ${panelChannelId}`);
                }
            } catch (error) {
                console.error('❌ Error updating ticket panel on startup:', error);
            }
        }
    }
};
