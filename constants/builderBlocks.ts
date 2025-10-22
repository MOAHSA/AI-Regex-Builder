import { BuilderCategory } from '../types';

export const BUILDER_CATEGORIES: BuilderCategory[] = [
  {
    name: 'Character Classes',
    blocks: [
      { label: 'Digit', token: '\\d', description: 'Matches any digit (0-9).' },
      { label: 'Not Digit', token: '\\D', description: 'Matches any non-digit.' },
      { label: 'Word Char', token: '\\w', description: 'Matches any word character (a-z, A-Z, 0-9, _).' },
      { label: 'Not Word', token: '\\W', description: 'Matches any non-word character.' },
      { label: 'Whitespace', token: '\\s', description: 'Matches any whitespace character (space, tab, newline).' },
      { label: 'Not Whitespace', token: '\\S', description: 'Matches any non-whitespace character.' },
      { label: 'Any Character', token: '.', description: 'Matches any character except newline.' },
    ],
  },
  {
    name: 'Anchors',
    blocks: [
      { label: 'Start of String', token: '^', description: 'Matches the beginning of the string.' },
      { label: 'End of String', token: '$', description: 'Matches the end of the string.' },
      { label: 'Word Boundary', token: '\\b', description: 'Matches a word boundary.' },
      { label: 'Not Word Boundary', token: '\\B', description: 'Matches a non-word boundary.' },
    ],
  },
  {
    name: 'Quantifiers',
    blocks: [
      { label: '0 or more', token: '*', description: 'Matches the preceding element 0 or more times.' },
      { label: '1 or more', token: '+', description: 'Matches the preceding element 1 or more times.' },
      { label: '0 or 1', token: '?', description: 'Matches the preceding element 0 or 1 time.' },
      { label: 'Exactly {n}', token: '{n}', description: 'Matches the preceding element exactly n times. Replace n with a number.', cursorOffset: 2 },
      { label: '{n} or more', token: '{n,}', description: 'Matches the preceding element n or more times. Replace n with a number.', cursorOffset: 3 },
      { label: '{n} to {m}', token: '{n,m}', description: 'Matches the preceding element between n and m times. Replace n and m.', cursorOffset: 4 },
    ],
  },
  {
    name: 'Groups & Ranges',
    blocks: [
      { label: 'Capturing Group', token: '()', description: 'Groups multiple tokens together and creates a capture group.', cursorOffset: 1 },
      { label: 'Non-capturing Group', token: '(?:)', description: 'Groups multiple tokens together without creating a capture group.', cursorOffset: 1 },
      { label: 'Character Set', token: '[]', description: 'Matches any single character within the brackets.', cursorOffset: 1 },
      { label: 'Negated Set', token: '[^]', description: 'Matches any single character not within the brackets.', cursorOffset: 1 },
      { label: 'Range (a-z)', token: '[a-z]', description: 'Matches any lowercase letter from a to z.' },
      { label: 'Alternation (or)', token: '|', description: 'Acts like a boolean OR. Matches the expression before or after the |.' },
    ],
  },
  {
    name: 'Lookarounds',
    blocks: [
      { label: 'Positive Lookahead', token: '(?=)', description: 'Asserts that the following characters match, without including them in the result.', cursorOffset: 1 },
      { label: 'Negative Lookahead', token: '(?!_)', description: 'Asserts that the following characters do not match.', cursorOffset: 2 },
      { label: 'Positive Lookbehind', token: '(?<=)', description: 'Asserts that the preceding characters match, without including them in the result.', cursorOffset: 1 },
      { label: 'Negative Lookbehind', token: '(?<!_)', description: 'Asserts that the preceding characters do not match.', cursorOffset: 2 },
    ]
  },
];