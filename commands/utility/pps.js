const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "pps",
  category: "moderation",
  description: "Send a private partnership announcement",
  async execute(message, args, client) {

    // ===== CONFIG =====
    // Main owner of the bot
    const OWNER_ID = process.env.OWNER_ID;
    
    // Guards (Moderators who can access tickets and use moderation commands)
    const GUARDS_IDS = process.env.GUARDS_ID ? process.env.GUARDS_ID.split(",") : [];

    // Channel for private partnership tickets
    const CHANNEL_ID = process.env.PRIVATE_PARTNERSHIP_CHANNEL_ID;
    // ==================

    // Permission check
    if (![OWNER_ID, ...GUARDS_IDS].includes(message.author.id)) {
      return message.reply("❌ You do not have permission to use this command. Only OWNER or GUARDS can use it.");
    }

    // Check for ad text
    if (!args.length) {
      return message.reply("❌ Please provide the partnership message. Usage: `.pps <message>`");
    }

    const adMessage = args.join(" ");

    const channel = message.guild.channels.cache.get(CHANNEL_ID);
    if (!channel) return message.reply("❌ Private partnership channel not found. Please check PRIVATE_PARTNERSHIP_CHANNEL_ID in .env");

    // Embed
    const embed = new EmbedBuilder()
      .setColor(0xf1c30f) // gold
      .setTitle("🤝 Privet Partnership Announcement")
      .setDescription(adMessage)
      .setFooter({ text: `Partnership posted by ${message.author.tag}` })
      .setTimestamp();

    // Send embed and tag everyone
    await channel.send({ 
      content: "@everyone", 
      embeds: [embed],
      allowedMentions: { parse: ["everyone"] }
    });

    // Confirmation
    message.reply("✅ Private partnership message sent successfully.");
  }
};
