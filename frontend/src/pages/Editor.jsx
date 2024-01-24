import { useEffect, useRef, useState } from "react"
import { useLocation, useParams, useNavigate, Navigate } from "react-router-dom";
import { initSocket } from "../../../backend/socket";
import Client from "../components/Client";
import CodeEditor from "../components/Editor";
import toast from 'react-hot-toast';
import ACTIONS from "../../Actions.js";

/**
 * @typedef EachClient
 * @property {string | number} socketId
 * @property {string} username
 */

const Editor = () => {
  const location = useLocation();
  const socketRef = useRef(null);
  const { roomId } = useParams();
  const navigator = useNavigate();
  
  const [clients, setClients] = useState([
    // { socketId: 1, username: 'Saujanya P' },
    // { socketId: 2, username: 'Leo M' },
    // { socketId: 3, username: 'Crissy Naldo' },
    // { socketId: 4, username: 'MoNeymar Jr' }
  ]);

  const copyRoomId = () => {
    window.navigator.clipboard.writeText(roomId);
    toast.success(`Room ID copied to clipboard`);
  }

  const leaveRoom = () => {
    toast.success(`Leaving the current room...`);
    return; // TODO
    setTimeout(() => navigator('/'), 1500);
  }
  
  useEffect(() => {
    const init = async () => {
      const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
      socketRef.current = await initSocket(backendUrl);

      // listen to any socket error errors encountered
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      /**
       * Handle socket errors
       * @param {*} err 
       */
      function handleErrors(err) {
        console.log("socket error", err);
        toast.error('Socket connection failed, try again later');
        navigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username
      });

      // listen to JOINED event
      socketRef.current.on(ACTIONS.JOINED, ({ connectedClients, username }) => {
        setClients(connectedClients);

        if(username !== location.state?.username) {
          console.log(`${username} joined`);
          toast.success(`${username} joined the room!`);
        }
      });

      // listen to DISCONNECTED event
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId: disconnectedSocket, username }) => {
        toast.success(`${username} left the room!`);
        setClients((allConnectedClients) => allConnectedClients.filter(client => client.socketId === disconnectedSocket));
      });

      // cleanup
      return () => {
        // unsubscribe from all listeners & disconnect the socket
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);

        socketRef.current.disconnect();
      }
    }
    init();
  }, []);

  if(!location.state) {
    return <Navigate to="/"></Navigate>
  }

  return (
    <div>
      <div className="mainWrapper">
        <div className="sidebarWrapper">
          <div className="sidebar">
            {/* TODO update */}
            <div className="logo">
              <span>Real-time Collaborative <br /> Code Editor</span>
            </div>

            <h3>Connected</h3>

            <div className="clientsList">
              {
                clients.map(({ socketId, username }) => <Client key={socketId} username={username} />)
              }
            </div>
          </div>

          <button className="btn copyBtn" onClick={copyRoomId}>Copy <i>Room ID</i></button>
          <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
        </div>

        <div className="editorSection">
          <CodeEditor socketRef={socketRef} roomId={roomId} />
        </div>
      </div>
    </div>
  )
}

export default Editor