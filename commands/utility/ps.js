const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ps",
  category: "moderation",
  description: "Send a partnership announcement",
  async execute(message, args, client) {

    // ===== CONFIG =====
    // Main owner of the bot
    const OWNER_ID = process.env.OWNER_ID;
    
    // Guards (Moderators who can access tickets and use moderation commands)
    const GUARDS_IDS = process.env.GUARDS_ID ? process.env.GUARDS_ID.split(",") : [];

    // Channel for partnership tickets
    const CHANNEL_ID = process.env.PARTNERSHIP_CHANNEL_ID;
    
    // Role to ping for partnerships
    const ROLE_ID = process.env.PARTNER_ROLE_ID;
    // ==================

    // Permission check
    if (![OWNER_ID, ...GUARDS_IDS].includes(message.author.id)) {
      return message.reply("❌ You do not have permission to use this command. Only OWNER or GUARDS can use it.");
    }

    // Check for ad text
    if (!args.length) {
      return message.reply("❌ Please provide the partnership message. Usage: `.ps <message>`");
    }

    const adMessage = args.join(" ");

    const channel = message.guild.channels.cache.get(CHANNEL_ID);
    if (!channel) return message.reply("❌ Partnership channel not found. Please check PARTNERSHIP_CHANNEL_ID in .env");

    // Embed
    const embed = new EmbedBuilder()
      .setColor(0x221cff) // cool blue
      .setTitle("🤝 PubliC Partnership Announcement")
      .setDescription(adMessage)
      .setFooter({ text: `Partnership posted by ${message.author.tag}` })
      .setTimestamp();

    // Send embed and tag the role
    await channel.send({ 
      content: ROLE_ID ? `<@&${ROLE_ID}>` : "@everyone", 
      embeds: [embed],
      allowedMentions: { parse: ["roles", "everyone"] }
    });

    // Confirmation
    message.reply("✅ Partnership message sent successfully.");
  }
};
