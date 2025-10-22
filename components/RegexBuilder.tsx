import React, { useRef, useEffect, useMemo, useState } from 'react';
import { BUILDER_CATEGORIES } from '../constants/builderBlocks';
import { BuilderBlock } from '../types';
import { RegexTester } from './RegexTester';

interface RegexBuilderProps {
  regex: string;
  setRegex: (regex: string) => void;
  testString: string;
  setTestString: (testString: string) => void;
  flags: string;
}

const TOKEN_EXPLANATIONS: { [key: string]: string } = {
    '\\d': 'Matches any digit (0-9).',
    '\\D': 'Matches any character that is not a digit.',
    '\\w': 'Matches any word character (alphanumeric + underscore).',
    '\\W': 'Matches any non-word character.',
    '\\s': 'Matches any whitespace character.',
    '\\S': 'Matches any non-whitespace character.',
    '.': 'Matches any character except newline.',
    '^': 'Asserts position at the start of the string.',
    '$': 'Asserts position at the end of the string.',
    '\\b': 'Asserts a word boundary.',
    '\\B': 'Asserts a non-word boundary.',
    '*': 'Quantifier: Matches the preceding token 0 or more times.',
    '+': 'Quantifier: Matches the preceding token 1 or more times.',
    '?': 'Quantifier: Matches the preceding token 0 or 1 time.',
    '|': 'Acts as a boolean OR, matching the expression before or after it.'
};

const parseRegex = (regex: string) => {
    const tokens = [];
    // This regex is a simplified parser for visualization purposes
    const regexTokenizer = /(\\[dDwWsSbBtrn])|(\(.*\))|(\[.*\])|(\\{.*?\\})|([\^\$\.\|\*\+\?])/g;
    let match;
    let lastIndex = 0;

    while ((match = regexTokenizer.exec(regex)) !== null) {
        if (match.index > lastIndex) {
            tokens.push({ token: regex.substring(lastIndex, match.index), type: 'Literal' });
        }
        const matchedToken = match[0];
        let type = 'Unknown';
        if (match[1]) type = 'Character Class';
        else if (match[2]) type = 'Group';
        else if (match[3]) type = 'Character Set';
        else if (match[4]) type = 'Quantifier';
        else if (match[5]) type = 'Anchor/Meta';
        
        tokens.push({ token: matchedToken, type });
        lastIndex = match.index + matchedToken.length;
    }

    if (lastIndex < regex.length) {
        tokens.push({ token: regex.substring(lastIndex), type: 'Literal' });
    }

    return tokens.map(t => {
        let description = TOKEN_EXPLANATIONS[t.token] || `Literal characters: "${t.token}"`;
        if (t.type === 'Group') description = `Capturing Group: Matches the expression inside the parentheses.`;
        if (t.type === 'Character Set') description = `Character Set: Matches any single character inside the brackets.`;
        if (t.token.startsWith('{')) description = `Quantifier: Specifies the number of repetitions.`;
        return { ...t, description };
    });
};

export const RegexBuilder: React.FC<RegexBuilderProps> = ({ regex, setRegex, testString, setTestString, flags }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [lastSelection, setLastSelection] = useState<{ start: number, end: number }>({ start: 0, end: 0 });

  useEffect(() => {
    if (inputRef.current) {
        inputRef.current.selectionStart = lastSelection.start;
        inputRef.current.selectionEnd = lastSelection.end;
    }
  }, [regex, lastSelection]);

  const handleTokenClick = (block: BuilderBlock) => {
    if (!inputRef.current) return;
    
    const { token, cursorOffset = 0 } = block;
    const { selectionStart, selectionEnd, value } = inputRef.current;

    const newValue = value.substring(0, selectionStart) + token + value.substring(selectionEnd);
    setRegex(newValue);
    
    const newCursorPos = selectionStart + token.length - cursorOffset;
    setLastSelection({ start: newCursorPos, end: newCursorPos });

    inputRef.current.focus();
  };
  
  const explainedTokens = useMemo(() => parseRegex(regex), [regex]);

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-1/3 p-4 overflow-y-auto border-r border-gray-700">
        <div className="space-y-4">
          {BUILDER_CATEGORIES.map((category) => (
            <div key={category.name}>
              <h3 className="text-md font-semibold text-blue-400 mb-2">{category.name}</h3>
              <div className="grid grid-cols-2 gap-2">
                {category.blocks.map((block) => (
                  <button
                    key={block.label}
                    onClick={() => handleTokenClick(block)}
                    className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition text-left"
                    title={block.description}
                  >
                    <p className="font-mono text-xs text-green-400">{block.token}</p>
                    <p className="text-xs text-gray-300 mt-1">{block.label}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-2/3 p-4 flex flex-col gap-4">
        <div>
            <label className="text-sm font-semibold mb-1 text-gray-300">Builder</label>
            <textarea
                ref={inputRef}
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                placeholder="Build your regex here"
                className="w-full h-24 p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono"
            />
        </div>
         <div className="flex-shrink-0">
          <h3 className="text-md font-semibold text-blue-400 mb-2">Explanation</h3>
          <div className="p-2 bg-gray-900 border border-gray-600 rounded-md max-h-32 overflow-y-auto text-sm">
            {explainedTokens.length > 0 ? (
                <ul className="space-y-1">
                {explainedTokens.map((part, i) => (
                    <li key={i}><code className="bg-gray-700 text-yellow-300 rounded px-1">{part.token}</code> - <span className="text-gray-300">{part.description}</span></li>
                ))}
                </ul>
            ) : <p className="text-gray-500">Your regex breakdown will appear here.</p>}
          </div>
        </div>
        <div className="flex-grow flex flex-col">
            <h3 className="text-md font-semibold text-blue-400 mb-2">Live Preview</h3>
             <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter string to test against"
              className="w-full h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono"
              spellCheck="false"
            />
            <div className="mt-2 flex-grow overflow-y-auto">
                 <RegexTester regex={regex} testString={testString} flags={flags} />
            </div>
        </div>
      </div>
    </div>
  );
};