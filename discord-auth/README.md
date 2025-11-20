# Discord OAuth2 Autentizační Systém

Kompletní řešení pro ověření členství uživatelů na Discord serveru před poskytnutím přístupu k webovému obsahu.

## 🚀 Funkce

- ✅ Discord OAuth2 autentizace
- ✅ Ověření členství na konkrétním Discord serveru
- ✅ CSRF ochrana pomocí `state` parametru
- ✅ Session management
- ✅ Chráněné stránky
- ✅ Moderní, responzivní UI

## 📋 Požadavky

- Node.js 16 nebo vyšší
- Discord aplikace (vytvořená v Discord Developer Portal)
- Discord server (Guild), kde chcete ověřovat členství

## 🛠️ Instalace

### 1. Naklonujte nebo stáhněte projekt

```bash
cd discord-auth
```

### 2. Nainstalujte závislosti

```bash
npm install
```

### 3. Vytvořte Discord aplikaci

1. Přejděte na [Discord Developer Portal](https://discord.com/developers/applications)
2. Klikněte na **"New Application"**
3. Pojmenujte aplikaci a potvrďte
4. V levém menu přejděte na **"OAuth2"**
5. V sekci **"Redirects"** přidejte:
   - Pro lokální vývoj: `http://localhost:3000/callback`
   - Pro produkci: `https://vaseweb.cz/callback`
6. Uložte změny
7. Zkopírujte **Client ID** a **Client Secret**

### 4. Získejte Guild ID (ID serveru)

1. V Discord aplikaci zapněte Developer Mode:
   - Nastavení → Pokročilé → Vývojářský režim
2. Klikněte pravým tlačítkem na váš server
3. Vyberte **"Kopírovat ID serveru"**

### 5. Nakonfigurujte environment variables

Vytvořte soubor `.env` (zkopírujte z `.env.example`):

```bash
cp .env.example .env
```

Vyplňte hodnoty v `.env`:

```env
DISCORD_CLIENT_ID=váš_client_id
DISCORD_CLIENT_SECRET=váš_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/callback
GUILD_ID=id_vašeho_serveru
SESSION_SECRET=náhodný_dlouhý_string
NODE_ENV=development
PORT=3000
```

### 6. Spusťte server

Pro vývoj (s auto-reloadem):
```bash
npm run dev
```

Pro produkci:
```bash
npm start
```

Server poběží na `http://localhost:3000`

## 📁 Struktura projektu

```
discord-auth/
├── server.js              # Hlavní Express server
├── package.json           # NPM závislosti
├── .env.example          # Příklad konfigurace
├── .env                  # Vaše konfigurace (neverzovat!)
├── README.md             # Tento soubor
└── public/
    ├── index.html        # Úvodní stránka s přihlášením
    └── dashboard.html    # Chráněná stránka
```

## 🔐 OAuth2 Scopes

Aplikace vyžaduje následující oprávnění (scopes):

- **`identify`** - Získání základních informací o uživateli (username, avatar)
- **`guilds`** - Získání seznamu serverů, kde je uživatel členem

Tyto scopes jsou automaticky zahrnuty v autorizační URL.

## 🌐 Endpointy

| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/` | GET | Úvodní stránka s přihlašovacím tlačítkem |
| `/auth/discord` | GET | Zahájení OAuth2 flow |
| `/callback` | GET | Callback po autorizaci |
| `/dashboard` | GET | Chráněná stránka (vyžaduje přihlášení) |
| `/api/user` | GET | API endpoint pro data přihlášeného uživatele |
| `/logout` | GET | Odhlášení uživatele |

## 🔒 Bezpečnost

- **CSRF ochrana**: Používá `state` parametr pro ověření autenticity požadavků
- **Session security**: HttpOnly cookies, secure flag v produkci
- **Environment variables**: Citlivé údaje jsou uloženy v `.env` souboru
- **Server-side ověření**: Členství je ověřováno na backendu, ne na frontendu

## 🚀 Nasazení do produkce

### Vercel

1. Nainstalujte Vercel CLI:
```bash
npm i -g vercel
```

2. Přihlaste se:
```bash
vercel login
```

3. Nasaďte:
```bash
vercel
```

4. Nastavte environment variables ve Vercel dashboardu

### Jiné platformy

Pro nasazení na jiné platformy (Heroku, Railway, DigitalOcean):

1. Ujistěte se, že máte nastavené všechny environment variables
2. Změňte `DISCORD_REDIRECT_URI` na vaši produkční URL
3. Nastavte `NODE_ENV=production`
4. Aktualizujte redirect URI v Discord Developer Portal

## ❓ Časté problémy

### "Invalid redirect_uri"
- Ujistěte se, že `DISCORD_REDIRECT_URI` v `.env` přesně odpovídá URL v Discord Developer Portal
- URL musí být identické včetně protokolu (http/https)

### "Nemáte přístup" (not_member)
- Ověřte, že `GUILD_ID` je správné ID vašeho serveru
- Ujistěte se, že uživatel je skutečně členem serveru

### Session problémy
- Zkontrolujte, že máte nastavený `SESSION_SECRET`
- V produkci musí být `NODE_ENV=production` pro secure cookies

## 📝 Poznámky

- Session vyprší po 24 hodinách
- Pro lokální testování není potřeba HTTPS
- V produkci doporučujeme používat HTTPS
- `.env` soubor NIKDY neverzujte (je v `.gitignore`)

## 📄 Licence

MIT

## 🤝 Podpora

Pro problémy nebo dotazy vytvořte issue v repozitáři.
