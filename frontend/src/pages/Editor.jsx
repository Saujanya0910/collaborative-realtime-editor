import { useState } from "react"
import Client from "../components/Client";
import CodeEditor from "../components/Editor";

/**
 * @typedef EachClient
 * @property {string | number} socketId
 * @property {string} username
 */

const Editor = () => {
  const [clients, setClients] = useState([
    { socketId: 1, username: 'Saujanya P' },
    { socketId: 2, username: 'Leo M' },
    { socketId: 3, username: 'Crissy Naldo' },
    { socketId: 4, username: 'MoNeymar Jr' }
  ])
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