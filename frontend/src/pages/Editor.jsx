import { useEffect, useRef, useState } from "react"
import { useLocation, useParams, useNavigate, Navigate } from "react-router-dom";
import { initSocket } from "../../../backend/socket";
import Client from "../components/Client";
import CodeEditor from "../components/Editor";
import toast from 'react-hot-toast';
import * as ACTIONS from '../Actions';

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
  
  useEffect(() => {
    const init = async () => {
      const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
      console.log("backendUrl", backendUrl);
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
      })
    }
    init();
  }, [location.state?.username, navigator, roomId]);

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

          <button className="btn copyBtn">Copy <i>Room ID</i></button>
          <button className="btn leaveBtn">Leave</button>
        </div>

        <div className="editorSection">
          <CodeEditor />
        </div>
      </div>
    </div>
  )
}

export default Editor