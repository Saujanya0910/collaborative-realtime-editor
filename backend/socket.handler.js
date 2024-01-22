const ACTIONS = require('../shared/Actions');

/**
 * Handler for all socket related operations
 * @param {import('socket.io').Server} io 
 */
module.exports = function (io) {

  /**
   * Store socket-id to username mapping in-memory
   * @type {{ [string]: string }}
   */
  const userSocketMapping = {};

  /**
   * Get all socket clients connected to specific room
   * @param {string} roomId 
   */
  function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
			(clientSocketId) => ({
				socketId: clientSocketId,
				username: userSocketMapping[clientSocketId],
			})
		);
  }

  io.on('connection', (socket) => {
    console.log("Socket connected: ", socket.id);
  
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
      userSocketMapping[socket.id] = username; // store socketid to username mapping
      socket.join(roomId);  // make socketid join the room
  
      const connectedClients = getAllConnectedClients(roomId);
      // notify all other connected clients about new joinee
      connectedClients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          connectedClients,
          username,
          socketId: socket.id
        });
      })
    });
  });
}