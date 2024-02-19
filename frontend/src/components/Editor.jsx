import { useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { availableThemes, languageOptions, ACTIONS } from '../utils/constants.js';
import { Select, Space, Row, Col, Input, Button } from 'antd';
import { submitCodeForEvaluation } from '../service.js';
import toast from 'react-hot-toast';
const { TextArea } = Input

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const [code, setCode] = useState("// Your initial code here");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [theme, setTheme] = useState(availableThemes[0]);
  const [customInput, setCustomInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompilationAllowed, setIsCompilationAllowed] = useState(false);
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

  /**
   * Compile code in current state of the editor
   */
  const handleCodeCompile = async () => {
    setIsLoading(true);

    await toast.promise(
      submitCodeForEvaluation({ language_id: language.id, source_code: code, stdin: customInput }),
      {
        loading: 'Running code compilation ⏳',
        success: ({ data: submissionResp }) => {
          if(submissionResp && submissionResp.status === 'success') {
            setIsLoading(false);
            const codeSubmissionOutput = submissionResp.data;
            return 'Compilation successful!';
          }
          return 'Compilation complete!'
        },
        error: (err) => {
          setIsLoading(false);
          console.log("err", err);
          return 'Code compilation & execution failed';
        },
        duration: { loading: 1500, success: 2000, error: 3000 }
      }
    );
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
  }, [socketRef.current]);

  useEffect(() => {
    if(code && code !== '// Your initial code here') {
      setIsCompilationAllowed(true);
    } else {
      setIsCompilationAllowed(false);
    }
  }, [code]);

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
      <div>
        <Row gutter={[40, 16]} style={{marginRight: 0}}>
          {/* editor section */}
          <Col md={14}>
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
                  autoClosingQuotes: 'always',
                  wordWrap: 'on'
                }}
              />
            </div>
          </Col>

          {/* execution section */}
          <Col md={9}>
            <div className='CodeOutput'>
              <h2>Output</h2>
              <div className="outputWindow"></div>
              <div className="customInput">
                <TextArea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Custom input"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </div>
              <Button 
                size="large" 
                loading={isLoading}
                disabled={!isCompilationAllowed}
                onClick={handleCodeCompile}
                style={{float: 'right'}}
              >
                Compile & Execute
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Editor;