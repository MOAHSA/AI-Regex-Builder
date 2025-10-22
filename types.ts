export interface BuilderBlock {
  label: string;
  token: string;
  description: string;
  cursorOffset?: number; // Moves cursor back from the end of the token
}

export interface BuilderCategory {
  name: string;
  blocks: BuilderBlock[];
}

export enum Tab {
  BUILDER = 'Builder',
  TESTER = 'Tester',
  LIBRARY = 'Library',
  AI_HELPER = 'AI Assistant',
}

// Base type for a single regex pattern
export interface RegexPattern {
  name: string;
  pattern: string;
  description: string;
}

// A pattern that has selectable variations (e.g., phone numbers for different countries)
export interface RegexPatternWithVariations {
  name: string;
  description: string;
  variations: RegexPattern[];
  pattern?: undefined; // A parent with variations does not have its own top-level pattern
}

// A library entry can be either a single pattern or one with variations
export type RegexLibraryEntry = RegexPattern | RegexPatternWithVariations;

export interface RegexLibraryCategory {
  name: string;
  patterns: RegexLibraryEntry[];
}
