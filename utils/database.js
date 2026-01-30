const fs = require('fs').promises;
const path = require('path');

class MultiDatabase {
    constructor(baseDir) {
        this.baseDir = baseDir;
        this.paths = {
            profiles: path.join(baseDir, 'profiles.json'),
            balances: path.join(baseDir, 'balances.json'),
            timers: path.join(baseDir, 'timers.json'),
            shop: path.join(baseDir, 'shop.json'),
            lottery: path.join(baseDir, 'lottery.json'),
            tickets: path.join(baseDir, 'tickets.json')
        };
        this.data = {
            profiles: {},
            balances: {},
            timers: {},
            shop: {},
            lottery: { pot: 0, tickets: [] },
            tickets: {}
        };
    }

    async load() {
        for (const [key, filePath] of Object.entries(this.paths)) {
            try {
                const content = await fs.readFile(filePath, 'utf8');
                this.data[key] = JSON.parse(content);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    await this.save(key);
                } else {
                    console.error(`Error loading ${key} database:`, error);
                }
            }
        }
    }

    async save(key) {
        try {
            const filePath = this.paths[key];
            let dataToSave = this.data[key];
            
            if (['profiles', 'balances', 'timers'].includes(key)) {
                const sorted = {};
                Object.keys(dataToSave).sort().forEach(k => {
                    sorted[k] = dataToSave[k];
                });
                dataToSave = sorted;
            }

            await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2));
        } catch (error) {
            console.error(`Error saving ${key} database:`, error);
        }
    }

    getUser(userId, username = 'Unknown') {
        if (!this.data.profiles[userId]) {
            this.data.profiles[userId] = {
                id: userId,
                name: username,
                registered: false,
                role: 'USER',
                bio: 'No bio set.',
                age: 'Not set',
                banned: false
            };
        }
        if (!this.data.balances[userId]) {
            this.data.balances[userId] = {
                wallet: 1000,
                bank: 0,
                inventory: []
            };
        }
        if (!this.data.timers[userId]) {
            this.data.timers[userId] = {
                lastDaily: null,
                lastWeekly: null,
                lastWork: null,
                lastCrime: null
            };
        }

        const profile = this.data.profiles[userId];
        const balance = this.data.balances[userId];
        const timer = this.data.timers[userId];

        // Ensure we return a structured object that commands expect
        return {
            info: profile,
            economy: {
                wallet: balance.wallet,
                bank: balance.bank,
                inventory: balance.inventory,
                lastDaily: timer.lastDaily,
                lastWeekly: timer.lastWeekly,
                lastWork: timer.lastWork,
                lastCrime: timer.lastCrime
            },
            // Direct access for simpler commands
            wallet: balance.wallet,
            bank: balance.bank
        };
    }

    async registerUser(userId, username, age) {
        this.getUser(userId, username);
        this.data.profiles[userId].registered = true;
        this.data.profiles[userId].name = username;
        this.data.profiles[userId].age = age;
        await this.save('profiles');
    }

    async setRole(userId, role) {
        this.getUser(userId);
        this.data.profiles[userId].role = role;
        await this.save('profiles');
    }

    async setBan(userId, status) {
        this.getUser(userId);
        this.data.profiles[userId].banned = status;
        await this.save('profiles');
    }

    async setBio(userId, bio) {
        this.getUser(userId);
        this.data.profiles[userId].bio = bio;
        await this.save('profiles');
    }

    async addMoney(userId, amount, type = 'wallet') {
        this.getUser(userId);
        this.data.balances[userId][type] += amount;
        await this.save('balances');
        return this.data.balances[userId][type];
    }

    async removeMoney(userId, amount, type = 'wallet') {
        this.getUser(userId);
        if (this.data.balances[userId][type] < amount) return false;
        this.data.balances[userId][type] -= amount;
        await this.save('balances');
        return true;
    }

    async updateUser(userId, data) {
        this.getUser(userId);
        const timerKeys = ['lastDaily', 'lastWeekly', 'lastWork', 'lastCrime'];
        let timerUpdated = false;
        for (const key of timerKeys) {
            if (data[key] !== undefined) {
                this.data.timers[userId][key] = data[key];
                timerUpdated = true;
            }
        }
        if (timerUpdated) await this.save('timers');

        const infoKeys = ['name', 'registered', 'role', 'bio', 'age', 'banned'];
        let infoUpdated = false;
        for (const key of infoKeys) {
            if (data[key] !== undefined) {
                this.data.profiles[userId][key] = data[key];
                infoUpdated = true;
            }
        }
        if (infoUpdated) await this.save('profiles');
        
        const economyKeys = ['wallet', 'bank', 'inventory'];
        let economyUpdated = false;
        for (const key of economyKeys) {
            if (data[key] !== undefined) {
                this.data.balances[userId][key] = data[key];
                economyUpdated = true;
            }
        }
        if (economyUpdated) await this.save('balances');
    }

    async addItem(userId, item) {
        this.getUser(userId);
        this.data.balances[userId].inventory.push(item);
        await this.save('balances');
    }

    async removeItem(userId, itemName) {
        this.getUser(userId);
        const index = this.data.balances[userId].inventory.findIndex(i => i.name === itemName);
        if (index === -1) return false;
        this.data.balances[userId].inventory.splice(index, 1);
        await this.save('balances');
        return true;
    }

    getShop() { return this.data.shop; }
    async addShopItem(id, item) { this.data.shop[id] = item; await this.save('shop'); }
    async removeShopItem(id) { delete this.data.shop[id]; await this.save('shop'); }

    async createTicket(channelId, userId) {
        this.data.tickets[channelId] = { userId, createdAt: Date.now() };
        await this.save('tickets');
    }
    async deleteTicket(channelId) { delete this.data.tickets[channelId]; await this.save('tickets'); }
    getTicket(channelId) { return this.data.tickets[channelId]; }

    getLeaderboard(type = 'wallet', limit = 10) {
        return Object.entries(this.data.balances)
            .sort((a, b) => (b[1][type] || 0) - (a[1][type] || 0))
            .slice(0, limit);
    }
}

module.exports = MultiDatabase;
