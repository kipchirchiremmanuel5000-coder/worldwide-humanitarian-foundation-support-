export interface CurrencyInfo {
  country: string;
  code: string;
  symbol: string;
  rate: number; // Units of local currency per 1 USD
  flag: string;
}

export const allCurrencies: Record<string, CurrencyInfo> = {
  Zambia: { country: 'Zambia', code: 'ZMW', symbol: 'K', rate: 27, flag: '🇿🇲' },
  Afghanistan: { country: 'Afghanistan', code: 'AFN', symbol: '؋', rate: 70, flag: '🇦🇫' },
  Albania: { country: 'Albania', code: 'ALL', symbol: 'L', rate: 92, flag: '🇦🇱' },
  Algeria: { country: 'Algeria', code: 'DZD', symbol: 'د.ج', rate: 134, flag: '🇩🇿' },
  Angola: { country: 'Angola', code: 'AOA', symbol: 'Kz', rate: 910, flag: '🇦🇴' },
  Argentina: { country: 'Argentina', code: 'ARS', symbol: '$', rate: 1000, flag: '🇦🇷' },
  Armenia: { country: 'Armenia', code: 'AMD', symbol: '֏', rate: 387, flag: '🇦🇲' },
  Australia: { country: 'Australia', code: 'AUD', symbol: 'A$', rate: 1.52, flag: '🇦🇺' },
  Austria: { country: 'Austria', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇦🇹' },
  Azerbaijan: { country: 'Azerbaijan', code: 'AZN', symbol: '₼', rate: 1.70, flag: '🇦🇿' },
  Bahamas: { country: 'Bahamas', code: 'BSD', symbol: 'B$', rate: 1.0, flag: '🇧🇸' },
  Bahrain: { country: 'Bahrain', code: 'BHD', symbol: 'BD', rate: 0.376, flag: '🇧🇭' },
  Bangladesh: { country: 'Bangladesh', code: 'BDT', symbol: '৳', rate: 120, flag: '🇧🇩' },
  Barbados: { country: 'Barbados', code: 'BBD', symbol: 'Bds$', rate: 2.0, flag: '🇧🇧' },
  Belgium: { country: 'Belgium', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇧🇪' },
  Belize: { country: 'Belize', code: 'BZD', symbol: 'BZ$', rate: 2.0, flag: '🇧🇿' },
  Benin: { country: 'Benin', code: 'XOF', symbol: 'CFA', rate: 605, flag: '🇧🇯' },
  Bhutan: { country: 'Bhutan', code: 'BTN', symbol: 'Nu.', rate: 84.1, flag: '🇧🇹' },
  Bolivia: { country: 'Bolivia', code: 'BOB', symbol: 'Bs.', rate: 6.91, flag: '🇧🇴' },
  'Bosnia and Herzegovina': { country: 'Bosnia and Herzegovina', code: 'BAM', symbol: 'KM', rate: 1.80, flag: '🇧🇦' },
  Botswana: { country: 'Botswana', code: 'BWP', symbol: 'P', rate: 13.6, flag: '🇧🇼' },
  Brazil: { country: 'Brazil', code: 'BRL', symbol: 'R$', rate: 5.75, flag: '🇧🇷' },
  Bulgaria: { country: 'Bulgaria', code: 'BGN', symbol: 'лв', rate: 1.80, flag: '🇧🇬' },
  Burkina_Faso: { country: 'Burkina Faso', code: 'XOF', symbol: 'CFA', rate: 605, flag: '🇧🇫' },
  Burundi: { country: 'Burundi', code: 'BIF', symbol: 'FBu', rate: 2900, flag: '🇧🇮' },
  Cambodia: { country: 'Cambodia', code: 'KHR', symbol: '៛', rate: 4050, flag: '🇰🇭' },
  Cameroon: { country: 'Cameroon', code: 'XAF', symbol: 'FCFA', rate: 605, flag: '🇨🇲' },
  Canada: { country: 'Canada', code: 'CAD', symbol: 'C$', rate: 1.39, flag: '🇨🇦' },
  'Central African Republic': { country: 'Central African Republic', code: 'XAF', symbol: 'FCFA', rate: 605, flag: '🇨🇫' },
  Chad: { country: 'Chad', code: 'XAF', symbol: 'FCFA', rate: 605, flag: '🇹🇩' },
  Chile: { country: 'Chile', code: 'CLP', symbol: '$', rate: 960, flag: '🇨🇱' },
  China: { country: 'China', code: 'CNY', symbol: '¥', rate: 7.12, flag: '🇨🇳' },
  Colombia: { country: 'Colombia', code: 'COP', symbol: '$', rate: 4400, flag: '🇨🇴' },
  Comoros: { country: 'Comoros', code: 'KMF', symbol: 'CF', rate: 450, flag: '🇰🇲' },
  'Congo (DRC)': { country: 'Congo (DRC)', code: 'CDF', symbol: 'FC', rate: 2850, flag: '🇨🇩' },
  'Congo (Republic)': { country: 'Congo (Republic)', code: 'XAF', symbol: 'FCFA', rate: 605, flag: '🇨🇬' },
  'Costa Rica': { country: 'Costa Rica', code: 'CRC', symbol: '₡', rate: 510, flag: '🇨🇷' },
  'Cote d\'Ivoire': { country: 'Cote d\'Ivoire', code: 'XOF', symbol: 'CFA', rate: 605, flag: '🇨🇮' },
  Croatia: { country: 'Croatia', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇭🇷' },
  Cuba: { country: 'Cuba', code: 'CUP', symbol: '$', rate: 24, flag: '🇨🇺' },
  Cyprus: { country: 'Cyprus', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇨🇾' },
  'Czech Republic': { country: 'Czech Republic', code: 'CZK', symbol: 'Kč', rate: 23.4, flag: '🇨🇿' },
  Denmark: { country: 'Denmark', code: 'DKK', symbol: 'kr', rate: 6.9, flag: '🇩🇰' },
  Djibouti: { country: 'Djibouti', code: 'DJF', symbol: 'Fdj', rate: 178, flag: '🇩🇯' },
  'Dominican Republic': { country: 'Dominican Republic', code: 'DOP', symbol: 'RD$', rate: 60.2, flag: '🇩🇴' },
  Ecuador: { country: 'Ecuador', code: 'USD', symbol: '$', rate: 1.0, flag: '🇪🇨' },
  Egypt: { country: 'Egypt', code: 'EGP', symbol: 'E£', rate: 49.2, flag: '🇪🇬' },
  'El Salvador': { country: 'El Salvador', code: 'USD', symbol: '$', rate: 1.0, flag: '🇸🇻' },
  Eritrea: { country: 'Eritrea', code: 'ERN', symbol: 'Nfk', rate: 15, flag: '🇪🇷' },
  Estonia: { country: 'Estonia', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇪' },
  Eswatini: { country: 'Eswatini', code: 'SZL', symbol: 'E', rate: 18.2, flag: '🇸🇿' },
  Ethiopia: { country: 'Ethiopia', code: 'ETB', symbol: 'Br', rate: 120, flag: '🇪🇹' },
  Fiji: { country: 'Fiji', code: 'FJD', symbol: 'FJ$', rate: 2.25, flag: '🇫🇯' },
  Finland: { country: 'Finland', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇫🇮' },
  France: { country: 'France', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇫🇷' },
  Gabon: { country: 'Gabon', code: 'XAF', symbol: 'FCFA', rate: 605, flag: '🇬🇦' },
  Gambia: { country: 'Gambia', code: 'GMD', symbol: 'D', rate: 70, flag: '🇬🇲' },
  Georgia: { country: 'Georgia', code: 'GEL', symbol: '₾', rate: 2.74, flag: '🇬🇪' },
  Germany: { country: 'Germany', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇩🇪' },
  Ghana: { country: 'Ghana', code: 'GHS', symbol: 'GH₵', rate: 15.5, flag: '🇬🇭' },
  Greece: { country: 'Greece', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇬🇷' },
  Guatemala: { country: 'Guatemala', code: 'GTQ', symbol: 'Q', rate: 7.72, flag: '🇬🇹' },
  Guinea: { country: 'Guinea', code: 'GNF', symbol: 'FG', rate: 8600, flag: '🇬🇳' },
  Guyana: { country: 'Guyana', code: 'GYD', symbol: 'G$', rate: 209, flag: '🇬🇾' },
  Haiti: { country: 'Haiti', code: 'HTG', symbol: 'G', rate: 131, flag: '🇭🇹' },
  Honduras: { country: 'Honduras', code: 'HNL', symbol: 'L', rate: 25.1, flag: '🇭🇳' },
  'Hong Kong': { country: 'Hong Kong', code: 'HKD', symbol: 'HK$', rate: 7.77, flag: '🇭🇰' },
  Hungary: { country: 'Hungary', code: 'HUF', symbol: 'Ft', rate: 375, flag: '🇭🇺' },
  Iceland: { country: 'Iceland', code: 'ISK', symbol: 'kr', rate: 138, flag: '🇮🇸' },
  India: { country: 'India', code: 'INR', symbol: '₹', rate: 84.1, flag: '🇮🇳' },
  Indonesia: { country: 'Indonesia', code: 'IDR', symbol: 'Rp', rate: 15700, flag: '🇮🇩' },
  Iraq: { country: 'Iraq', code: 'IQD', symbol: 'د.ع', rate: 1310, flag: '🇮🇶' },
  Ireland: { country: 'Ireland', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇮🇪' },
  Israel: { country: 'Israel', code: 'ILS', symbol: '₪', rate: 3.72, flag: '🇮🇱' },
  Italy: { country: 'Italy', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇮🇹' },
  Jamaica: { country: 'Jamaica', code: 'JMD', symbol: 'J$', rate: 158, flag: '🇯🇲' },
  Japan: { country: 'Japan', code: 'JPY', symbol: '¥', rate: 152, flag: '🇯🇵' },
  Jordan: { country: 'Jordan', code: 'JOD', symbol: 'JD', rate: 0.709, flag: '🇯🇴' },
  Kazakhstan: { country: 'Kazakhstan', code: 'KZT', symbol: '₸', rate: 490, flag: '🇰🇿' },
  Kenya: { country: 'Kenya', code: 'KES', symbol: 'KSh', rate: 129, flag: '🇰🇪' },
  Kuwait: { country: 'Kuwait', code: 'KWD', symbol: 'KD', rate: 0.307, flag: '🇰🇼' },
  Kyrgyzstan: { country: 'Kyrgyzstan', code: 'KGS', symbol: 'с', rate: 86, flag: '🇰🇬' },
  Laos: { country: 'Laos', code: 'LAK', symbol: '₭', rate: 21800, flag: '🇱🇦' },
  Lebanon: { country: 'Lebanon', code: 'LBP', symbol: 'L£', rate: 89500, flag: '🇱🇧' },
  Lesotho: { country: 'Lesotho', code: 'LSL', symbol: 'L', rate: 18.2, flag: '🇱🇸' },
  Liberia: { country: 'Liberia', code: 'LRD', symbol: 'L$', rate: 196, flag: '🇱🇷' },
  Libya: { country: 'Libya', code: 'LYD', symbol: 'LD', rate: 4.85, flag: '🇱🇾' },
  Madagascar: { country: 'Madagascar', code: 'MGA', symbol: 'Ar', rate: 4600, flag: '🇲🇬' },
  Malawi: { country: 'Malawi', code: 'MWK', symbol: 'MK', rate: 1740, flag: '🇲🇼' },
  Malaysia: { country: 'Malaysia', code: 'MYR', symbol: 'RM', rate: 4.38, flag: '🇲🇾' },
  Mali: { country: 'Mali', code: 'XOF', symbol: 'CFA', rate: 605, flag: '🇲🇱' },
  Mauritania: { country: 'Mauritania', code: 'MRU', symbol: 'UM', rate: 39.8, flag: '🇲🇷' },
  Mauritius: { country: 'Mauritius', code: 'MUR', symbol: '₨', rate: 46.5, flag: '🇲🇺' },
  Mexico: { country: 'Mexico', code: 'MXN', symbol: 'Mex$', rate: 20.1, flag: '🇲🇽' },
  Moldova: { country: 'Moldova', code: 'MDL', symbol: 'L', rate: 18.0, flag: '🇲🇩' },
  Mongolia: { country: 'Mongolia', code: 'MNT', symbol: '₮', rate: 3400, flag: '🇲🇳' },
  Morocco: { country: 'Morocco', code: 'MAD', symbol: 'DH', rate: 9.9, flag: '🇲🇦' },
  Mozambique: { country: 'Mozambique', code: 'MZN', symbol: 'MT', rate: 63.9, flag: '🇲🇿' },
  Myanmar: { country: 'Myanmar', code: 'MMK', symbol: 'K', rate: 2100, flag: '🇲🇲' },
  Namibia: { country: 'Namibia', code: 'NAD', symbol: 'N$', rate: 18.2, flag: '🇳🇦' },
  Nepal: { country: 'Nepal', code: 'NPR', symbol: '₨', rate: 134, flag: '🇳🇵' },
  Netherlands: { country: 'Netherlands', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇳🇱' },
  'New Zealand': { country: 'New Zealand', code: 'NZD', symbol: 'NZ$', rate: 1.68, flag: '🇳🇿' },
  Nicaragua: { country: 'Nicaragua', code: 'NIO', symbol: 'C$', rate: 36.8, flag: '🇳🇮' },
  Niger: { country: 'Niger', code: 'XOF', symbol: 'CFA', rate: 605, flag: '🇳🇪' },
  Nigeria: { country: 'Nigeria', code: 'NGN', symbol: '₦', rate: 1650, flag: '🇳🇬' },
  Norway: { country: 'Norway', code: 'NOK', symbol: 'kr', rate: 11.0, flag: '🇳🇴' },
  Oman: { country: 'Oman', code: 'OMR', symbol: 'RO', rate: 0.385, flag: '🇴🇲' },
  Pakistan: { country: 'Pakistan', code: 'PKR', symbol: '₨', rate: 277, flag: '🇵🇰' },
  Palestine: { country: 'Palestine', code: 'ILS', symbol: '₪', rate: 3.72, flag: '🇵🇸' },
  Panama: { country: 'Panama', code: 'USD', symbol: '$', rate: 1.0, flag: '🇵🇦' },
  'Papua New Guinea': { country: 'Papua New Guinea', code: 'PGK', symbol: 'K', rate: 3.96, flag: '🇵🇬' },
  Paraguay: { country: 'Paraguay', code: 'PYG', symbol: '₲', rate: 7900, flag: '🇵🇾' },
  Peru: { country: 'Peru', code: 'PEN', symbol: 'S/.', rate: 3.78, flag: '🇵🇪' },
  Philippines: { country: 'Philippines', code: 'PHP', symbol: '₱', rate: 58.2, flag: '🇵🇭' },
  Poland: { country: 'Poland', code: 'PLN', symbol: 'zł', rate: 4.02, flag: '🇵🇱' },
  Portugal: { country: 'Portugal', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇵🇹' },
  Qatar: { country: 'Qatar', code: 'QAR', symbol: 'QR', rate: 3.64, flag: '🇶🇦' },
  Romania: { country: 'Romania', code: 'RON', symbol: 'lei', rate: 4.60, flag: '🇷🇴' },
  Rwanda: { country: 'Rwanda', code: 'RWF', symbol: 'FRw', rate: 1360, flag: '🇷🇼' },
  'Saudi Arabia': { country: 'Saudi Arabia', code: 'SAR', symbol: 'SR', rate: 3.75, flag: '🇸🇦' },
  Senegal: { country: 'Senegal', code: 'XOF', symbol: 'CFA', rate: 605, flag: '🇸🇳' },
  Serbia: { country: 'Serbia', code: 'RSD', symbol: 'din', rate: 108, flag: '🇷🇸' },
  'Sierra Leone': { country: 'Sierra Leone', code: 'SLE', symbol: 'Le', rate: 22.8, flag: '🇸🇱' },
  Singapore: { country: 'Singapore', code: 'SGD', symbol: 'S$', rate: 1.32, flag: '🇸🇬' },
  Somalia: { country: 'Somalia', code: 'SOS', symbol: 'Ssh', rate: 571, flag: '🇸🇴' },
  'South Africa': { country: 'South Africa', code: 'ZAR', symbol: 'R', rate: 18.2, flag: '🇿🇦' },
  'South Sudan': { country: 'South Sudan', code: 'SSP', symbol: '£', rate: 3100, flag: '🇸🇸' },
  Spain: { country: 'Spain', code: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇸' },
  'Sri Lanka': { country: 'Sri Lanka', code: 'LKR', symbol: 'Rs', rate: 293, flag: '🇱🇰' },
  Sudan: { country: 'Sudan', code: 'SDG', symbol: '£', rate: 600, flag: '🇸🇩' },
  Sweden: { country: 'Sweden', code: 'SEK', symbol: 'kr', rate: 10.7, flag: '🇸🇪' },
  Switzerland: { country: 'Switzerland', code: 'CHF', symbol: 'CHF', rate: 0.865, flag: '🇨🇭' },
  Syria: { country: 'Syria', code: 'SYP', symbol: 'LS', rate: 13000, flag: '🇸🇾' },
  Taiwan: { country: 'Taiwan', code: 'TWD', symbol: 'NT$', rate: 32.0, flag: '🇹🇼' },
  Tajikistan: { country: 'Tajikistan', code: 'TJS', symbol: 'SM', rate: 10.6, flag: '🇹🇯' },
  Tanzania: { country: 'Tanzania', code: 'TZS', symbol: 'TSh', rate: 2670, flag: '🇹🇿' },
  Thailand: { country: 'Thailand', code: 'THB', symbol: '฿', rate: 33.8, flag: '🇹🇭' },
  Togo: { country: 'Togo', code: 'XOF', symbol: 'CFA', rate: 605, flag: '🇹🇬' },
  'Trinidad and Tobago': { country: 'Trinidad and Tobago', code: 'TTD', symbol: 'TT$', rate: 6.78, flag: '🇹🇹' },
  Tunisia: { country: 'Tunisia', code: 'TND', symbol: 'DT', rate: 3.12, flag: '🇹🇳' },
  Turkey: { country: 'Turkey', code: 'TRY', symbol: '₺', rate: 34.3, flag: '🇹🇷' },
  Uganda: { country: 'Uganda', code: 'UGX', symbol: 'USh', rate: 3680, flag: '🇺🇬' },
  Ukraine: { country: 'Ukraine', code: 'UAH', symbol: '₴', rate: 41.5, flag: '🇺🇦' },
  'United Arab Emirates': { country: 'United Arab Emirates', code: 'AED', symbol: 'AED', rate: 3.67, flag: '🇦🇪' },
  'United Kingdom': { country: 'United Kingdom', code: 'GBP', symbol: '£', rate: 0.775, flag: '🇬🇧' },
  'United States': { country: 'United States', code: 'USD', symbol: '$', rate: 1.0, flag: '🇺🇸' },
  Uruguay: { country: 'Uruguay', code: 'UYU', symbol: '$U', rate: 41.5, flag: '🇺🇾' },
  Uzbekistan: { country: 'Uzbekistan', code: 'UZS', symbol: 'soʻm', rate: 12800, flag: '🇺🇿' },
  Venezuela: { country: 'Venezuela', code: 'VES', symbol: 'Bs.', rate: 43.0, flag: '🇻🇪' },
  Vietnam: { country: 'Vietnam', code: 'VND', symbol: '₫', rate: 25300, flag: '🇻🇳' },
  Yemen: { country: 'Yemen', code: 'YER', symbol: '﷼', rate: 250, flag: '🇾🇪' },
  Zimbabwe: { country: 'Zimbabwe', code: 'ZWG', symbol: 'ZiG', rate: 26.5, flag: '🇿🇼' }
};

/**
 * Standard default registration fee in USD (subsidized document intake and verification: $10 USD = K 270 ZMW at rate 27)
 */
export const DEFAULT_REGISTRATION_FEE_USD = 10;

/**
 * Look up currency details by country name (case-insensitive fuzzy match)
 * Defaults to Zambia (ZMW, K, rate: 27, 🇿🇲)
 */
export const getCurrency = (countryName?: string): CurrencyInfo => {
  if (!countryName) {
    return allCurrencies['Zambia'];
  }

  const trimmed = countryName.trim().toLowerCase();

  // Exact or normalized match
  for (const [key, curr] of Object.entries(allCurrencies)) {
    if (key.toLowerCase() === trimmed || curr.country.toLowerCase() === trimmed) {
      return curr;
    }
  }

  // Partial match fallback
  for (const [key, curr] of Object.entries(allCurrencies)) {
    if (trimmed.includes(key.toLowerCase()) || key.toLowerCase().includes(trimmed)) {
      return curr;
    }
  }

  // Fallback to Zambia as specified in prompt
  return allCurrencies['Zambia'];
};

/**
 * Format local currency representation
 * e.g. "K 2,700 ZMW ($100 USD) 🇿🇲"
 */
export const formatFundingDisplay = (usdAmount: number, countryName?: string): string => {
  const curr = getCurrency(countryName);
  const localVal = Math.round(usdAmount * curr.rate);
  const formattedLocal = localVal.toLocaleString();
  const formattedUsd = Math.round(usdAmount).toLocaleString();
  return `${curr.symbol} ${formattedLocal} ${curr.code} ($${formattedUsd} USD) ${curr.flag}`;
};

/**
 * Sorted list of all countries for dropdown select
 */
export const countryList: CurrencyInfo[] = Object.values(allCurrencies).sort((a, b) =>
  a.country.localeCompare(b.country)
);
