const { decryptData } = require('../helpers/helper');
const axios = require('axios');

require('dotenv').config();

/**
 * Compile & execute submitted code
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports.codeSubmissionHandler = async function (req, res) {
  try {
    if(!(req.body && Object.entries(req.body).filter(Boolean).length)) return res.status(400).json({ status: 'failure', message: 'Invalid parameters - payload' });
  
    /**
     * @type {{ language_id: number, source_code: string, stdin?: string }}
     */
    const { language_id, source_code: sourceCodeFromPayload, stdin: stdinFromPayload } = req.body;
  
    const sourceCodeDecrypted = decryptData(sourceCodeFromPayload);
    const stdinDecrypted = decryptData(stdinFromPayload);
  
    const apiHost = process.env.RAPID_API_HOST;
    const apiUrl = process.env.RAPID_API_URL;
    const apiKey = process.env.RAPID_API_KEY;

    // first req to get token
    const { data: tokenResponse } = await axios.default.request({
      method: 'POST',
      url: apiUrl,
      params: { base_encoded: "true", fields: '*' },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": apiHost,
        "X-RapidAPI-Key": apiKey
      },
      data: {
        language_id,
        source_code: new Buffer(sourceCodeDecrypted).toString('base64'),
        stdin: new Buffer(stdinDecrypted).toString('base64')
      }
    });
    const apiTokenForSubmissionReq = tokenResponse.token;

    // second token to perform code submission
    const submissionResponse = await axios.default.request({
      method: "GET",
      url: apiUrl + "/" + apiTokenForSubmissionReq,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": apiHost,
        "X-RapidAPI-Key": apiKey,
      }
    });
    delete submissionResponse.data['token'];
    return res.status(200).json({ status: 'success', message: 'Compile & execute completed', data: submissionResponse.data });

  } catch (err) {
    return res.status(500).json({ status: 'failure', message: 'Internal server error', err: err.message });
  }
}