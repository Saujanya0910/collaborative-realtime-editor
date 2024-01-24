import { useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import ACTIONS from "../../Actions.js";

/**
 * Configurable languages available for the editor
 */
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
/**
 * Configurable themes available for the editor
 */
const availableThemes = [
  'vs-dark',
  'vs-light',
  'hc-black'
];

const Editor = ({ socketRef, roomId }) => {
  const [code, setCode] = useState("// Your initial code here");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState('vs-dark');
  const [readOnly, setReadOnly] = useState(false);
  const [colorizeBracketPair, setColorizeBracketPair] = useState(false);

  // Handle UI changes
  /**
   * Handle language selection change
   * @param {Event} event 
   */
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  /**
   * Handle theme selection change
   * @param {Event} event 
   */
  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  /**
   * Handle read-only selection change
   * @param {Event} event 
   */
  const handleReadOnlyChange = (event) => {
    setReadOnly(event.target.checked);
  };

  /**
   * Handle bracket-pair-colorization selection change
   * @param {Event} event 
   */
  const handleColorizeBracketPairChange = (event) => {
    setColorizeBracketPair(event.target.checked);
  };

  /**
   * Handle code change in editor & emit event to room
   * @param {string} value 
   */
  const handleCodeChange = (value) => {
    setCode(value);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: value
    })
  }

  useEffect(() => {
    // listen to CODE-CHANGE event from server
    if(socketRef && socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code: receivedCode }) => {
        if(receivedCode !== null) {
          setCode(() => receivedCode);
        }
      });
    }

    // cleanup
    return () => {
      // unsubscribe from all listeners
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
  }, [socketRef.current])

  return (
    // <div className="container">
    <div className="">
      {/* language selection */}
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
      {/* theme selection */}
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
      {/* read-only selection */}
      <div>
        <label>
          Read-Only:
          <input type="checkbox" checked={readOnly} onChange={handleReadOnlyChange} />
        </label>
      </div>
      {/* bracket pair colorization selection */}
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
          onChange={handleCodeChange}
          options={{
            readOnly: readOnly,
            minimap: { enabled: false },
            selectOnLineNumbers: true,
            acceptSuggestionOnEnter: 'on',
            autoClosingBrackets: 'always',
            cursorBlinking: 'blink',
            autoClosingQuotes: 'always',
            bracketPairColorization: {
              enabled: colorizeBracketPair
            }
          }}
        />
      </div>
    </div>
  );
};

export default Editor;