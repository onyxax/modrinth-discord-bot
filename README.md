<p align="center">
  <img src="assets/bot-icon.png" width="96" alt="Modrinth Bot"/>
</p>

<h1 align="center">Modrinth Discord Bot <sub>(unofficial)</sub></h1>
<p align="center">Search Modrinth with Discord Components V2 — wide, organized, multilingual.</p>

<p align="center">
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node"/></a>
  <a href="https://discord.js.org"><img src="https://img.shields.io/badge/discord.js-14.25-5865F2?style=flat-square&logo=discord&logoColor=white" alt="discord.js"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-00AF5C?style=flat-square" alt="License"/></a>
  <img src="https://img.shields.io/badge/Components-V2-00AF5C?style=flat-square" alt="Components V2"/>
  <img src="https://img.shields.io/badge/i18n-en%20%7C%20ar%20%7C%20fr%20%7C%20hi-00AF5C?style=flat-square" alt="i18n"/>
</p>

<p align="center">
  <b>Language:</b>
  <a href="#english">English</a> •
  <a href="#العربية">العربية</a> •
  <a href="#français">Français</a> •
  <a href="#हिन्दी">हिन्दी</a>
</p>

---

<a id="english"></a>
## <img src="https://hylab.vercel.app/api/icons/globe?color=00AF5C&size=20&format=png" width="20"/> English

### Overview
Unofficial Discord bot for **Modrinth** + Minecraft utilities. Built with `discord.js@14` and **Discord Components V2** (wide `Container` layout), it provides fast Modrinth search, modlists, server status, skins, MCTiers ranks, seeds and notifications — fully localized in 4 languages with a unified design system.

**Why this bot?**
- <img src="https://hylab.vercel.app/api/icons/layers?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> **Wide & Organized** — `Container` with accent `00AF5C`, `Separator` dividers, `Section` + `Thumbnail` (small on top with title) + `MediaGallery` (2 large images) + `ActionRow` inside the container
- <img src="https://hylab.vercel.app/api/icons/search?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> **Fast Search** — Modrinth `/search` with facets (`project_type`, `versions`, `categories`), version hydration with cache, download-sorted
- <img src="https://hylab.vercel.app/api/icons/bell?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> **Notifications** — background poll every 30 min, DM on new version
- <img src="https://hylab.vercel.app/api/icons/globe?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> **Multilingual** — `en`/`ar`/`fr`/`hi` via `src/services/i18n.js` + `src/locales/*.json` (user + guild scope)

### Features

| <img src="https://hylab.vercel.app/api/icons/puzzle?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> Command | Description |
|---|---|
| <img src="https://hylab.vercel.app/api/icons/puzzle?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/mods` | Search mods (loader + version filter) |
| <img src="https://hylab.vercel.app/api/icons/package?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/modpacks` | Search modpacks |
| <img src="https://hylab.vercel.app/api/icons/paintbrush?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/resourcepacks` | Search resource packs |
| <img src="https://hylab.vercel.app/api/icons/sparkles?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/shaders` | Search shaders |
| <img src="https://hylab.vercel.app/api/icons/folder?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/datapacks` | Search datapacks |
| <img src="https://hylab.vercel.app/api/icons/plug-2?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/plugins` | Search plugins |
| <img src="https://hylab.vercel.app/api/icons/search?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/discovery` | Discover by category (50 intents) |
| <img src="https://hylab.vercel.app/api/icons/dices?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/random` | Random resource |
| <img src="https://hylab.vercel.app/api/icons/list?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/modlist` | Create / add / list / share / delete modlists |
| <img src="https://hylab.vercel.app/api/icons/bell?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/notify` | Follow projects (`me` / `list` / `remove`) |
| <img src="https://hylab.vercel.app/api/icons/server?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/status` | Minecraft server status (mcsrvstat + minetools fallback) |
| <img src="https://hylab.vercel.app/api/icons/shield?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/rank` | MCTiers PVP profile |
| <img src="https://hylab.vercel.app/api/icons/user-round?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/skin` | Show / download skin |
| <img src="https://hylab.vercel.app/api/icons/user-round?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/user` | Modrinth user lookup |
| <img src="https://hylab.vercel.app/api/icons/sprout?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/seeds` | Community seeds (Reddit + legacy) |
| <img src="https://hylab.vercel.app/api/icons/bar-chart-3?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/botstatus` | Uptime, ping, RAM, guilds |
| <img src="https://hylab.vercel.app/api/icons/book-open-check?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/help` | Interactive help with select menu (custom emojis) |
| <img src="https://hylab.vercel.app/api/icons/settings?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/settings` | Language (user / guild) |
| <img src="https://hylab.vercel.app/api/icons/link-2?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> `/add` | Invite link |

**Resource Container (V2):** Title Section (title + `-# by author · Updated <t:R>` + popularity `star`/`palette` + Thumbnail) → Description + Source (`link2`) → Stats (`cloud-download`/`layers`/`globe`) → MediaGallery (2) → ActionRow (Download / Open) — single accent `00AF5C`, `Separator` dividers.

### Quick Start
```bash
git clone https://github.com/onyxax/modrinth-discord-bot
cd modrinth-discord-bot
npm install
cp .env.example .env  # fill tokens
npm start
```

### Configuration
Create `.env` (see `.env.example`):
```ini
DISCORD_TOKEN=...
DISCORD_CLIENT_ID=...
MODRINTH_TOKEN=mrp_...
MODRINTH_USER_AGENT=HydraModrinth/1.0 (contact: you@example.com)
```

### Project Structure
```
src/
  index.js              # client, command loader, presence, router
  config.js             # env validation
  commands/             # 18 slash commands (factory for 6)
  services/             # modrinth.js, notifierService.js, i18n.js
  utils/                # theme.js, icons.js, embedBuilders.js, *_store.js
  data/                 # json persistence (guilds, modlists, notifications…)
  locales/              # en/ar/fr/hi.json (127 keys, 0 missing)
assets/icons/lucide/    # 32 PNGs (lucide, 64px, 00AF5C)
```

### Tech Stack
`Node >=18` · `discord.js 14.25` · `axios` · `dotenv` · `HyLab Icons API` (lucide, PNG 64)

### Deployment
`npm start` registers global commands via `@discordjs/rest` on `ClientReady`. Presence rotates every 5s. Notifier polls every 30m. Use PM2 / systemd for production.

---

<a id="العربية"></a>
<div dir="rtl">

## <img src="https://hylab.vercel.app/api/icons/globe?color=00AF5C&size=20&format=png" width="20"/> العربية

### نظرة عامة
بوت ديسكورد غير رسمي لـ **Modrinth** وأدوات ماينكرافت. مبني بـ `discord.js@14` ونظام **Components V2** العريض (`Container` + `Separator` + `Section` + `MediaGallery` + `ActionRow` داخل الحاوية) — بحث سريع، قوائم مودات، حالة السيرفرات، السكنات، ترتيب MCTiers، البذور والتنبيهات — مترجم بالكامل لـ 4 لغات بتصميم موحد.

**لماذا هذا البوت؟**
- <img src="https://hylab.vercel.app/api/icons/layers?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> **عريض ومنظم** — حاوية عريضة بلون `00AF5C`، فواصل طويلة، مصغرة صغيرة فوق مع الاسم + صورتان كبيرتان + أزرار داخل الحاوية
- <img src="https://hylab.vercel.app/api/icons/search?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> **بحث سريع** — واجهة Modrinth مع فلترة `project_type`/`versions`/`categories` وترتيب حسب التحميلات
- <img src="https://hylab.vercel.app/api/icons/bell?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> **تنبيهات** — فحص كل 30 دقيقة ورسالة خاصة عند التحديث
- <img src="https://hylab.vercel.app/api/icons/globe?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> **متعدد اللغات** — `ar`/`en`/`fr`/`hi` عبر `i18n.js`

### المميزات
نفس الجدول أعلاه — `/mods` للبحث، `/modpacks`، `/resourcepacks`، `/shaders`، `/datapacks`، `/plugins`، `/discovery`، `/random`، `/modlist`، `/notify`، `/status`، `/rank`، `/skin`، `/user`، `/seeds`، `/botstatus`، `/help` بقائمة اختيار بأيقوناتك المخصصة، `/settings`، `/add`.

**هيكل الحاوية:** عنوان Section (الاسم + `-# by author · Updated` + شعبية `star`/`palette` + مصغرة) → الوصف → التفاصيل (`Downloads`/`Versions`/`Platform`) → معرض صورتين → أزرار.

### البدء السريع
```bash
git clone https://github.com/onyxax/modrinth-discord-bot
cd modrinth-discord-bot
npm install
cp .env.example .env
npm start
```

### الإعداد
`.env` كما في `.env.example` — ضع `DISCORD_TOKEN` و `DISCORD_CLIENT_ID` و `MODRINTH_TOKEN`.

</div>

---

<a id="français"></a>
## <img src="https://hylab.vercel.app/api/icons/globe?color=00AF5C&size=20&format=png" width="20"/> Français

### Aperçu
Bot Discord non officiel pour **Modrinth** + utilitaires Minecraft. Construit avec `discord.js@14` et **Components V2** (conteneur large), recherche Modrinth rapide, modlists, statut serveur, skins, rangs MCTiers, seeds et notifications — entièrement traduit en 4 langues avec un design unifié (`00AF5C`).

**Points forts :** conteneur large avec `Thumbnail` en haut + 2 images + boutons intégrés ; recherche facettée Modrinth ; notifications DM toutes les 30 min ; i18n `en/ar/fr/hi`.

### Fonctionnalités
Même tableau que ci-dessus — 18 commandes slash, dont 6 via factory (`mods`, `modpacks`...), `discovery`/`random`/`modlist`/`notify`/`status`/`rank`/`skin`/`user`/`seeds`/`botstatus`/`help` (select avec emojis custom) /`settings`/`add`.

### Démarrage rapide
```bash
git clone https://github.com/onyxax/modrinth-discord-bot
cd modrinth-discord-bot
npm install
cp .env.example .env
npm start
```

---

<a id="हिन्दी"></a>
## <img src="https://hylab.vercel.app/api/icons/globe?color=00AF5C&size=20&format=png" width="20"/> हिन्दी

### अवलोकन
Modrinth के लिए अनौपचारिक Discord बॉट + Minecraft उपयोगिताएँ। `discord.js@14` और **Components V2** (चौड़ा Container) के साथ बना — तेज़ Modrinth खोज, modlists, सर्वर स्थिति, स्किन, MCTiers रैंक, seeds और सूचनाएं — 4 भाषाओं में पूर्ण अनुवाद के साथ एकीकृत डिज़ाइन (`00AF5C`).

**विशेषताएँ:** चौड़ा कंटेनर (Thumbnail ऊपर + 2 बड़ी छवियाँ + अंदर बटन), Modrinth faceted खोज, हर 30 मिनट में DM सूचनाएं, i18n `en/ar/fr/hi`.

### विशेषताएँ
वही तालिका — 18 slash कमांड, `discovery`/`random`/`modlist`/`notify`/`status`/`rank`/`skin`/`user`/`seeds`/`botstatus`/`help` (कस्टम इमोजी के साथ select) /`settings`/`add`.

### त्वरित शुरुआत
```bash
git clone https://github.com/onyxax/modrinth-discord-bot
cd modrinth-discord-bot
npm install
cp .env.example .env
npm start
```

---

## <img src="https://hylab.vercel.app/api/icons/info?color=00AF5C&size=20&format=png" width="20"/> Deployment & Contributing

- **Deploy:** `npm start` registers commands globally. Use env `DISCORD_TOKEN`. For production, `pm2 start src/index.js --name modrinth-bot`.
- **Icons:** All custom emojis via `src/utils/icons.js` (`<:puzzle:1551630355365371904>` etc.) + PNGs in `assets/icons/lucide/` (HyLab, lucide, 64px, `00AF5C`). Browse: `https://hylab.vercel.app/browse?set=lucide`
- **Add a command:** Create `src/commands/mycommand.js` exporting `{ data: SlashCommandBuilder, execute, autocomplete? }` — auto-loaded in `src/index.js:14`.
- **i18n:** Add key to `src/locales/en.json` and translate to `ar`/`fr`/`hi` — `src/services/i18n.js` resolves user > guild > en.
- **PR:** Fork → branch → commit → PR. Run `node --check src/**/*.js` before push.

## License
MIT © 2026 onyxax — see [LICENSE](./LICENSE).

<p align="center">
  <img src="https://hylab.vercel.app/api/icons/heart?color=00AF5C&size=20&format=png" width="18" style="vertical-align:middle"/> Made with HyLab Icons (lucide) — <a href="https://hylab.vercel.app">hylab.vercel.app</a>
</p>
