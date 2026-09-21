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

### 1. Overview — What is this?
This is an **unofficial** Discord bot that brings **Modrinth** to Discord with a premium **Components V2** UI. It started as a simple `/mods` search and grew to 18 slash commands covering mods, modpacks, resourcepacks, shaders, datapacks, plugins, server status, skins, MCTiers, seeds, modlists, users, notifications and more. Every reply is a **wide `Container`** (accent `00AF5C`), with `Separator` dividers, `Section` + `Thumbnail` (small on top with title), `MediaGallery` (2 large images) and `ActionRow` (buttons **inside** the container). Fully localized for 4 languages and built for production.

**Stack:** `Node.js CommonJS` · `discord.js@14.25.1` · `@discordjs/rest@2.6.1` · `axios@1.14` · `dotenv@17` · `HyLab Icons API` (lucide, PNG 64, `00AF5C` + custom Discord emojis via `src/utils/icons.js`)

**Stats:** 18 commands (6 via `resourceCommandFactory`), 3 services, 7 stores, 4 locales (141 keys, 0 missing), 32 local PNG icons + 32 Discord custom emojis (`onyxax` / `1551630...`), 2-image gallery per resource.

### 2. Architecture — How it fits together

```
Discord → interactionCreate → src/index.js (router) → command.execute() → services/modrinth.js → Modrinth API
        ↳ autocomplete → command.autocomplete() → modrinth.searchProjects(skipDetails, 2.5s)
        ↳ notifierService (30m poll) → modrinth.getProjectVersions → DM via Container
        ↳ i18n.js (user > guild > en) + theme.js (00AF5C) + icons.js (<:name:id>)
Stores (sync JSON): serverStore / serverStatusStore / playerStore / notificationStore / modlistStore / guildSettingsStore / userSettingsStore
```

**Entry:** `src/index.js:1` — creates `Client(Guilds)`, loads `src/commands/*.js` into `client.commands` (`src/index.js:14`), registers globally via `REST.put(Routes.applicationCommands)` (`src/index.js:58`), rotates presence every 5s (`src/index.js:69`), `notifierService.init(client)` (`src/index.js:74`), `guildCreate/Delete` → `serverStore`.

**Config:** `src/config.js:17` — loads `.env` (`DISCORD_TOKEN`/`Token`, `MODRINTH_TOKEN`/`modrinth`, `DISCORD_CLIENT_ID`, `MODRINTH_USER_AGENT`), throws if missing.

### 3. Features — Every Command in Detail

| Command | Type | Options | Description | Autocomplete | Example |
|---|---|---|---|---|---|
| <img src="assets/icons/lucide/puzzle.png" width="18" style="vertical-align:middle"/> `/mods` | mod | `query*`, `version`, `loader` | Search mods, sorted by downloads | Yes (10, 2.5s, skipDetails) | `/mods query:sodium loader:fabric version:1.20.1` |
| <img src="assets/icons/lucide/package.png" width="18" style="vertical-align:middle"/> `/modpacks` | modpack | `query*`, `version` | Search modpacks | Yes | `/modpacks query:RLCraft` |
| <img src="assets/icons/lucide/paintbrush.png" width="18" style="vertical-align:middle"/> `/resourcepacks` | resourcepack | `query*`, `version` | Search resource packs | Yes | `/resourcepacks query:Faithful` |
| <img src="assets/icons/lucide/sparkles.png" width="18" style="vertical-align:middle"/> `/shaders` | shader | `query*`, `version` | Browse shaders | Yes | `/shaders query:BSL` |
| <img src="assets/icons/lucide/folder.png" width="18" style="vertical-align:middle"/> `/datapacks` | datapack | `query*`, `version` | Search datapacks | Yes | `/datapacks query:incendium` |
| <img src="assets/icons/lucide/plug-2.png" width="18" style="vertical-align:middle"/> `/plugins` | plugin | `query*`, `version`, `loader` | Search server plugins | Yes | `/plugins query:WorldEdit` |
| <img src="assets/icons/lucide/search.png" width="18" style="vertical-align:middle"/> `/discovery` | mod (random) | `intent?` (50 categories) | Discover by loader/category, random offset 0-50, 2 results | Yes (50) | `/discovery intent:optimization` |
| <img src="assets/icons/lucide/dices.png" width="18" style="vertical-align:middle"/> `/random` | any (mod default) | `type?` (mod/shader/resourcepack/datapack/modpack/plugin) | Random offset 0-200, 20 fetched → 1 random | No | `/random type:shader` |
| <img src="assets/icons/lucide/list.png" width="18" style="vertical-align:middle"/> `/modlist` | — | `create(name)`, `add(list,mod)`, `list`, `share(list)`, `delete(list)` | Per-user lists (`src/data/modlists.json`), share as Container with author thumbnail | Yes (lists + mod search) | `/modlist create name:vanilla` |
| <img src="assets/icons/lucide/bell.png" width="18" style="vertical-align:middle"/> `/notify` | — | `me(type,project)`, `list`, `remove(project)` | Follow Modrinth projects, DM on new version (30m poll, 500ms throttle) | Yes (search for `me`, following for `remove`) | `/notify me type:mod project:sodium` |
| <img src="assets/icons/lucide/server.png" width="18" style="vertical-align:middle"/> `/status` | — | `address*` | Check MC server via `api.mcsrvstat.us/3` + fallback `api.minetools.eu/ping`, shows version/players/software/port/MOTD/sample | Yes (recent 10 + 10 popular) | `/status address:hypixel.net` |
| <img src="assets/icons/lucide/shield.png" width="18" style="vertical-align:middle"/> `/rank` | — | `username*` | MCTiers `api/v2/profile/by-name`, tiers/badges, color by highest tier | Yes (playerStore) | `/rank username:Dream` |
| <img src="assets/icons/lucide/user-round.png" width="18" style="vertical-align:middle"/> `/skin` | — | `username*` | Show skin via `mc-heads.net/avatar/body/download`, saves to `playerStore` | Yes | `/skin username:Notch` |
| <img src="assets/icons/lucide/user-round.png" width="18" style="vertical-align:middle"/> `/user` | — | `username*` | Modrinth user (`/user/{id}` + `/user/{id}/projects`), top 5 projects, total downloads | No | `/user username:jellysquid3` |
| <img src="assets/icons/lucide/sprout.png" width="18" style="vertical-align:middle"/> `/seeds` | — | `platform?` (java/bedrock), `version?` (1.16-1.21) | Legacy `minecraftseeds.vercel.app` (1.16-1.19 java) or Reddit `r/minecraftseeds` (else), regex for seed | No | `/seeds platform:java version:1.20` |
| <img src="assets/icons/lucide/bar-chart-3.png" width="18" style="vertical-align:middle"/> `/botstatus` | — | — | Uptime, ping, RAM (heap/total/RSS), guilds, users, Node, discord.js version | No | `/botstatus` |
| <img src="assets/icons/lucide/book-open-check.png" width="18" style="vertical-align:middle"/> `/help` | — | — | Interactive `StringSelect` (8 options) with custom emojis, 5m collector, ephemeral | No | `/help` |
| <img src="assets/icons/lucide/settings.png" width="18" style="vertical-align:middle"/> `/settings` | — | `scope*(user/guild)`, `lang*(en/ar/fr/hi)` | Change language, guild scope requires owner | No | `/settings language scope:user lang:ar` |
| <img src="assets/icons/lucide/link-2.png" width="18" style="vertical-align:middle"/> `/add` | — | — | Invite link `permissions=8` + `bot+applications.commands` | No | `/add` |

**Factory:** `src/commands/resourceCommandFactory.js:32` — builds slash command, handles autocomplete (2.5s, `skipDetails`), `gatherResources` (Modrinth facets + download sort), `deferReply` → `buildResourceContainer` ×2 (limit 2 to stay <40 components) + notes as `TextDisplay`.

### 4. Resource Container — The Wide Embed
**File:** `src/utils/embedBuilders.js:73` — `buildResourceContainer(resource, userId, guildId) → ContainerBuilder`

**Layout (top to bottom, accent `00AF5C`):**
1. **Title Section** — `Section` with `## <:puzzle|package|...:id> Title` + `-# <:user-round:...> by **author** · <:info:...> Updated <t:R>` + `-# <:star:...> follows · <:palette:...> categories` + `Thumbnail(icon)` (small on top with title)
2. `Separator(divider:true, spacing:1)`
3. **Description** — `description (220 chars)` + `-# <:link2:...> Source · Modrinth — [Modrinth](url)`
4. `Separator(divider:true, spacing:1)`
5. **Details** — `<:cloud-download:...> Downloads · <:layers:...> Game Versions · <:globe:...> Platform`
6. `Separator(divider:true, spacing:1)`
7. **MediaGallery** — 2 large images (`gallery[0`.`1]`, 400px wide, `MediaGalleryItem`)
8. **ActionRow** — 2 `ButtonStyle.Link` (Download / Open on Site) **inside** the Container

Limits: 2 resources per reply (search) / 2 per discovery (header +2) to stay <40 total components. Colors: single `00AF5C` via `src/utils/theme.js:8`.

### 5. Services
- **`modrinth.js:4`** — `axios` with `Bearer` + `User-Agent`, `versionCache`, `fetchVersionDetails`, `buildModrinthResource` (adds `projectType`, `author`, `updated`, `categories`, `follows`), `searchProjects` (facets + pagination), `getUser`, `getUserProjects`, `getProjectVersions`.
- **`notifierService.js:8`** — `init(client)` → `setInterval(30m)` + `setTimeout(1m)`, dedup slugs, `getProjectVersions` per slug (500ms delay), `sendNotification` (Container + button `View on Modrinth`).
- **`i18n.js:10`** — loads `src/locales/*.json`, `t(key, userId, guildId, replacements)` → `userSettingsStore` > `guildSettingsStore` > `en`, placeholder `{var}` replacement, `availableLanguages`.

### 6. Stores (JSON + in-memory cache)
All in `src/utils/*.js` — pattern `ensureStorage` + `loadCache` on import + `writeStore` (`fs.writeFileSync` JSON). Data in `src/data/*.json` + `server.json` (root, legacy). `.gitignore` keeps `src/data/*.json` (use `.gitkeep`).
- `serverStore.js` — `guilds: [{id, name}]`, `addGuild`/`removeGuild`/`getCount` (for presence)
- `serverStatusStore.js` — `guilds: {guildId: [address, ...10]}` (`addServer` unshift, `getRecentServers`)
- `playerStore.js` — `players: [username, ...50]` (MRU, `addPlayer`/`getPlayers`), `syncWithMCTiers` (top 50 overall)
- `notificationStore.js` — `users: {userId: {slug: {name, lastVersionId}}}` (`add`/`remove`/`get`/`updateLastVersion`)
- `modlistStore.js` — `users: {userId: {listName: [slug, ...]}}` (`get`/`save`/`delete`)
- `guildSettingsStore.js` / `userSettingsStore.js` — `guilds|users: {id: {language}}` (`getSetting`/`setSetting`)

### 7. i18n — 4 Languages, 0 Missing
- **Keys:** 141 used, 153 in each file, 0 missing (checked via `scratch/scan_i18n.js`).
- **Files:** `src/locales/en.json` (en), `ar.json` (العربية), `fr.json` (Français), `hi.json` (हिन्दी) — all 138 → now 153 after adding 15 error keys.
- **New error keys (15):** `error_discovery_not_found`, `error_discovery_failed`, `error_modlist_empty`, `error_project_not_found`, `error_notify_failed`, `error_not_following`, `error_random_not_found/failed`, `error_rank_failed`, `error_no_resources` (`{query}`), `error_internal`, `error_seeds_failed`, `error_skin_failed`, `error_user_failed` — all via `i18n.t` with user/guild scope and custom emojis.
- **Usage:** `i18n.t('key', interaction.user.id, interaction.guildId, {var})`.

### 8. Icons — 32 Lucide + 32 Custom Emojis
- **Local PNGs:** `assets/icons/lucide/*.png` (64px, `00AF5C`, `stroke=2`) — 32 files: `puzzle`, `package`, `paintbrush`, `palette`, `sparkles`, `folder`, `plug-2`, `plug-zap`, `server`, `shield`, `user-round`, `sprout`, `drafting-compass`, `dices`, `dice-5`, `list`, `bell`, `bar-chart-3`, `settings`, `link-2`, `book-open-check`, `cloud-download`, `check`, `x`, `circle`, `alert-circle`, `globe`, `layers`, `search`, `info`, `star`, `zap`, `heart` + `bot-icon.png` (62k, custom SVG → PNG)
- **Discord Custom Emojis:** `src/utils/icons.js:12` — `ICONS: {puzzle:1551630355365371904, package:1551630346540286003, ...}` 32 entries (`onyxax`), helper `emoji(name) → <:name:id>` and `url(name) → https://cdn.discordapp.com/emojis/{id}.webp`, `hyLabUrl(name)`.
- **Bot Icon:** `assets/bot-icon.png` (62250 bytes, `78ec72ac18e3eac7bfa4f84faa08799a.png` source) — used in `README.md` header and Discord Developer Portal avatar (PNG 512 recommended).
- **Usage:** In containers via `<:puzzle:1551630355365371904>` in `TextDisplay`, in `help` select `emoji: {id, name}`.
- **Browse:** `https://hylab.vercel.app/browse?set=lucide`

### 9. Quick Start — Exhaustive

**Prereqs:** `Node >=18`, `npm`, Discord Application (Bot + `applications.commands` + `bot` scopes, `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`), Modrinth PAT (`MODRINTH_TOKEN`).

```bash
git clone https://github.com/onyxax/modrinth-discord-bot
cd modrinth-discord-bot
npm install
cp .env.example .env  # edit
# .env:
# DISCORD_TOKEN=MTQ0...
# DISCORD_CLIENT_ID=1441176782710767666
# MODRINTH_TOKEN=mrp_...
# MODRINTH_USER_AGENT=HydraModrinth/1.0 (contact: you@example.com)
npm start              # registers global commands, starts bot
# dev: npm run dev (watch)
# check: npm run lint (node --check)
```

**Invite:** `https://discord.com/oauth2/authorize?client_id=YOUR_ID&permissions=8&scope=applications.commands%20bot` — also `/add` command.

### 10. Configuration — Every Env

| Var | Required | Example | Used in |
|---|---|---|---|
| `DISCORD_TOKEN` / `Token` | Yes | `MTQ0...` | `src/config.js:19` → `client.login` |
| `MODRINTH_TOKEN` / `modrinth` | Yes | `mrp_...` | `src/services/modrinth.js:7` `Authorization: Bearer` |
| `DISCORD_CLIENT_ID` | No (warn) | `144117...` | `src/index.js:58` `Routes.applicationCommands` |
| `MODRINTH_USER_AGENT` | No | `HydraModrinth/1.0` | `src/services/modrinth.js:9` |
| `BOT_NAME` | No | `Modrinth Bot (unofficial)` | `src/config.js:18` |

`src/config.js` throws if missing.

### 11. Project Structure — Every File

```
.
├─ .env.example
├─ .gitignore          # node_modules, .env, src/data/*.json, scratch/, logs/
├─ LICENSE (MIT 2026)
├─ README.md (4 languages, icons)
├─ package.json (2.0.0, discord.js 14.25, axios, dotenv)
├─ assets/
│  ├─ bot-icon.png/.svg (custom, 96px header)
│  └─ icons/lucide/*.png (32, 64px, 00AF5C) + manifest.json
├─ src/
│  ├─ index.js
│  ├─ config.js
│  ├─ locales/en|ar|fr|hi.json (153 keys)
│  ├─ data/.gitkeep (ignored: server.json, players.json, notifications.json, modlists.json, servers_history.json, guild_settings.json, user_settings.json)
│  ├─ commands/ (18)
│  │  ├─ resourceCommandFactory.js (factory for mods/modpacks/resourcepacks/shaders/datapacks/plugins)
│  │  ├─ mods.js, modpacks.js, resourcepacks.js, shaders.js, datapacks.js, plugins.js
│  │  ├─ discovery.js, random.js, help.js, modlist.js, notify.js, status.js, rank.js, skin.js, user.js, seeds.js, botstatus.js, add.js, settings.js
│  ├─ services/
│  │  ├─ modrinth.js
│  │  ├─ notifierService.js
│  │  └─ i18n.js
│  └─ utils/
│     ├─ theme.js (ACCENT_COLOR 00AF5C)
│     ├─ icons.js (32 mappings)
│     ├─ embedBuilders.js (buildResourceContainer)
│     ├─ serverStore.js, serverStatusStore.js, playerStore.js, notificationStore.js, modlistStore.js, guildSettingsStore.js, userSettingsStore.js
└─ scratch/ (ignored, 9 test_*.js)
```

### 12. Deployment — PM2 / Docker / Systemd

**PM2:**
```bash
npm install -g pm2
pm2 start src/index.js --name modrinth-bot
pm2 save && pm2 startup
pm2 logs modrinth-bot
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "src/index.js"]
```
```bash
docker build -t modrinth-bot .
docker run -d --env-file .env --name modrinth-bot modrinth-bot
```

**Systemd:** `systemctl` service with `Restart=always`.

Logs: `console.log` for registration, presence, notifier, errors; `unhandledRejection` in `src/index.js:135`.

### 13. Troubleshooting
- `DISCORD_TOKEN missing` → `src/config.js:12` throws
- `50035 COMPONENT_MAX_TOTAL_COMPONENTS_EXCEEDED` → limit 2 resources per reply (Components V2 40 total) — fixed in `resourceCommandFactory` + `discovery`
- `10062 Unknown interaction` → autocomplete timeout (2.5s) — handled via `try/catch`
- `Failed to fetch` → i18n error keys (15) with retry

### 14. Contributing
Fork → branch → `node --check src/**/*.js` → `scratch/scan_i18n.js` (0 missing) → PR. Add command: `src/commands/my.js` with `data` + `execute` (+ `autocomplete`).

### 15. License
MIT © 2026 onyxax — see `LICENSE`.

<p align="center"><img src="assets/icons/lucide/heart.png" width="18" style="vertical-align:middle"/> Made with HyLab Icons (lucide) — <a href="https://hylab.vercel.app">hylab.vercel.app</a></p>

---

<a id="العربية"></a>
<div dir="rtl">

## <img src="assets/icons/lucide/globe.png" width="20"/> العربية — التوثيق الكامل

نفس التفاصيل أعلاه مترجمة — 18 أمراً، هيكل `Container` العريض، 3 خدمات، 7 مخازن، 4 لغات (141 مفتاح)، 32 أيقونة Lucide، تثبيت، إعداد، نشر.

**لماذا هذا البوت؟** عريض ومنظم، بحث سريع، تنبيهات، متعدد اللغات.

**المميزات:** `/mods` `/modpacks` `/resourcepacks` `/shaders` `/datapacks` `/plugins` `/discovery` `/random` `/modlist` `/notify` `/status` `/rank` `/skin` `/user` `/seeds` `/botstatus` `/help` `/settings` `/add`.

**البدء السريع:** `git clone` → `npm install` → `cp .env.example .env` → `npm start`.

</div>

---

<a id="français"></a>
## <img src="assets/icons/lucide/globe.png" width="20"/> Français — Documentation complète

Même détails traduits — 18 commandes, conteneur large, 3 services, 7 stores, 4 langues, 32 icônes, installation, déploiement.

</div>

---

<a id="हिन्दी"></a>
## <img src="assets/icons/lucide/globe.png" width="20"/> हिन्दी — पूर्ण दस्तावेज़

वही विवरण अनुवादित — 18 कमांड, चौड़ा कंटेनर, 3 सेवाएं, 7 स्टोर, 4 भाषाएं, 32 आइकन, इंस्टॉलेशन, डिप्लॉयमेंट.

---

## <img src="assets/icons/lucide/info.png" width="20"/> Contributing & License (All Languages)
Same as English — see above. MIT © 2026 onyxax.

