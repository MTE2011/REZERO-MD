const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "news",
  category: "moderation",
  description: "Send a server-wide news announcement",
  async execute(message, args, client) {

    // ===== CONFIG =====
    // Main owner of the bot
    const OWNER_ID = process.env.OWNER_ID;
    
    // Guards (Moderators who can access tickets and use moderation commands)
    const GUARDS_IDS = process.env.GUARDS_ID
      ? process.env.GUARDS_ID.split(",")
      : [];

    // Channel for news messages
    const CHANNEL_ID = process.env.NEWS_CHANNEL_ID;
    // ==================

    // Permission check
    if (![OWNER_ID, ...GUARDS_IDS].includes(message.author.id)) {
      return message.reply("❌ You do not have permission to use this command.");
    }

    // Message check
    if (!args.length) {
      return message.reply("❌ Please provide a news message.\nUsage: `.news <message>`");
    }

    const newsText = args.join(" ");

    // Get channel
    const channel = message.guild.channels.cache.get(CHANNEL_ID);
    if (!channel) {
      return message.reply("❌ News channel not found. Please check NEWS_CHANNEL_ID in .env");
    }

    // Create embed
    const embed = new EmbedBuilder()
      .setColor(0x00bfff)
      .setTitle("📰 IMPORTANT SERVER NEWS")
      .setDescription(newsText)
      .setFooter({ text: `Posted by ${message.author.tag}` })
      .setTimestamp();

    // Send message with @everyone ping
    await channel.send({
      content: "📢 @everyone",
      embeds: [embed],
      allowedMentions: {
        parse: ["everyone"]
      }
    });

    // Confirmation
    message.reply("✅ News message sent and everyone was notified.");
  }
}; 
