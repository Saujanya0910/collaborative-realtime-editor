import axios from 'axios';
import { encryptData } from './utils/helpers';

/**
 * Submit code to backend for compilation & execution
 * @param {{ language_id: number, source_code: string, stdin?: string }} payload 
 */
export const submitCodeForEvaluation = async function ({ language_id, source_code, stdin }) {
  const requestPayload = {
    language_id,
    source_code: encryptData(source_code),
    stdin: stdin ? encryptData(stdin) : null
  }

  return await axios.request({
    method: 'POST',
    url: import.meta.env.VITE_REACT_APP_BACKEND_URL + '/code/submit',
    data: requestPayload
  })
}