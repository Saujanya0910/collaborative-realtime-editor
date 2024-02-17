import { useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { availableThemes, languageOptions, ACTIONS } from '../utils/constants.js';
import { Select, Space } from 'antd';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const [code, setCode] = useState("// Your initial code here");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [theme, setTheme] = useState(availableThemes[0]);
  // const [readOnly, setReadOnly] = useState(false);

  // Handle UI changes
  /**
   * Handle language selection change
   * @param {string} selectedLanguage 
   */
  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  /**
   * Handle language selection filter on-change
   * @param {string} input 
   * @param {import('../utils/constants.js').LanguageOption} option 
   */
  const filterLanguageOptions = (input, option) => (option?.label || '').toLowerCase().includes(input.toLowerCase());

  /**
   * Handle theme selection change
   * @param {import('../utils/constants.js').ThemeOption} selectedTheme 
   */
  const handleThemeChange = (selectedTheme) => {
    console.log("selectedTheme", selectedTheme);
    setTheme(selectedTheme);
  };

  // /**
  //  * Handle read-only selection change
  //  * @param {Event} event 
  //  */
  // const handleReadOnlyChange = (event) => {
  //   setReadOnly(event.target.checked);
  // };

  /**
   * Handle code change in editor & emit event to room
   * @param {string} value 
   */
  const handleCodeChange = (value) => {
    setCode(value);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: value
    });
    onCodeChange(value);
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
      <div className="editor-options">
        <Space wrap size={'large'}>
          {/* language selection */}
          <Select
            showSearch
            placeholder="Select language"
            defaultValue={languageOptions[0].value}
            optionFilterProp="children"
            onChange={(_, language) => handleLanguageChange(language)}
            filterOption={filterLanguageOptions}
            options={languageOptions}
          />
          {/* theme selection */}
          <Select
            placeholder="Select theme"
            defaultValue={availableThemes[0].value}
            onChange={(_, theme) => handleThemeChange(theme)}
            options={availableThemes}
          />
        </Space>
        {/* read-only selection */}
        {/* <div>
          <label>
            Read-Only:
            <input type="checkbox" checked={readOnly} onChange={handleReadOnlyChange} />
          </label>
        </div> */}
      </div>
      <div className="CodeEditor">
        <MonacoEditor
          height="500px"
          language={language.value}
          theme={theme.value}
          value={code}
          onChange={handleCodeChange}
          options={{
            // readOnly: readOnly,
            minimap: { enabled: false },
            selectOnLineNumbers: true,
            acceptSuggestionOnEnter: 'on',
            autoClosingBrackets: 'always',
            cursorBlinking: 'blink',
            autoClosingQuotes: 'always'
          }}
        />
      </div>
    </div>
  );
};

export default Editor;