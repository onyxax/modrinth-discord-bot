/**
 * أيقونات HyLab + Discord Custom Emojis - onyxax
 * كل الأيقونات مرفوعة بلون #00AF5C وحجم 64، من مكتبة lucide
 * الاستخدام في النص: <:name:id>  |  كصورة: https://cdn.discordapp.com/emojis/{id}.webp
 * المصدر البديل HyLab: https://hylab.vercel.app/api/icons/{lucide-name}?color=00AF5C&size=64&format=png
 */

const ICONS = {
  zap: { id: '1551630371077230752', name: 'zap', lucide: 'zap' },
  x: { id: '1551630369676197908', name: 'x_', lucide: 'x' },
  'x_': { id: '1551630369676197908', name: 'x_', lucide: 'x' },
  userround: { id: '1551630368342417408', name: 'userround', lucide: 'user-round' },
  'user-round': { id: '1551630368342417408', name: 'userround', lucide: 'user-round' },
  star: { id: '1551630366878474290', name: 'star', lucide: 'star' },
  sprout: { id: '1551630365188296864', name: 'sprout', lucide: 'sprout' },
  sparkles: { id: '1551630363510571028', name: 'sparkles', lucide: 'sparkles' },
  shield: { id: '1551630362071801986', name: 'shield', lucide: 'shield' },
  settings: { id: '1551630360402460792', name: 'settings', lucide: 'settings' },
  server: { id: '1551630358854762596', name: 'server', lucide: 'server' },
  search: { id: '1551630356912803950', name: 'search', lucide: 'search' },
  puzzle: { id: '1551630355365371904', name: 'puzzle', lucide: 'puzzle' },
  plugzap: { id: '1551630353775730698', name: 'plugzap', lucide: 'plug-zap' },
  'plug-zap': { id: '1551630353775730698', name: 'plugzap', lucide: 'plug-zap' },
  plug2: { id: '1551630351439237253', name: 'plug2', lucide: 'plug-2' },
  'plug-2': { id: '1551630351439237253', name: 'plug2', lucide: 'plug-2' },
  palette: { id: '1551630349627555850', name: 'palette', lucide: 'palette' },
  paintbrush: { id: '1551630347991523419', name: 'paintbrush', lucide: 'paintbrush' },
  package: { id: '1551630346540286003', name: 'package', lucide: 'package' },
  list: { id: '1551630345324204205', name: 'list', lucide: 'list' },
  link2: { id: '1551630343860265040', name: 'link2', lucide: 'link-2' },
  'link-2': { id: '1551630343860265040', name: 'link2', lucide: 'link-2' },
  layers: { id: '1551630341939269703', name: 'layers', lucide: 'layers' },
  info: { id: '1551630340567597157', name: 'info', lucide: 'info' },
  globe: { id: '1551630339192000532', name: 'globe', lucide: 'globe' },
  folder: { id: '1551630337212289074', name: 'folder', lucide: 'folder' },
  draftingcompass: { id: '1551630335773638687', name: 'draftingcompass', lucide: 'drafting-compass' },
  'drafting-compass': { id: '1551630335773638687', name: 'draftingcompass', lucide: 'drafting-compass' },
  dices: { id: '1551630334443913338', name: 'dices', lucide: 'dices' },
  dice5: { id: '1551630333202530435', name: 'dice5', lucide: 'dice-5' },
  'dice-5': { id: '1551630333202530435', name: 'dice5', lucide: 'dice-5' },
  clouddownload: { id: '1551630331948302466', name: 'clouddownload', lucide: 'cloud-download' },
  'cloud-download': { id: '1551630331948302466', name: 'clouddownload', lucide: 'cloud-download' },
  circle: { id: '1551630330660655104', name: 'circle', lucide: 'circle' },
  check: { id: '1551630329310224404', name: 'check', lucide: 'check' },
  bookopencheck: { id: '1551630328119173250', name: 'bookopencheck', lucide: 'book-open-check' },
  'book-open-check': { id: '1551630328119173250', name: 'bookopencheck', lucide: 'book-open-check' },
  bell: { id: '1551630326818668555', name: 'bell', lucide: 'bell' },
  barchart3: { id: '1551630325619101826', name: 'barchart3', lucide: 'bar-chart-3' },
  'bar-chart-3': { id: '1551630325619101826', name: 'barchart3', lucide: 'bar-chart-3' },
  alertcircle: { id: '1551630324214272130', name: 'alertcircle', lucide: 'alert-circle' },
  'alert-circle': { id: '1551630324214272130', name: 'alertcircle', lucide: 'alert-circle' },
};

function emoji(name) {
  const key = name.toLowerCase().replace(/[-_]/g, '');
  // try exact, then lower
  const entry = ICONS[name] || ICONS[name.toLowerCase()] || ICONS[key] || Object.values(ICONS).find(v => v.lucide.replace(/-/g,'') === key);
  if (!entry) return '';
  return `<:${entry.name}:${entry.id}>`;
}

function url(name, ext = 'webp') {
  const e = ICONS[name] || ICONS[name.toLowerCase()];
  if (!e) return null;
  return `https://cdn.discordapp.com/emojis/${e.id}.${ext}?quality=lossless`;
}

function hyLabUrl(lucideName, color = '00AF5C', size = 64) {
  return `https://hylab.vercel.app/api/icons/${lucideName}?color=${color}&size=${size}&format=png&stroke=2`;
}

module.exports = { ICONS, emoji, url, hyLabUrl };
