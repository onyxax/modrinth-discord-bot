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
  <img src="https://img.shields.io/badge/Icons-32%20Lucide-00AF5C?style=flat-square" alt="Icons"/>
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
## <img src="assets/icons/lucide/globe.png" width="20"/> English — Complete Documentation

### 1. Overview
Unofficial bot for **Modrinth** + Minecraft utilities. `discord.js@14` + **Components V2** wide `Container` (accent `00AF5C`, `Separator`, `Section` + `Thumbnail` small on top with title, `MediaGallery` 2 large images, `ActionRow` inside). 18 slash commands, 3 services, 7 stores, 4 locales (141 keys, 0 missing), 32 local PNG icons (lucide 64px) + 32 Discord custom emojis. 

**Stack:** `Node CommonJS` · `discord.js@14.25.1` · `axios` · `dotenv` · `HyLab Icons API` (lucide, `00AF5C`)

### 2. Architecture
`Discord → src/index.js (router) → command.execute() → services/modrinth.js → Modrinth API` + `notifierService (30m)` + `i18n (user>guild>en)` + `theme (00AF5C)` + `icons (<:name:id>)` + 7 JSON stores.

### 3. Features — Every Command
| Command | Type | Options | Description |
|---|---|---|---|
| <img src="assets/icons/lucide/puzzle.png" width="18" style="vertical-align:middle"/> `/mods` | mod | `query*`, `version`, `loader` | Search mods |
| <img src="assets/icons/lucide/package.png" width="18" style="vertical-align:middle"/> `/modpacks` | modpack | `query*`, `version` | Search modpacks |
| <img src="assets/icons/lucide/paintbrush.png" width="18" style="vertical-align:middle"/> `/resourcepacks` | resourcepack | `query*`, `version` | Search resource packs |
| <img src="assets/icons/lucide/sparkles.png" width="18" style="vertical-align:middle"/> `/shaders` | shader | `query*`, `version` | Search shaders |
| <img src="assets/icons/lucide/folder.png" width="18" style="vertical-align:middle"/> `/datapacks` | datapack | `query*`, `version` | Search datapacks |
| <img src="assets/icons/lucide/plug-2.png" width="18" style="vertical-align:middle"/> `/plugins` | plugin | `query*`, `version`, `loader` | Search plugins |
| <img src="assets/icons/lucide/search.png" width="18" style="vertical-align:middle"/> `/discovery` | mod | `intent?` (50) | Discover by category, 2 results |
| <img src="assets/icons/lucide/dices.png" width="18" style="vertical-align:middle"/> `/random` | any | `type?` | Random resource |
| <img src="assets/icons/lucide/list.png" width="18" style="vertical-align:middle"/> `/modlist` | — | `create/add/list/share/delete` | Per-user modlists |
| <img src="assets/icons/lucide/bell.png" width="18" style="vertical-align:middle"/> `/notify` | — | `me/list/remove` | Follow projects, DM on update |
| <img src="assets/icons/lucide/server.png" width="18" style="vertical-align:middle"/> `/status` | — | `address*` | MC server status |
| <img src="assets/icons/lucide/shield.png" width="18" style="vertical-align:middle"/> `/rank` | — | `username*` | MCTiers |
| <img src="assets/icons/lucide/user-round.png" width="18" style="vertical-align:middle"/> `/skin` | — | `username*` | Skin display |
| <img src="assets/icons/lucide/user-round.png" width="18" style="vertical-align:middle"/> `/user` | — | `username*` | Modrinth user |
| <img src="assets/icons/lucide/sprout.png" width="18" style="vertical-align:middle"/> `/seeds` | — | `platform?`, `version?` | Community seeds |
| <img src="assets/icons/lucide/bar-chart-3.png" width="18" style="vertical-align:middle"/> `/botstatus` | — | — | Bot stats |
| <img src="assets/icons/lucide/book-open-check.png" width="18" style="vertical-align:middle"/> `/help` | — | — | Interactive help (select with emojis) |
| <img src="assets/icons/lucide/settings.png" width="18" style="vertical-align:middle"/> `/settings` | — | `scope/lang` | Language |
| <img src="assets/icons/lucide/link-2.png" width="18" style="vertical-align:middle"/> `/add` | — | — | Invite link |

**Resource Container:** Title Section (title + `-# by author · Updated` + popularity `star`/`palette` + Thumbnail) → Description + Source (`link2`) → Details (`cloud-download`/`layers`/`globe`) → MediaGallery (2) → ActionRow.

### 4. Services
- `modrinth.js` — `axios` + `versionCache`, `buildModrinthResource` (`projectType`, `author`, `updated`, `categories`, `follows`), `searchProjects` (facets), `getUser/Projects/Versions`
- `notifierService.js` — `30m` poll, `500ms` throttle, DM Container
- `i18n.js` — `t(key, userId, guildId, {var})`, user>guild>en

### 5. Stores (7)
`serverStore`, `serverStatusStore` (10 recent), `playerStore` (50 MRU + MCTiers sync), `notificationStore`, `modlistStore`, `guildSettingsStore`, `userSettingsStore` — all `ensureStorage` + `loadCache` + `writeStore` JSON in `src/data/`.

### 6. i18n
141 keys used, 153 per file, 0 missing. 15 error keys added (`error_discovery_not_found` etc.) with placeholders.

### 7. Icons — 32 Lucide + 32 Custom
Local `assets/icons/lucide/*.png` (64px, `00AF5C`) + Discord `src/utils/icons.js` (`<:puzzle:1551630355365371904>` etc., `onyxax`). Bot icon `assets/bot-icon.png` (62250 bytes). Usage: `<:name:id>` in `TextDisplay`, `emoji: {id, name}` in `help` select. Browse: `https://hylab.vercel.app/browse?set=lucide`

### 8. Quick Start
```bash
git clone https://github.com/onyxax/modrinth-discord-bot
cd modrinth-discord-bot
npm install
cp .env.example .env # fill DISCORD_TOKEN, DISCORD_CLIENT_ID, MODRINTH_TOKEN
npm start
```

### 9. Configuration
`.env`: `DISCORD_TOKEN`/`Token` (required), `MODRINTH_TOKEN`/`modrinth` (required), `DISCORD_CLIENT_ID`, `MODRINTH_USER_AGENT`, `BOT_NAME`. Validated in `src/config.js:17`.

### 10. Project Structure
```
src/index.js, config.js, locales/*.json (153), data/.gitkeep, commands/* (18), services/* (3), utils/* (7), assets/icons/lucide/* (32) + bot-icon.png
```

### 11. Deployment
`npm start` registers commands globally (`REST.put`). Presence rotates 5s. Notifier 30m. Use `pm2` / Docker / `systemd`.

### 12. Troubleshooting
- `COMPONENT_MAX_TOTAL_COMPONENTS_EXCEEDED` → limit 2 per reply (40 max)
- `10062 Unknown interaction` → 2.5s autocomplete timeout
- `DISCORD_TOKEN missing` → `src/config.js` throws

---

<a id="العربية"></a>
<div dir="rtl">

## <img src="assets/icons/lucide/globe.png" width="20"/> العربية — التوثيق الكامل

### 1. نظرة عامة
بوت غير رسمي لـ **Modrinth** وأدوات ماينكرافت. `discord.js@14` + **Components V2** عريض (`Container` بلون `00AF5C`, `Separator`, `Section` + `Thumbnail` صغيرة فوق مع العنوان + `MediaGallery` صورتين كبيرتين + `ActionRow` داخل الحاوية). 18 أمرًا، 3 خدمات، 7 مخازن، 4 لغات (141 مفتاح، 0 نقص)، 32 أيقونة محلية + 32 إيموجي مخصص.

**التقنية:** `Node CommonJS` · `discord.js@14.25.1` · `axios` · `dotenv` · `HyLab Icons API` (lucide، `00AF5C`)

### 2. الهيكل
`Discord → src/index.js → command.execute() → services/modrinth.js → Modrinth API` + `notifierService (30m)` + `i18n (user>guild>en)` + `theme (00AF5C)` + `icons (<:name:id>)` + 7 مخازن JSON.

### 3. المميزات — كل أمر بالتفصيل
| الأمر | النوع | الخيارات | الوصف |
|---|---|---|---|
| <img src="assets/icons/lucide/puzzle.png" width="18" style="vertical-align:middle"/> `/mods` | mod | `query*`, `version`, `loader` | بحث المودات |
| <img src="assets/icons/lucide/package.png" width="18" style="vertical-align:middle"/> `/modpacks` | modpack | `query*`, `version` | بحث المودباكات |
| <img src="assets/icons/lucide/paintbrush.png" width="18" style="vertical-align:middle"/> `/resourcepacks` | resourcepack | `query*`, `version` | بحث حزم الموارد |
| <img src="assets/icons/lucide/sparkles.png" width="18" style="vertical-align:middle"/> `/shaders` | shader | `query*`, `version` | بحث الشيدرات |
| <img src="assets/icons/lucide/folder.png" width="18" style="vertical-align:middle"/> `/datapacks` | datapack | `query*`, `version` | بحث الداتاباك |
| <img src="assets/icons/lucide/plug-2.png" width="18" style="vertical-align:middle"/> `/plugins` | plugin | `query*`, `version`, `loader` | بحث البلجنات |
| <img src="assets/icons/lucide/search.png" width="18" style="vertical-align:middle"/> `/discovery` | mod | `intent?` (50) | اكتشاف حسب الفئة، نتيجتان |
| <img src="assets/icons/lucide/dices.png" width="18" style="vertical-align:middle"/> `/random` | any | `type?` | مورد عشوائي |
| <img src="assets/icons/lucide/list.png" width="18" style="vertical-align:middle"/> `/modlist` | — | `create/add/list/share/delete` | قوائم مودات لكل مستخدم |
| <img src="assets/icons/lucide/bell.png" width="18" style="vertical-align:middle"/> `/notify` | — | `me/list/remove` | متابعة مشاريع والتنبيه بالخاص |
| <img src="assets/icons/lucide/server.png" width="18" style="vertical-align:middle"/> `/status` | — | `address*` | حالة سيرفر ماينكرافت |
| <img src="assets/icons/lucide/shield.png" width="18" style="vertical-align:middle"/> `/rank` | — | `username*` | ملف MCTiers |
| <img src="assets/icons/lucide/user-round.png" width="18" style="vertical-align:middle"/> `/skin` | — | `username*` | عرض السكن |
| <img src="assets/icons/lucide/user-round.png" width="18" style="vertical-align:middle"/> `/user` | — | `username*` | بحث مستخدم Modrinth |
| <img src="assets/icons/lucide/sprout.png" width="18" style="vertical-align:middle"/> `/seeds` | — | `platform?`, `version?` | بذور المجتمع |
| <img src="assets/icons/lucide/bar-chart-3.png" width="18" style="vertical-align:middle"/> `/botstatus` | — | — | حالة البوت |
| <img src="assets/icons/lucide/book-open-check.png" width="18" style="vertical-align:middle"/> `/help` | — | — | مساعدة تفاعلية (قائمة اختيار بأيقوناتك) |
| <img src="assets/icons/lucide/settings.png" width="18" style="vertical-align:middle"/> `/settings` | — | `scope/lang` | تغيير اللغة |
| <img src="assets/icons/lucide/link-2.png" width="18" style="vertical-align:middle"/> `/add` | — | — | رابط الدعوة |

**هيكل الحاوية:** عنوان Section (الاسم + `-# by author · Updated` + شعبية `star`/`palette` + مصغرة) → الوصف → التفاصيل (`Downloads`/`Versions`/`Platform`) → معرض صورتين → أزرار.

### 4. الخدمات
- `modrinth.js` — `axios` + `versionCache`, `buildModrinthResource` (`projectType`, `author`, `updated`, `categories`, `follows`), `searchProjects`, `getUser`...
- `notifierService.js` — فحص كل 30 دقيقة، تأخير 500ms، رسالة Container
- `i18n.js` — تحميل `src/locales/*.json`، `t(key, userId, guildId, {var})`

### 5. المخازن (7)
`serverStore`, `serverStatusStore` (10 عناوين أخيرة), `playerStore` (50 MRU), `notificationStore`, `modlistStore`, `guildSettingsStore`, `userSettingsStore` — كلها `ensureStorage` + `loadCache` + `writeStore`.

### 6. تعدد اللغات
141 مفتاح مستخدم، 153 في كل ملف، 0 نقص. 15 مفتاح خطأ جديد مترجم.

### 7. الأيقونات — 32 Lucide + 32 مخصص
محلية `assets/icons/lucide/*.png` (64px، `00AF5C`) + ديسكورد `src/utils/icons.js` (`<:puzzle:1551630355365371904>`). أيقونة البوت `assets/bot-icon.png`. الاستخدام: `<:name:id>` في `TextDisplay`. تصفح: `https://hylab.vercel.app/browse?set=lucide`

### 8. البدء السريع
```bash
git clone https://github.com/onyxax/modrinth-discord-bot
cd modrinth-discord-bot
npm install
cp .env.example .env
npm start
```

### 9. الإعداد
`.env`: `DISCORD_TOKEN`, `MODRINTH_TOKEN`, `DISCORD_CLIENT_ID`, `MODRINTH_USER_AGENT`, `BOT_NAME`.

### 10. هيكل المشروع
```
src/index.js, config.js, locales/*.json (153), data/.gitkeep, commands/* (18), services/* (3), utils/* (7), assets/icons/lucide/* (32) + bot-icon.png
```

### 11. النشر
`npm start` يسجل الأوامر عالمياً. `pm2` / `Docker` / `systemd`.

### 12. استكشاف الأخطاء
- `COMPONENT_MAX_TOTAL_COMPONENTS_EXCEEDED` → حد 2 لكل رد
- `10062` → انتهاء مهلة الإكمال 2.5 ثانية

</div>

---

<a id="français"></a>
## <img src="assets/icons/lucide/globe.png" width="20"/> Français — Documentation complète

### 1. Aperçu
Bot non officiel Modrinth + utilitaires Minecraft. `discord.js@14` + **Components V2** large (`Container` accent `00AF5C`, `Separator`, `Section` + `Thumbnail` en haut, `MediaGallery` 2 images, `ActionRow` dedans). 18 commandes, 3 services, 7 stores, 4 langues (141 clés, 0 manquant), 32 icônes locales + 32 emojis custom.

**Stack:** `Node CommonJS` · `discord.js@14.25.1` · `axios` · `HyLab Icons API` (lucide, `00AF5C`)

### 2. Architecture
`Discord → src/index.js → command.execute() → services/modrinth.js → Modrinth API` + `notifierService (30m)` + `i18n (user>guild>en)` + `theme` + `icons` + 7 stores JSON.

### 3. Fonctionnalités — Chaque commande
| Commande | Type | Options | Description |
|---|---|---|---|
| <img src="assets/icons/lucide/puzzle.png" width="18" style="vertical-align:middle"/> `/mods` | mod | `query*`, `version`, `loader` | Recherche mods |
| <img src="assets/icons/lucide/package.png" width="18" style="vertical-align:middle"/> `/modpacks` | modpack | `query*`, `version` | Recherche modpacks |
| <img src="assets/icons/lucide/paintbrush.png" width="18" style="vertical-align:middle"/> `/resourcepacks` | resourcepack | `query*`, `version` | Packs de ressources |
| <img src="assets/icons/lucide/sparkles.png" width="18" style="vertical-align:middle"/> `/shaders` | shader | `query*`, `version` | Shaders |
| <img src="assets/icons/lucide/folder.png" width="18" style="vertical-align:middle"/> `/datapacks` | datapack | `query*`, `version` | Datapacks |
| <img src="assets/icons/lucide/plug-2.png" width="18" style="vertical-align:middle"/> `/plugins` | plugin | `query*`, `version`, `loader` | Plugins |
| <img src="assets/icons/lucide/search.png" width="18" style="vertical-align:middle"/> `/discovery` | mod | `intent?` (50) | Découverte par catégorie, 2 résultats |
| <img src="assets/icons/lucide/dices.png" width="18" style="vertical-align:middle"/> `/random` | any | `type?` | Ressource aléatoire |
| <img src="assets/icons/lucide/list.png" width="18" style="vertical-align:middle"/> `/modlist` | — | `create/add/list/share/delete` | Modlists par utilisateur |
| <img src="assets/icons/lucide/bell.png" width="18" style="vertical-align:middle"/> `/notify` | — | `me/list/remove` | Suivre projets, DM |
| <img src="assets/icons/lucide/server.png" width="18" style="vertical-align:middle"/> `/status` | — | `address*` | Statut serveur MC |
| <img src="assets/icons/lucide/shield.png" width="18" style="vertical-align:middle"/> `/rank` | — | `username*` | Profil MCTiers |
| <img src="assets/icons/lucide/user-round.png" width="18" style="vertical-align:middle"/> `/skin` | — | `username*` | Skin |
| <img src="assets/icons/lucide/user-round.png" width="18" style="vertical-align:middle"/> `/user` | — | `username*` | Utilisateur Modrinth |
| <img src="assets/icons/lucide/sprout.png" width="18" style="vertical-align:middle"/> `/seeds` | — | `platform?`, `version?` | Seeds communauté |
| <img src="assets/icons/lucide/bar-chart-3.png" width="18" style="vertical-align:middle"/> `/botstatus` | — | — | Stats bot |
| <img src="assets/icons/lucide/book-open-check.png" width="18" style="vertical-align:middle"/> `/help` | — | — | Aide interactive (select avec emojis) |
| <img src="assets/icons/lucide/settings.png" width="18" style="vertical-align:middle"/> `/settings` | — | `scope/lang` | Langue |
| <img src="assets/icons/lucide/link-2.png" width="18" style="vertical-align:middle"/> `/add` | — | — | Lien d'invitation |

**Conteneur:** Title Section (title + `-# by author · Updated` + popularité `star`/`palette` + Thumbnail) → Description → Détails (`Downloads`/`Versions`/`Platform`) → MediaGallery (2) → ActionRow.

### 4. Services
- `modrinth.js` — `axios` + `versionCache`, `buildModrinthResource` (`projectType`, `author`, `updated`, `categories`, `follows`), `searchProjects`
- `notifierService.js` — 30m poll, DM Container
- `i18n.js` — `t(key, userId, guildId, {var})`

### 5. Stores (7)
`serverStore`, `serverStatusStore` (10 récents), `playerStore` (50 MRU), `notificationStore`, `modlistStore`, `guildSettingsStore`, `userSettingsStore` — tous `ensureStorage` + `loadCache` + `writeStore`.

### 6. i18n
141 clés utilisées, 153 par fichier, 0 manquant. 15 clés d'erreur ajoutées.

### 7. Icônes — 32 Lucide + 32 Custom
Locales `assets/icons/lucide/*.png` (64px, `00AF5C`) + Discord `src/utils/icons.js` (`<:puzzle:1551630355365371904>`). Icône bot `assets/bot-icon.png`. Utilisation: `<:name:id>` dans `TextDisplay`.

### 8. Démarrage rapide
```bash
git clone https://github.com/onyxax/modrinth-discord-bot
cd modrinth-discord-bot
npm install
cp .env.example .env
npm start
```

### 9. Configuration
`.env`: `DISCORD_TOKEN`, `MODRINTH_TOKEN`, `DISCORD_CLIENT_ID`, `MODRINTH_USER_AGENT`.

### 10. Structure
```
src/index.js, config.js, locales/*.json (153), data/.gitkeep, commands/* (18), services/* (3), utils/* (7), assets/icons/lucide/* (32) + bot-icon.png
```

### 11. Déploiement
`npm start` enregistre les commandes. `pm2` / Docker / `systemd`.

---

<a id="हिन्दी"></a>
## <img src="assets/icons/lucide/globe.png" width="20"/> हिन्दी — पूर्ण दस्तावेज़

### 1. अवलोकन
Modrinth के लिए अनौपचारिक बॉट + Minecraft उपयोगिताएँ। `discord.js@14` + **Components V2** चौड़ा `Container` (एक्सेंट `00AF5C`, `Separator`, `Section` + `Thumbnail` ऊपर, `MediaGallery` 2 बड़ी छवियाँ, `ActionRow` अंदर). 18 कमांड, 3 सेवाएं, 7 स्टोर, 4 भाषाएं (141 कुंजी, 0 कमी), 32 स्थानीय PNG आइकन + 32 कस्टम इमोजी।

**स्टैक:** `Node CommonJS` · `discord.js@14.25.1` · `axios` · `HyLab Icons API` (lucide, `00AF5C`)

### 2. आर्किटेक्चर
`Discord → src/index.js → command.execute() → services/modrinth.js → Modrinth API` + `notifierService (30m)` + `i18n (user>guild>en)` + `theme` + `icons` + 7 JSON स्टोर।

### 3. विशेषताएँ — हर कमांड
| कमांड | प्रकार | विकल्प | विवरण |
|---|---|---|---|
| <img src="assets/icons/lucide/puzzle.png" width="18" style="vertical-align:middle"/> `/mods` | mod | `query*`, `version`, `loader` | मॉड खोज |
| <img src="assets/icons/lucide/package.png" width="18" style="vertical-align:middle"/> `/modpacks` | modpack | `query*`, `version` | मॉडपैक खोज |
| <img src="assets/icons/lucide/paintbrush.png" width="18" style="vertical-align:middle"/> `/resourcepacks` | resourcepack | `query*`, `version` | रिसोर्स पैक |
| <img src="assets/icons/lucide/sparkles.png" width="18" style="vertical-align:middle"/> `/shaders` | shader | `query*`, `version` | शेडर्स |
| <img src="assets/icons/lucide/folder.png" width="18" style="vertical-align:middle"/> `/datapacks` | datapack | `query*`, `version` | डेटापैक |
| <img src="assets/icons/lucide/plug-2.png" width="18" style="vertical-align:middle"/> `/plugins` | plugin | `query*`, `version`, `loader` | प्लगइन्स |
| <img src="assets/icons/lucide/search.png" width="18" style="vertical-align:middle"/> `/discovery` | mod | `intent?` (50) | श्रेणी द्वारा खोज, 2 परिणाम |
| <img src="assets/icons/lucide/dices.png" width="18" style="vertical-align:middle"/> `/random` | any | `type?` | यादृच्छिक संसाधन |
| <img src="assets/icons/lucide/list.png" width="18" style="vertical-align:middle"/> `/modlist` | — | `create/add/list/share/delete` | प्रति-उपयोगकर्ता modlists |
| <img src="assets/icons/lucide/bell.png" width="18" style="vertical-align:middle"/> `/notify` | — | `me/list/remove` | प्रोजेक्ट्स फॉलो, DM |
| <img src="assets/icons/lucide/server.png" width="18" style="vertical-align:middle"/> `/status` | — | `address*` | MC सर्वर स्थिति |
| <img src="assets/icons/lucide/shield.png" width="18" style="vertical-align:middle"/> `/rank` | — | `username*` | MCTiers |
| <img src="assets/icons/lucide/user-round.png" width="18" style="vertical-align:middle"/> `/skin` | — | `username*` | स्किन |
| <img src="assets/icons/lucide/user-round.png" width="18" style="vertical-align:middle"/> `/user` | — | `username*` | Modrinth उपयोगकर्ता |
| <img src="assets/icons/lucide/sprout.png" width="18" style="vertical-align:middle"/> `/seeds` | — | `platform?`, `version?` | समुदाय seeds |
| <img src="assets/icons/lucide/bar-chart-3.png" width="18" style="vertical-align:middle"/> `/botstatus` | — | — | बॉट आँकड़े |
| <img src="assets/icons/lucide/book-open-check.png" width="18" style="vertical-align:middle"/> `/help` | — | — | इंटरैक्टिव सहायता (इमोजी के साथ select) |
| <img src="assets/icons/lucide/settings.png" width="18" style="vertical-align:middle"/> `/settings` | — | `scope/lang` | भाषा |
| <img src="assets/icons/lucide/link-2.png" width="18" style="vertical-align:middle"/> `/add` | — | — | आमंत्रण लिंक |

**कंटेनर:** शीर्षक Section (शीर्षक + `-# by author · Updated` + लोकप्रियता `star`/`palette` + थंबनेल) → विवरण → विवरण (`Downloads`/`Versions`/`Platform`) → मीडिया गैलरी (2) → ActionRow।

### 4. सेवाएं
- `modrinth.js` — `axios` + `versionCache`, `buildModrinthResource`, `searchProjects`
- `notifierService.js` — 30m poll, DM Container
- `i18n.js` — `t(key, userId, guildId, {var})`

### 5. स्टोर (7)
`serverStore`, `serverStatusStore` (10 हाल), `playerStore` (50 MRU), `notificationStore`, `modlistStore`, `guildSettingsStore`, `userSettingsStore` — सभी `ensureStorage` + `loadCache` + `writeStore`.

### 6. i18n
141 कुंजी उपयोग, 153 प्रति फ़ाइल, 0 कमी। 15 त्रुटि कुंजी जोड़ी गई।

### 7. आइकन — 32 Lucide + 32 कस्टम
स्थानीय `assets/icons/lucide/*.png` (64px, `00AF5C`) + Discord `src/utils/icons.js` (`<:puzzle:1551630355365371904>`). बॉट आइकन `assets/bot-icon.png`. उपयोग: `<:name:id>`।

### 8. त्वरित शुरुआत
```bash
git clone https://github.com/onyxax/modrinth-discord-bot
cd modrinth-discord-bot
npm install
cp .env.example .env
npm start
```

### 9. कॉन्फ़िगरेशन
`.env`: `DISCORD_TOKEN`, `MODRINTH_TOKEN`, `DISCORD_CLIENT_ID`, `MODRINTH_USER_AGENT`.

### 10. प्रोजेक्ट संरचना
```
src/index.js, config.js, locales/*.json (153), data/.gitkeep, commands/* (18), services/* (3), utils/* (7), assets/icons/lucide/* (32) + bot-icon.png
```

### 11. परिनियोजन
`npm start` वैश्विक कमांड पंजीकृत करता है। `pm2` / Docker / `systemd`।

---

## <img src="assets/icons/lucide/info.png" width="20"/> Deployment & Contributing (All Languages)
Same as English — see above. MIT © 2026 onyxax.

<p align="center"><img src="assets/icons/lucide/heart.png" width="18" style="vertical-align:middle"/> Made with HyLab Icons (lucide) — <a href="https://hylab.vercel.app">hylab.vercel.app</a></p>
