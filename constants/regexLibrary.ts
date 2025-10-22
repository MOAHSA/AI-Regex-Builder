import { RegexLibraryCategory } from '../types';

export const REGEX_LIBRARY: RegexLibraryCategory[] = [
  {
    name: 'Common Formats',
    patterns: [
      {
        name: 'Email Address',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        description: 'Matches most standard email address formats.',
      },
      {
        name: 'URL',
        pattern: '^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)?/?$',
        description: 'Matches a web URL with optional protocol.',
      },
      {
        name: 'Date (YYYY-MM-DD)',
        pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
        description: 'Matches a date in YYYY-MM-DD format.',
      },
      {
        name: 'Date (MM/DD/YYYY)',
        pattern: '^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/\\d{4}$',
        description: 'Matches a date in MM/DD/YYYY format.',
      },
      {
        name: 'Time (HH:MM 12-hr)',
        pattern: '^(0?[1-9]|1[0-2]):[0-5][0-9] ?([AP]M)?$',
        description: 'Matches time in 12-hour format (e.g., 03:30 PM).',
      },
       {
        name: 'Time (HH:MM 24-hr)',
        pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
        description: 'Matches a time in 24-hour HH:MM format.',
      },
      {
        name: 'Username',
        pattern: '^[a-zA-Z0-9_.-]{3,16}$',
        description: 'Matches a username with 3-16 alphanumeric characters, underscores, dots, or hyphens.',
      },
      {
        name: 'Strong Password',
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
        description: 'Requires >= 8 chars, one uppercase, one lowercase, one number, and one special character.',
      },
    ],
  },
  {
    name: 'Phone Numbers',
    patterns: [
      {
        name: 'Phone Number (Multi-format)',
        description: 'Select a country format for phone number validation.',
        variations: [
          { name: 'USA', pattern: '^(\\+?1[\\s-]?)?\\(?([2-9][0-8][0-9])\\)?[\\s-]?([2-9][0-9]{2})[\\s-]?([0-9]{4})$', description: 'Matches standard US phone numbers.' },
          { name: 'UK', pattern: '^(\\+44\\s?|0)7\\d{3}\\s?\\d{6}$', description: 'Matches UK mobile phone numbers.' },
          { name: 'India', pattern: '^(\\+91[\\s-]?)?[6789]\\d{9}$', description: 'Matches Indian mobile phone numbers.' },
          { name: 'Germany', pattern: '^(\\+49[\\s-]?)?(0)?(15|16|17)[0-9]{8,9}$', description: 'Matches German mobile phone numbers.' },
          { name: 'France', pattern: '^(\\+33|0)[1-9](\\d{2}){4}$', description: 'Matches French phone numbers.' },
          { name: 'Australia', pattern: '^(\\+61|0)4\\d{2}\\s?\\d{3}\\s?\\d{3}$', description: 'Matches Australian mobile numbers.' },
          { name: 'Brazil', pattern: '^(\\+55[\\s-]?)?\\(?([1-9]{2})\\)?[\\s-]?9?[6-9]\\d{3}[\\s-]?\\d{4}$', description: 'Matches Brazilian mobile numbers.' },
          { name: 'Generic International', pattern: '^\\+(?:[0-9] ?){6,14}[0-9]$', description: 'Matches international numbers with a leading +.' },
        ],
      },
    ]
  },
  {
    name: 'Finance & IDs',
    patterns: [
      {
        name: 'Credit Card (Multi-format)',
        description: 'Select a credit card type.',
        variations: [
          { name: 'Visa', pattern: '^4[0-9]{12}(?:[0-9]{3})?$', description: 'Matches Visa credit card numbers.' },
          { name: 'Mastercard', pattern: '^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$', description: 'Matches Mastercard numbers.' },
          { name: 'American Express', pattern: '^3[47][0-9]{13}$', description: 'Matches American Express card numbers.' },
          { name: 'Discover', pattern: '^6(?:011|5[0-9]{2})[0-9]{12}$', description: 'Matches Discover card numbers.' },
        ]
      },
      {
        name: 'IBAN',
        pattern: '^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$',
        description: 'Matches a generic International Bank Account Number.',
      },
      {
        name: 'Bitcoin Address',
        pattern: '^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$',
        description: 'Matches common Bitcoin address formats (P2PKH, P2SH, Bech32).',
      },
      {
        name: 'Ethereum Address',
        pattern: '^0x[a-fA-F0-9]{40}$',
        description: 'Matches an Ethereum wallet address.',
      },
    ]
  },
  {
    name: 'Network',
    patterns: [
      {
        name: 'IPv4 Address',
        pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
        description: 'Matches an IPv4 address.',
      },
      {
        name: 'IPv6 Address',
        pattern: '(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))',
        description: 'Matches an IPv6 address.',
      },
      {
        name: 'MAC Address',
        pattern: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
        description: 'Matches a MAC address with colons or hyphens.',
      },
    ],
  },
  {
    name: 'Social Media & Usernames',
    patterns: [
      { name: 'Twitter/X Handle', pattern: '^@?(\\w){1,15}$', description: 'Matches a Twitter/X username.' },
      { name: 'Instagram Handle', pattern: '^(?!.*\\.\\.)(?!.*\\.$)[^\\W][\\w.]{0,29}$', description: 'Matches an Instagram username.'},
      { name: 'Facebook Profile URL', pattern: '^(https?:\\/\\/)?(www\\.)?facebook.com\\/(profile.php\\?id=\\d+|[\\w.-]+)\\/?$', description: 'Matches a Facebook profile URL.'},
      { name: 'LinkedIn Profile URL', pattern: '^https?:\\/\\/(www\\.)?linkedin.com\\/in\\/[A-Za-z0-9-]+\\/?$', description: 'Matches a LinkedIn profile URL.'},
      { name: 'Discord Username', pattern: '^[a-z0-9_.]{2,32}$', description: 'Matches a Discord username (new format without discriminator).'},
      { name: 'Hashtag', pattern: '(^|\\s)#(\\w+)', description: 'Matches a hashtag in text.'}
    ]
  },
  {
    name: 'Development',
    patterns: [
      {
        name: 'UUID',
        pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
        description: 'Matches a Universally Unique Identifier (UUID).',
      },
      {
        name: 'Semantic Version (SemVer)',
        pattern: '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$',
        description: 'Matches a semantic version string (e.g., 1.2.3-alpha.1).',
      },
      {
        name: 'JWT (JSON Web Token)',
        pattern: '^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+/=]*$',
        description: 'Matches the structure of a JSON Web Token.',
      },
      {
        name: 'Git SSH URL',
        pattern: '^git@([a-zA-Z0-9.-]+):([a-zA-Z0-9._-]+/[a-zA-Z0-9._-]+)\\.git$',
        description: 'Matches a git repository SSH URL.',
      },
      {
        name: 'Slug (URL-friendly string)',
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        description: 'Matches a URL-friendly slug.',
      },
      {
        name: 'HTML Tag',
        pattern: '<([a-z][a-z0-9]*)\\b[^>]*>([\\s\\S]*?)<\\/\\1>',
        description: 'Matches a simple HTML tag with content.'
      },
      {
        name: 'Hex Color Code',
        pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$',
        description: 'Matches a hex color code with an optional leading #.',
      },
    ]
  },
  {
    name: 'Miscellaneous',
    patterns: [
      { name: 'Integer', pattern: '^-?\\d+$', description: 'Matches a positive or negative integer.' },
      { name: 'Decimal Number', pattern: '^-?\\d*\\.\\d+$', description: 'Matches a positive or negative decimal number.' },
      { name: 'Alphabetical String', pattern: '^[a-zA-Z]+$', description: 'Matches a string containing only letters.'},
      { name: 'Alphanumeric String', pattern: '^[a-zA-Z0-9]+$', description: 'Matches a string with only letters and numbers.'},
      { name: 'GUID', pattern: '^\\{?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}\\}?$', description: 'Matches a GUID with or without braces.'},
    ]
  }
];