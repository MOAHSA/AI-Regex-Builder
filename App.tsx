import React, { useState, useRef } from 'react';
import { AIAssistant } from './components/AIAssistant';
import { RegexBuilder } from './components/RegexBuilder';
import { RegexLibrary } from './components/RegexLibrary';
import { RegexTester } from './components/RegexTester';
import { Tab } from './types';
import { generateTestString } from './services/geminiService';
import { Icons } from './components/Icons';

type AppState = {
  regex: string;
  testString: string;
  flags: { g: boolean; i: boolean; m: boolean; };
}

const NavItem: React.FC<{
  tab: Tab;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  children: React.ReactNode;
}> = ({ tab, activeTab, setActiveTab, children }) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-left ${
      activeTab === tab
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {children}
  </button>
);

const App: React.FC = () => {
  const [regex, setRegex] = useState<string>('\\d{4}-\\d{2}-\\d{2}');
  const [testString, setTestString] = useState<string>('Today is 2023-10-27, but not 27-10-2023. Another date is 2024-01-01.');
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TESTER);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleFlagChange = (flag: 'g' | 'i' | 'm') => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleRegexUpdateAndSwitch = (newRegex: string) => {
    setRegex(newRegex);
    setActiveTab(Tab.TESTER);
  };

  const handleGenerateTestString = async () => {
    if (!regex) return;
    setIsGeneratingTest(true);
    const result = await generateTestString(regex);
    if (!result.startsWith('Error:')) {
      setTestString(result);
    } else {
      alert(result);
    }
    setIsGeneratingTest(false);
  };

  const handleExportState = () => {
    const state: AppState = { regex, testString, flags };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regex-rocket-session.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    importFileRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const state = JSON.parse(text) as AppState;
        // Basic validation
        if (typeof state.regex === 'string' && typeof state.testString === 'string' && typeof state.flags === 'object') {
          setRegex(state.regex);
          setTestString(state.testString);
          setFlags(state.flags);
        } else {
          alert('Invalid session file format.');
        }
      } catch (error) {
        alert('Failed to read or parse the session file.');
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input to allow re-uploading the same file
  };

  const flagString = Object.entries(flags)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join('');

  const renderContent = () => {
    switch (activeTab) {
      case Tab.AI_HELPER:
        return <AIAssistant onRegexGenerated={handleRegexUpdateAndSwitch} />;
      case Tab.BUILDER:
        return <RegexBuilder regex={regex} setRegex={setRegex} testString={testString} setTestString={setTestString} flags={flagString} />;
      case Tab.LIBRARY:
        return <RegexLibrary onPatternSelect={handleRegexUpdateAndSwitch} />;
      case Tab.TESTER:
        return <RegexTester regex={regex} testString={testString} flags={flagString} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans flex">
      <input type="file" ref={importFileRef} onChange={handleFileImport} accept=".json" style={{ display: 'none' }} />
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 border-r border-gray-700 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
            <Icons.Logo className="h-8 w-8 text-blue-400" />
            <h1 className="text-xl font-bold">Regex Rocket</h1>
        </div>
        <nav className="flex flex-col gap-2 flex-grow">
          <NavItem tab={Tab.BUILDER} activeTab={activeTab} setActiveTab={setActiveTab}><Icons.Builder className="h-5 w-5"/> Builder</NavItem>
          <NavItem tab={Tab.TESTER} activeTab={activeTab} setActiveTab={setActiveTab}><Icons.Tester className="h-5 w-5"/> Tester</NavItem>
          <NavItem tab={Tab.LIBRARY} activeTab={activeTab} setActiveTab={setActiveTab}><Icons.Library className="h-5 w-5"/> Library</NavItem>
          <NavItem tab={Tab.AI_HELPER} activeTab={activeTab} setActiveTab={setActiveTab}><Icons.AIAssistant className="h-5 w-5"/> AI Assistant</NavItem>
        </nav>
        <div className="flex flex-col gap-2 pt-4 border-t border-gray-700">
           <button onClick={handleImportClick} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"><Icons.Import className="h-5 w-5" /> Import State</button>
           <button onClick={handleExportState} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"><Icons.Export className="h-5 w-5" /> Export State</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="p-4 border-b border-gray-700 bg-gray-800/50 flex flex-col gap-4">
          {/* Regex Input */}
          <div>
            <label className="text-sm font-semibold mb-1 text-gray-300 block">Regular Expression</label>
            <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <span className="text-gray-400 pl-3">/</span>
              <input
                type="text"
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                placeholder="Enter your regex"
                className="flex-grow p-3 bg-transparent focus:outline-none font-mono text-lg"
              />
              <span className="text-gray-400 pr-3">/{flagString}</span>
              <div className="flex items-center gap-1.5 pr-3 border-l border-gray-700 ml-2 pl-3">
                {(['g', 'i', 'm'] as const).map((flag) => (
                  <button
                    key={flag}
                    onClick={() => handleFlagChange(flag)}
                    className={`w-8 h-8 rounded text-xs font-mono transition-colors ${flags[flag] ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    title={flag === 'g' ? 'Global search' : flag === 'i' ? 'Case-insensitive' : 'Multiline mode'}
                  >
                    {flag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Test String Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-gray-300">Test String</label>
              <button 
                onClick={handleGenerateTestString} 
                disabled={isGeneratingTest || !regex}
                className="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <Icons.AIAssistant className="h-3 w-3" />
                {isGeneratingTest ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter string to test against"
              className="w-full h-28 p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono"
              spellCheck="false"
            />
          </div>
        </header>

        <div className="flex-grow bg-gray-800 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;