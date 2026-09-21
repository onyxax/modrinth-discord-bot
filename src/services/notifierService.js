const { MessageFlags, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const modrinthService = require('./modrinth');
const notificationStore = require('../utils/notificationStore');
const i18n = require('./i18n');
const userSettingsStore = require('../utils/userSettingsStore');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

let clientInstance = null;

const init = (client) => {
  clientInstance = client;
  setInterval(checkUpdates, 30 * 60 * 1000);
  setTimeout(checkUpdates, 60 * 1000);
};

const checkUpdates = async () => {
  if (!clientInstance) return;
  console.log('[Notifier] Checking for project updates...');
  const allUserIds = notificationStore.getAllUsers();
  const projectsToCheck = new Set();
  for (const userId of allUserIds) {
    const following = notificationStore.getUserNotifications(userId);
    for (const slug of Object.keys(following)) {
      projectsToCheck.add(slug);
    }
  }
  const projectLatestVersions = new Map();
  for (const slug of projectsToCheck) {
    try {
      const versions = await modrinthService.getProjectVersions(slug);
      if (versions.length > 0) {
        projectLatestVersions.set(slug, versions[0]);
      }
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(`[Notifier] Failed to fetch versions for ${slug}:`, e.message);
    }
  }
  for (const userId of allUserIds) {
    const following = notificationStore.getUserNotifications(userId);
    const user = await clientInstance.users.fetch(userId).catch(() => null);
    if (!user) continue;
    const lang = userSettingsStore.getSetting(userId, 'language', 'en');
    for (const slug of Object.keys(following)) {
      const storedData = following[slug];
      const latestVersion = projectLatestVersions.get(slug);
      if (latestVersion && latestVersion.id !== storedData.lastVersionId) {
        console.log(`[Notifier] New version found for ${slug}! Notifying user ${userId}`);
        try {
          await sendNotification(user, slug, storedData.name, latestVersion, lang);
          notificationStore.updateLastVersion(userId, slug, latestVersion.id);
        } catch (e) {
          console.error(`[Notifier] Failed to DM user ${userId}:`, e.message);
        }
      }
    }
  }
};

const sendNotification = async (user, slug, projectName, version, lang) => {
  const title = i18n.t('notify_new_update_title', user.id, null, lang);
  const desc = i18n.t('notify_new_update_desc', user.id, null, lang).replace('{project}', projectName);

  const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);
  container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${icons.emoji('bell')} ${title}`));
  container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
  container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('info')} ${desc}`));
  container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(`${icons.emoji('layers')} **${i18n.t('notify_version', user.id, null, lang)}** \`${version.version_number}\`  ·  ${icons.emoji('info')} **Type** \`${version.version_type}\``)
  );
  if (version.changelog) {
    const cleanChangelog = version.changelog.replace(/<[^>]*>?/gm, '').slice(0, 700);
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('info')} ${cleanChangelog || 'No details provided.'}`));
  }
  container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel('View on Modrinth').setStyle(ButtonStyle.Link).setURL(`https://modrinth.com/project/${slug}/version/${version.id}`)
  );
  container.addActionRowComponents(row);
  container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
  container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${projectName} · Modrinth`));

  await user.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
};

module.exports = { init };
