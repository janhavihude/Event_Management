import { hi } from 'date-fns/locale';

function buildLocalizeFn(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : 'standalone';
    let valuesArray;
    if (context === 'formatting' && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}

const digitMap = { 0: '०', 1: '१', 2: '२', 3: '३', 4: '४', 5: '५', 6: '६', 7: '७', 8: '८', 9: '९' };
const numberToLocale = (enNumber) =>
  enNumber.toString().replace(/\d/g, (match) => digitMap[match]);

const monthValues = {
  narrow: ['जा', 'फे', 'मा', 'ए', 'मे', 'जू', 'जु', 'ऑ', 'से', 'ऑ', 'नो', 'डि'],
  abbreviated: ['जाने', 'फेब्रु', 'मार्च', 'एप्रि', 'मे', 'जून', 'जुलै', 'ऑग', 'सप्टें', 'ऑक्टो', 'नोव्हें', 'डिसें'],
  wide: [
    'जानेवारी',
    'फेब्रुवारी',
    'मार्च',
    'एप्रिल',
    'मे',
    'जून',
    'जुलै',
    'ऑगस्ट',
    'सप्टेंबर',
    'ऑक्टोबर',
    'नोव्हेंबर',
    'डिसेंबर',
  ],
};

const dayValues = {
  narrow: ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'],
  short: ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'],
  abbreviated: ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
  wide: ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
};

const dayPeriodValues = {
  narrow: {
    am: 'पू.',
    pm: 'उ.',
    midnight: 'मध्यरात्र',
    noon: 'दुपार',
    morning: 'सकाळ',
    afternoon: 'दुपार',
    evening: 'संध्याकाळ',
    night: 'रात्र',
  },
  abbreviated: {
    am: 'पूर्व.',
    pm: 'उत्तर.',
    midnight: 'मध्यरात्र',
    noon: 'दुपार',
    morning: 'सकाळ',
    afternoon: 'दुपार',
    evening: 'संध्याकाळ',
    night: 'रात्र',
  },
  wide: {
    am: 'पूर्वान्ह',
    pm: 'उत्तरान्ह',
    midnight: 'मध्यरात्र',
    noon: 'दुपार',
    morning: 'सकाळ',
    afternoon: 'दुपार',
    evening: 'संध्याकाळ',
    night: 'रात्र',
  },
};

const ordinalNumber = (dirtyNumber) => numberToLocale(Number(dirtyNumber));

/** Marathi (मराठी) locale for date-fns — not bundled in date-fns v4 */
export const mr = {
  ...hi,
  code: 'mr',
  localize: {
    ordinalNumber,
    era: buildLocalizeFn({
      values: {
        narrow: ['इ.स.पू.', 'इ.स.'],
        abbreviated: ['इ.स.पू.', 'इ.स.'],
        wide: ['ईसवीसनपूर्व', 'ईसवीसन'],
      },
      defaultWidth: 'wide',
    }),
    quarter: buildLocalizeFn({
      values: {
        narrow: ['१', '२', '३', '४'],
        abbreviated: ['तिमा१', 'तिमा२', 'तिमा३', 'तिमा४'],
        wide: ['पहिली तिमाही', 'दुसरी तिमाही', 'तिसरी तिमाही', 'चौथी तिमाही'],
      },
      defaultWidth: 'wide',
      argumentCallback: (quarter) => quarter - 1,
    }),
    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: 'wide',
    }),
    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: 'wide',
    }),
    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: 'wide',
      formattingValues: dayPeriodValues,
      defaultFormattingWidth: 'wide',
    }),
  },
};
