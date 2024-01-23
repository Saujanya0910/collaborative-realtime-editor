import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

const topLanguages = [
  'javascript',
  'python',
  'java',
  'typescript',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'swift',
  'go'
];
const availableThemes = [
  'vs-dark',
  'vs-light',
  'hc-black' // High contrast theme, add more as needed
];

const Editor = () => {
  const [code, setCode] = useState("// Your initial code here");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState('vs-dark');
  const [readOnly, setReadOnly] = useState(false);
  const [colorizeBracketPair, setColorizeBracketPair] = useState(false);

  // Handle UI changes
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleReadOnlyChange = (event) => {
    setReadOnly(event.target.checked);
  };

  const handleColorizeBracketPairChange = (event) => {
    setColorizeBracketPair(event.target.checked);
  };

  return (
    // <div className="container">
    <div className="">
      <div>
        <label>
          Language:
          <select value={language} onChange={handleLanguageChange}>
            {topLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Theme:
          <select value={theme} onChange={handleThemeChange}>
            {availableThemes.map((availableTheme) => (
              <option key={availableTheme} value={availableTheme}>
                {availableTheme}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Read-Only:
          <input type="checkbox" checked={readOnly} onChange={handleReadOnlyChange} />
        </label>
      </div>
      <div>
        <label>
          Colorize bracket-pairs:
          <input type="checkbox" checked={colorizeBracketPair} onChange={handleColorizeBracketPairChange} />
        </label>
      </div>
      <div className="CodeEditor">
        <MonacoEditor
          height="500px"
          language={language}
          theme={theme}
          value={code}
          options={{
            readOnly: readOnly,
            minimap: { enabled: false },
            selectOnLineNumbers: true,
            acceptSuggestionOnEnter: 'on',
            autoClosingBrackets: 'always',
            cursorBlinking: 'blink',
            autoClosingQuotes: 'always',
            bracketPairColorization: colorizeBracketPair
          }}
        />
      </div>
    </div>
  );
};

export default Editor;