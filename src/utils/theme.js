/**
 * نظام التصميم الموحد — Modrinth Bot
 * لون واحد لكل الحاويات + مساعدات لبناء Components V2 العريضة
 */
const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SectionBuilder, ThumbnailBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder } = require('discord.js');

const ACCENT_COLOR = 0x00AF5C; // أخضر Modrinth موحد لكل التضمينات
const ACCENT_COLOR_INT = 45020;

const separator = (spacing = 1, divider = true) =>
  new SeparatorBuilder().setSpacing(spacing).setDivider(divider);

const textDisplay = (content) => new TextDisplayBuilder().setContent(content);

const thumbnail = (url, description) => {
  const t = new ThumbnailBuilder().setURL(url);
  if (description) t.setDescription(description);
  return t;
};

const mediaGallery = (urls = []) => {
  if (!urls.length) return null;
  const g = new MediaGalleryBuilder();
  urls.slice(0, 10).forEach((url) => {
    if (url) g.addItems(new MediaGalleryItemBuilder().setURL(url));
  });
  return g;
};

const createContainer = () => new ContainerBuilder().setAccentColor(ACCENT_COLOR);

module.exports = {
  ACCENT_COLOR,
  ACCENT_COLOR_INT,
  separator,
  textDisplay,
  thumbnail,
  mediaGallery,
  createContainer
};
