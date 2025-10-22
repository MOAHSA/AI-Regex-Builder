import React, { useState, useMemo } from 'react';
import { REGEX_LIBRARY } from '../constants/regexLibrary';
import { RegexLibraryEntry, RegexPattern, RegexPatternWithVariations } from '../types';

interface RegexLibraryProps {
  onPatternSelect: (pattern: string) => void;
}

const isPatternWithVariations = (entry: RegexLibraryEntry): entry is RegexPatternWithVariations => {
  return (entry as RegexPatternWithVariations).variations !== undefined;
};

const PatternCard: React.FC<{ entry: RegexLibraryEntry; onSelect: (pattern: string) => void }> = ({ entry, onSelect }) => {
    const initialVariation = isPatternWithVariations(entry) ? entry.variations[0] : (entry as RegexPattern);
    const [selectedVariation, setSelectedVariation] = useState<RegexPattern>(initialVariation);
    const [copyText, setCopyText] = useState('Copy');

    const handleCopy = () => {
        if (!selectedVariation?.pattern) return;
        navigator.clipboard.writeText(selectedVariation.pattern);
        setCopyText('Copied!');
        setTimeout(() => setCopyText('Copy'), 1500);
    };
    
    const handleVariationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!isPatternWithVariations(entry)) return;
        const selected = entry.variations?.find(v => v.name === e.target.value) || entry.variations[0];
        setSelectedVariation(selected);
    };
    
    return (
        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg flex flex-col h-full">
            <h4 className="font-semibold text-blue-400">{entry.name}</h4>
            <p className="text-xs text-gray-400 mt-1 mb-3 flex-grow">
                {isPatternWithVariations(entry) ? selectedVariation.description : entry.description}
            </p>
            
            {isPatternWithVariations(entry) && (
                <select 
                    onChange={handleVariationChange} 
                    className="w-full p-2 mb-3 bg-gray-800 border border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    {entry.variations.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                </select>
            )}

            <div className="mb-3 font-mono text-sm bg-gray-800 p-2 rounded-md text-yellow-300 break-all">
                {selectedVariation.pattern}
            </div>
            
            <div className="flex items-center gap-2 mt-auto">
                <button
                    onClick={() => onSelect(selectedVariation.pattern)}
                    className="flex-grow px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition"
                >
                    Use Pattern
                </button>
                <button
                    onClick={handleCopy}
                    className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold transition"
                >
                    {copyText}
                </button>
            </div>
        </div>
    );
};


export const RegexLibrary: React.FC<RegexLibraryProps> = ({ onPatternSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLibrary = useMemo(() => {
    if (!searchTerm) {
      return REGEX_LIBRARY;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    
    return REGEX_LIBRARY.map(category => {
      const filteredPatterns = category.patterns.filter(entry => {
        const nameMatch = entry.name.toLowerCase().includes(lowercasedFilter);
        const descMatch = entry.description.toLowerCase().includes(lowercasedFilter);
        
        if (isPatternWithVariations(entry)) {
           const variationMatch = entry.variations.some(v => 
               v.name.toLowerCase().includes(lowercasedFilter) || 
               v.description.toLowerCase().includes(lowercasedFilter) ||
               v.pattern.toLowerCase().includes(lowercasedFilter)
           );
           return nameMatch || descMatch || variationMatch;
        } else {
            const patternMatch = entry.pattern.toLowerCase().includes(lowercasedFilter);
            return nameMatch || descMatch || patternMatch;
        }
      });
      
      return { ...category, patterns: filteredPatterns };
    }).filter(category => category.patterns.length > 0);

  }, [searchTerm]);


  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto">
      <div className="mb-6 sticky top-0 bg-gray-800 py-2">
        <input
            type="text"
            placeholder="Search library..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <div className="space-y-8">
        {filteredLibrary.length > 0 ? filteredLibrary.map((category) => (
          <div key={category.name}>
            <h3 className="text-xl font-semibold text-gray-300 mb-4">{category.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {category.patterns.map((entry) => (
                <PatternCard key={entry.name} entry={entry} onSelect={onPatternSelect} />
              ))}
            </div>
          </div>
        )) : (
            <div className="text-center py-10 text-gray-500">
                <p>No patterns found for "{searchTerm}"</p>
            </div>
        )}
      </div>
    </div>
  );
};
