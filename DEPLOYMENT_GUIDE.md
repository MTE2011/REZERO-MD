# REZERO-MD Deployment Guide

## ✅ Fixes Applied - Ready to Deploy!

Your bot has been fixed and the changes are now live on GitHub. Follow these steps to update your running bot.

---

## 🚀 Quick Update (For Existing Deployments)

### Step 1: Navigate to your bot directory
```bash
cd /path/to/REZERO-MD
```

### Step 2: Pull the latest fixes
```bash
git pull origin main
```

### Step 3: Restart your bot

**If using PM2:**
```bash
pm2 restart rezero-md
# or if you named it differently:
pm2 restart all
```

**If running manually:**
```bash
# Stop the bot (Ctrl+C in the terminal where it's running)
# Then start it again:
npm start
```

**If using a hosting service (like Replit, Heroku, etc.):**
- Simply restart the service through their dashboard
- The latest code will be pulled automatically

---

## 🆕 Fresh Installation

If you're setting up the bot for the first time:

### Step 1: Clone the repository
```bash
git clone https://github.com/MTE2011/REZERO-MD.git
cd REZERO-MD
```

### Step 2: Install dependencies
```bash
pnpm install
# or if you don't have pnpm:
npm install
```

### Step 3: Configure environment variables
```bash
cp .env.example .env
nano .env  # or use any text editor
```

**Required settings in `.env`:**
```env
TOKEN=your_discord_bot_token_here
PREFIX=.
OWNER_ID=your_discord_user_id
REG_CHANNEL=channel_id_for_registration
```

### Step 4: Start the bot
```bash
npm start
```

---

## 🐛 What Was Fixed?

### Bug #1: Royal Card Registration Not Working ✅
**Problem:** Users couldn't use economy/gambling commands even after registering.

**Solution:** Added missing `await` keyword in the Royal Card check.

**Result:** Registration now works perfectly!

### Bug #2: Git Update Command Error ✅
**Problem:** `.update` command showed confusing error about Git repository.

**Solution:** Added proper Git repository detection and clearer error messages.

**Result:** Update command now provides helpful instructions!

---

## 🧪 Testing Your Bot

After updating, test these commands:

### Test Registration:
```
.reg 25
```
Should show: "👑 Royal Card Registered"

### Test Profile:
```
.p
```
Should show your Royal Card with registration status

### Test Economy Commands:
```
.daily
.balance
.work
```
Should work without registration errors

### Test Update Command (as bot owner):
```
.update
```
Should check for updates or show proper error if not a Git repo

---

## 📁 File Structure

```
REZERO-MD/
├── commands/
│   ├── economy/      # Balance, daily, work, etc.
│   ├── gambling/     # Gambling games
│   ├── profile/      # Registration, profile view
│   ├── shop/         # Shop system
│   ├── ticket/       # Ticket system
│   └── utility/      # Update, ping, menu, etc.
├── events/
│   ├── messageCreate.js  # ✅ FIXED - Added await
│   └── ready.js
├── utils/
│   └── database.js       # User database handler
├── data/
│   ├── users/            # Individual user JSON files
│   ├── shop.json
│   ├── lottery.json
│   └── tickets.json
├── .env                  # Your configuration (create from .env.example)
├── index.js              # Main bot file
└── package.json
```

---

## 🔧 Troubleshooting

### Issue: "Module not found" errors
**Solution:**
```bash
pnpm install
# or
npm install
```

### Issue: Bot doesn't respond to commands
**Check:**
1. Is the bot online in Discord?
2. Is your TOKEN correct in `.env`?
3. Does the bot have proper permissions in your server?
4. Are you using the correct prefix (default is `.`)?

### Issue: Registration still not working
**Solution:**
1. Make sure you pulled the latest code: `git pull origin main`
2. Restart the bot completely (don't just reload)
3. Check console for any error messages

### Issue: Database errors
**Solution:**
1. Make sure the `data/` directory exists
2. Check that the bot has write permissions
3. The bot will auto-create `data/users/` when needed

### Issue: Update command says "not a Git repository"
**Solution:**
This is expected if you downloaded the bot as a ZIP file. To enable updates:
```bash
# Delete the old folder and clone properly:
git clone https://github.com/MTE2011/REZERO-MD.git
cd REZERO-MD
pnpm install
# Copy your .env file back
npm start
```

---

## 📞 Support

- **GitHub Issues:** https://github.com/MTE2011/REZERO-MD/issues
- **Latest Code:** https://github.com/MTE2011/REZERO-MD

---

## ✨ Features

- 👑 Royal Card system with registration
- 💰 Full economy system (wallet, bank, daily rewards)
- 🎰 Gambling games (slots, blackjack, roulette, etc.)
- 🏪 Shop system with items
- 🎫 Ticket support system
- 👮 Moderation commands
- 📊 Leaderboards
- 🎲 Fun games and activities

---

**Last Updated:** January 30, 2026
**Version:** 1.0.0 (Fixed)
**Status:** ✅ All Critical Bugs Resolved
