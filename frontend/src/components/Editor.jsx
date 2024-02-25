import { useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { availableThemes, languageOptions, ACTIONS } from '../utils/constants.js';
import { Select, Space, Row, Col, Input, Button, Flex } from 'antd';
import { getFromLocalStorage, setInLocalStorage, submitCodeForEvaluation } from '../service.js';
import toast from 'react-hot-toast';
import { Buffer } from 'buffer'
const { TextArea } = Input

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const [code, setCode] = useState("// Your initial code here");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [theme, setTheme] = useState(availableThemes[0]);
  const [customInput, setCustomInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompilationAllowed, setIsCompilationAllowed] = useState(false);
  const [outputDetails, setOutputDetails] = useState(null);
  // const [readOnly, setReadOnly] = useState(false);

  // Handle UI changes
  /**
   * Handle language selection change
   * @param {import('../utils/constants.js').LanguageOption} selectedLanguage 
   */
  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setInLocalStorage('language', JSON.stringify(selectedLanguage));
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
    setInLocalStorage('theme', JSON.stringify(selectedTheme));
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
    if(value && (value !== '// Your initial code here')) setInLocalStorage('code', value);
    onCodeChange(value);
  }

  /**
   * Compile code in current state of the editor
   * @param {string} existingRequestToken Token to be sent back to backend to recheck status of existing request
   */
  const handleCodeCompile = async (existingRequestToken = null) => {
    setIsLoading(true);
    setIsCompilationAllowed(false);

    const payload = { language_id: language.id, source_code: code, stdin: customInput };
    if(existingRequestToken) {
      payload['token'] = existingRequestToken;
    };

    await toast.promise(
      submitCodeForEvaluation(payload),
      {
        loading: 'Processing ⏳',
        success: (apiResponse) => {
          const submissionResp = apiResponse?.data;
          if(submissionResp && submissionResp.status === 'success') {
            const submissionOutput = submissionResp?.data;
            const statusId = submissionOutput?.status?.id;
            if (statusId === 1 || statusId === 2) {
              // still processing
              setTimeout(() => {
                handleCodeCompile(submissionOutput?.token);
              }, 2000)
              return 'Processing ⏳';
            } else {
              setIsLoading(false);
              setOutputDetails({ ...submissionOutput, token: null });
              setIsCompilationAllowed(true);
              return 'Compilation successful!';
            }
          } else {
            throw 'Something went wrong';
          }
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

  /**
   * Generate UI changes based on code execution results
   */
  const getCodeExecutionResult = () => {
    const statusId = outputDetails?.status?.id;
    if (statusId === 6) {
      const compilationErr = atob(outputDetails?.compile_output);
      // compilation error
      return (
        <pre className="text-red-500">
          {compilationErr ? `${compilationErr}` : null}
        </pre>
      );
    } else if (statusId === 3) {
      const output = atob(outputDetails.stdout);
      return (
        <pre className="text-green-500">
          {output !== null ? `${output}` : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="text-red-500">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      const stdErr = atob(outputDetails?.stderr);
      return (
        <pre className="text-red-500">
          {stdErr ? `${stdErr}` : null}
        </pre>
      );
    }
  }

  useEffect(() => {
    // manage state
    const savedCode = getFromLocalStorage('code');
    if(savedCode) {
      setCode(savedCode);
    };
    
    try {
      const savedLanguage = getFromLocalStorage('language');
      if(savedLanguage) {
        setLanguage(JSON.parse(savedLanguage));
      };
    } catch (error) {}
    
    try {
      const savedTheme = getFromLocalStorage('theme');
      if(savedTheme) {
        setTheme(JSON.parse(savedTheme));
      };
    } catch (error) {}
  }, []);

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
            value={language.value}
            style={{width: '220px'}}
            optionFilterProp="children"
            onChange={(_, language) => handleLanguageChange(language)}
            filterOption={filterLanguageOptions}
            options={languageOptions}
          />
          {/* theme selection */}
          <Select
            placeholder="Select theme"
            value={theme.value}
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
              <Flex className="outputTopBar" justify={'space-between'} align={'center'}>
                <h2>Output</h2>
                <Button
                  size="large"
                  loading={isLoading}
                  disabled={!isCompilationAllowed}
                  onClick={() => handleCodeCompile(null)}
                  style={{float: 'right'}}
                >
                  Compile & Execute
                </Button>
              </Flex>
              <div className="outputWindow">
                <>{outputDetails ? getCodeExecutionResult() : null}</>
              </div>
              <div className="customInput">
                <TextArea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Custom input"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </div>
              <div className="outputDetails">
                {outputDetails && 
                  <>
                    <p className="">
                      Status:{" "}
                      <span className="">
                        {outputDetails?.status?.description}
                      </span>
                    </p>
                    <p className="">
                      Memory:{" "}
                      <span className="">
                        {outputDetails?.memory}
                      </span>
                    </p>
                    <p className="">
                      Time:{" "}
                      <span className="">
                        {outputDetails?.time}
                      </span>
                    </p>
                  </>
                }
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Editor;