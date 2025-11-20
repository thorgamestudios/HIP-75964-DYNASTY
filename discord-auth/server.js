require('dotenv').config();

const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurace z environment variables
const config = {
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUri: process.env.DISCORD_REDIRECT_URI,
    guildId: process.env.GUILD_ID
};

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS v produkci
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hodin
    }
}));

// Statické soubory
app.use(express.static(path.join(__dirname, 'public')));

// Hlavní stránka
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Discord OAuth2 autorizační URL
app.get('/auth/discord', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    req.session.oauthState = state;

    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: 'identify guilds',
        state: state
    });

    res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

// Callback endpoint
app.get('/callback', async (req, res) => {
    const { code, state } = req.query;

    // Ověření state parametru (CSRF ochrana)
    if (!state || state !== req.session.oauthState) {
        return res.redirect('/?error=invalid_state');
    }

    // Vyčištění state ze session
    delete req.session.oauthState;

    if (!code) {
        return res.redirect('/?error=no_code');
    }

    try {
        // 1. Získání access tokenu
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: config.redirectUri
            })
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Token error:', tokenData);
            return res.redirect('/?error=token_failed');
        }

        const { access_token } = tokenData;

        // 2. Získání informací o uživateli
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const userData = await userResponse.json();

        // 3. Získání seznamu serverů uživatele
        const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const guildsData = await guildsResponse.json();

        // 4. Kontrola členství v konkrétním serveru
        const isMember = guildsData.some(guild => guild.id === config.guildId);

        if (isMember) {
            // Uložení uživatelských dat do session
            req.session.user = {
                id: userData.id,
                username: userData.username,
                discriminator: userData.discriminator,
                avatar: userData.avatar,
                verified: true
            };

            res.redirect('/dashboard');
        } else {
            res.redirect('/?error=not_member');
        }

    } catch (error) {
        console.error('OAuth error:', error);
        res.redirect('/?error=server_error');
    }
});

// Chráněná stránka - Dashboard
app.get('/dashboard', (req, res) => {
    if (!req.session.user || !req.session.user.verified) {
        return res.redirect('/?error=unauthorized');
    }

    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API endpoint pro získání informací o přihlášeném uživateli
app.get('/api/user', (req, res) => {
    if (!req.session.user || !req.session.user.verified) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json(req.session.user);
});

// Odhlášení
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
    console.log('Ujistěte se, že máte nastavené environment variables:');
    console.log('- DISCORD_CLIENT_ID');
    console.log('- DISCORD_CLIENT_SECRET');
    console.log('- DISCORD_REDIRECT_URI');
    console.log('- GUILD_ID');
});
