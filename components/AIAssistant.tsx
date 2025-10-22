import React, { useState } from 'react';
import { generateRegex, explainRegex } from '../services/geminiService';

interface AIAssistantProps {
  onRegexGenerated: (regex: string) => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-200"></div>
  </div>
);

export const AIAssistant: React.FC<AIAssistantProps> = ({ onRegexGenerated }) => {
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [explainPrompt, setExplainPrompt] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  // FIX: Renamed state variable 'is объясняющий' to 'isExplaining' to fix a parsing error.
  const [isExplaining, setIsExplaining] = useState(false);

  const handleGenerate = async () => {
    if (!generatePrompt) return;
    setIsGenerating(true);
    const result = await generateRegex(generatePrompt);
    if (!result.startsWith('Error:')) {
      onRegexGenerated(result);
    } else {
      alert(result);
    }
    setIsGenerating(false);
  };

  const handleExplain = async () => {
    if (!explainPrompt) return;
    setIsExplaining(true);
    setExplanation('');
    const result = await explainRegex(explainPrompt);
    setExplanation(result);
    setIsExplaining(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
      {/* Generate Regex Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-blue-400">Generate Regex from Text</h3>
        <p className="text-sm text-gray-400">Describe the pattern you want to match in plain English.</p>
        <textarea
          value={generatePrompt}
          onChange={(e) => setGeneratePrompt(e.target.value)}
          placeholder="e.g., A valid email address"
          className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !generatePrompt}
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition flex justify-center items-center"
        >
          {isGenerating ? <LoadingSpinner /> : 'Generate'}
        </button>
      </div>

      {/* Explain Regex Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-green-400">Explain Regex</h3>
        <p className="text-sm text-gray-400">Enter a regular expression to get a detailed explanation.</p>
        <textarea
          value={explainPrompt}
          onChange={(e) => setExplainPrompt(e.target.value)}
          placeholder="e.g., ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition font-mono"
        />
        <button
          onClick={handleExplain}
          disabled={isExplaining || !explainPrompt}
          className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition flex justify-center items-center"
        >
          {isExplaining ? <LoadingSpinner /> : 'Explain'}
        </button>
        { (isExplaining || explanation) && (
            <div className="mt-2 p-4 bg-gray-800 border border-gray-600 rounded-md max-h-64 overflow-y-auto">
                {isExplaining && <div className="text-center"><LoadingSpinner/></div>}
                {explanation && <div className="prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }} />}
            </div>
        )}
      </div>
    </div>
  );
};
