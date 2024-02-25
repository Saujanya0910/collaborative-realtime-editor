import { useEffect, useRef, useState } from "react"
import { useLocation, useParams, useNavigate, Navigate } from "react-router-dom";
import { initSocket } from "../../Socket";
import Client from "../components/Client";
import CodeEditor from "../components/Editor";
import toast from 'react-hot-toast';
import { ACTIONS } from "../utils/constants";
import { getFromLocalStorage, removeFromLocalStorage } from "../service";

/**
 * @typedef EachClient
 * @property {string | number} socketId
 * @property {string} username
 */

const Editor = () => {
  const location = useLocation();
  const { roomId } = useParams();

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  
  const navigator = useNavigate();
  
  const [clients, setClients] = useState([]);

  /**
   * Handler for copy room-id action
   */
  const copyRoomId = async () => {
    try {
      await window.navigator.clipboard.writeText(roomId);
      toast.success(`Room ID copied to your clipboard`);
    } catch (err) {
      toast.error('Oops! Something went wrong')
    }
  }

  /**
   * Handler for leave room action
   */
  const leaveRoom = () => {
    toast.success(`Leaving the current room...`);
    // clear all states
    removeFromLocalStorage('code');
    removeFromLocalStorage('language');
    removeFromLocalStorage('theme');
    removeFromLocalStorage('roomId');

    setTimeout(() => navigator('/'), 500);
  }
  
  useEffect(() => {
    const init = async () => {
      const savedRoomId = getFromLocalStorage('roomId');
      if(savedRoomId !== roomId) { // if user joined new room
        // clear all states
        removeFromLocalStorage('roomId');
        removeFromLocalStorage('code');
        removeFromLocalStorage('language');
        removeFromLocalStorage('theme');
      }
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

      // emit JOIN event to the room
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username
      });

      // listen to JOINED event
      socketRef.current.on(ACTIONS.JOINED, ({ connectedClients, socketId: joinedSocketId, username }) => {
        if(username !== location.state?.username) {
          console.log(`${username} joined`);
          toast.success(`${username} joined the room!`);
        }

        setClients(connectedClients);

        // emit sync code event to update code for newly joined socket
        socketRef.current.emit(ACTIONS.SYNC_CODE, { socketId: joinedSocketId, code: codeRef.current })
      });

      // listen to DISCONNECTED event
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId: disconnectedSocket, username }) => {
        toast.success(`${username} left the room!`);
        setClients((allConnectedClients) => allConnectedClients.filter(client => client.socketId !== disconnectedSocket));
      });
    }
    init();

    // cleanup
    return () => {
      // unsubscribe from all listeners & disconnect the socket
      socketRef.current.disconnect();

      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }
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
          <CodeEditor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => codeRef.current = code}/>
        </div>
      </div>
    </div>
  )
}

export default Editor