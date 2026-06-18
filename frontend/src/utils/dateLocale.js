import { enUS, hi } from 'date-fns/locale';
import { mr } from './mrLocale';

const localeMap = {
  en: enUS,
  hi: hi,
  mr: mr,
};

export const getDateLocale = (language) => localeMap[language] || enUS;
