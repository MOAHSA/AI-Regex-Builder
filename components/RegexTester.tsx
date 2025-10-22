import React, { useMemo, useState } from 'react';

interface RegexTesterProps {
  regex: string;
  testString: string;
  flags: string;
}

const HighlightedText: React.FC<{ text: string; highlights: { start: number; end: number }[] }> = ({ text, highlights }) => {
  if (!highlights.length || !text) {
    return <>{text || <span className="text-gray-500">Enter text to see highlights...</span>}</>;
  }

  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;

  highlights.forEach((highlight, i) => {
    if (highlight.start > lastIndex) {
      parts.push(text.substring(lastIndex, highlight.start));
    }
    parts.push(
      <mark key={i} className="bg-yellow-500 bg-opacity-40 rounded-sm text-yellow-100 px-0.5">
        {text.substring(highlight.start, highlight.end)}
      </mark>
    );
    lastIndex = highlight.end;
  });

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
};

const ExtractedMatchesModal: React.FC<{ matches: RegExpExecArray[], onClose: () => void }> = ({ matches, onClose }) => {
    const [copyText, setCopyText] = useState('Copy All');
    const allMatchesText = matches.map(m => m[0]).join('\n');

    const handleCopy = () => {
        navigator.clipboard.writeText(allMatchesText);
        setCopyText('Copied!');
        setTimeout(() => setCopyText('Copy All'), 2000);
    };

    const triggerDownload = (filename: string, content: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadTxt = () => {
        triggerDownload('matches.txt', allMatchesText, 'text/plain');
    };

    const handleDownloadCsv = () => {
        const maxGroups = Math.max(0, ...matches.map(m => m.length - 1));
        const headers = ['Full Match', ...Array.from({ length: maxGroups }, (_, i) => `Group ${i + 1}`)];
        
        const csvRows = [
            headers.join(','),
            ...matches.map(match => {
                const row = Array.from(match);
                // Ensure row has enough columns for all headers
                while (row.length <= maxGroups) {
                    row.push('');
                }
                // FIX: Coerce cell to a string to prevent type error on 'replace'. The type of `cell` can be inferred as unknown.
                return row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',');
            })
        ];
        
        triggerDownload('matches.csv', csvRows.join('\n'), 'text/csv');
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-gray-700 flex flex-col gap-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-blue-400">Extracted Matches ({matches.length})</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
                </div>
                <textarea
                    readOnly
                    value={allMatchesText}
                    className="w-full h-64 p-3 bg-gray-900 border border-gray-600 rounded-md font-mono text-sm"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                     <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                    >
                        {copyText}
                    </button>
                    <button
                        onClick={handleDownloadTxt}
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
                    >
                        Download TXT
                    </button>
                    <button
                        onClick={handleDownloadCsv}
                        className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
                    >
                        Download CSV
                    </button>
                </div>
            </div>
        </div>
    );
};


export const RegexTester: React.FC<RegexTesterProps> = ({ regex, testString, flags }) => {
  const [showExtracted, setShowExtracted] = useState(false);
  
  const { matches, error, highlights } = useMemo(() => {
    if (!regex) {
      return { matches: [], error: null, highlights: [] };
    }
    try {
      const re = new RegExp(regex, flags);
      const currentMatches: RegExpExecArray[] = [];
      const currentHighlights: { start: number; end: number }[] = [];
      let match;
      
      if (flags.includes('g')) {
        while ((match = re.exec(testString)) !== null) {
          // FIX: Push the original match array, not a spread object, to preserve properties like .index
          currentMatches.push(match);
          if (match[0].length > 0) {
              currentHighlights.push({ start: match.index, end: match.index + match[0].length });
          } else {
             // Handle zero-length matches to prevent infinite loops
             if (re.lastIndex === testString.length && testString.length > 0) break;
             if (re.lastIndex === match.index) re.lastIndex++;
          }
        }
      } else {
        match = re.exec(testString);
        if (match) {
          currentMatches.push(match);
          if (match[0].length > 0) {
              currentHighlights.push({ start: match.index, end: match.index + match[0].length });
          }
        }
      }

      return { matches: currentMatches, error: null, highlights: currentHighlights };
    } catch (e: any) {
      return { matches: [], error: e.message, highlights: [] };
    }
  }, [regex, testString, flags]);

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col gap-6">
      {showExtracted && <ExtractedMatchesModal matches={matches} onClose={() => setShowExtracted(false)} />}
      {error && (
        <div className="p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-md text-red-300 font-mono text-sm">
          <strong>Invalid Regex:</strong> {error}
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Match Highlights</h3>
        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg whitespace-pre-wrap break-words font-mono text-sm min-h-[8rem] text-gray-300">
            <HighlightedText text={testString} highlights={highlights} />
        </div>
      </div>

      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-300">Match Information ({matches.length} found)</h3>
            <button
                onClick={() => setShowExtracted(true)}
                disabled={matches.length === 0}
                className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded-md text-white font-semibold transition disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                Extract Matches
            </button>
        </div>
        <div className="flex-grow overflow-y-auto bg-gray-900 p-2 rounded-lg border border-gray-700">
            {matches.length > 0 ? (
            <ul className="space-y-3">
                {matches.map((match, index) => (
                <li key={index} className="p-3 bg-gray-800 border border-gray-700 rounded-md">
                    <div className="font-mono text-sm">
                    <p><span className="font-bold text-green-400">Match {index + 1}:</span> <span className="bg-gray-700 px-1 rounded text-yellow-300">{match[0] || '(empty match)'}</span></p>
                    <p className="text-gray-400 text-xs mt-1">Index: {match.index}, Length: {match[0].length}</p>
                    {match.length > 1 && (
                        <div className="mt-2 pt-2 border-t border-gray-600">
                        <p className="text-gray-400 font-semibold mb-1 text-xs">Capture Groups:</p>
                        <ul className="space-y-1 pl-4">
                            {Array.from(match).slice(1).map((group, groupIndex) => (
                            <li key={groupIndex} className="text-xs"><span className="text-purple-400">Group {groupIndex + 1}:</span> <span className="bg-gray-700 px-1 rounded">{group === undefined ? 'undefined' : (group || '(empty match)')}</span></li>
                            ))}
                        </ul>
                        </div>
                    )}
                    </div>
                </li>
                ))}
            </ul>
            ) : (
            <div className="text-center py-10 text-gray-500">
                <p>No matches found.</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};