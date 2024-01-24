const { ACTIONS } = require('./Actions.js');

/**
 * Handler for all socket related operations
 * @param {import('socket.io').Server} io 
 */
module.exports = function (io) {

  /**
   * Store **in-memory** mapping of socket-id to username
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
  
    // listen to join event of current socket
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

    // listen to code-change event of current socket
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code }); // emit code-change event to all other sockets in the read
    });

    // listen to event triggered just before current socket is disconnected
    socket.on('disconnecting', () => {
      const allRoomsOfCurrentSocket = Array.from(socket.rooms);
      allRoomsOfCurrentSocket.forEach((roomId) => {
        // broadcast disconnected event from current socket to all other sockets in each room
        socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          username: userSocketMapping[socket.id]
        });

        // socket.leave(roomId);
      });
      delete userSocketMapping[socket.id];

      socket.leave();
    });
  });
}