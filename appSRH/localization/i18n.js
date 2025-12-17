import { I18n } from 'i18n-js';

export const translations = {
  en: { welcome: 'Hello' },
  de: { welcome: 'Willkommen' },
  ja: { welcome: 'こんにちは' },
};

const i18n = new I18n(translations);
i18n.enableFallback = true;

export default i18n;
