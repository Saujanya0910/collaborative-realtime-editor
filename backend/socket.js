import { io } from 'socket.io-client';

export const initSocket = async function (backendUrl) {

  const options = {
    'force new connection': true,
    reconnectionAttempts: 'Infinity', 
    timeout: 10000, 
    transports: ['websocket']
  };

  return io(backendUrl || 'http://localhost:3001', options);
}