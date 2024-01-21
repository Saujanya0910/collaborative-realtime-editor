import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigator = useNavigate();

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  /**
   * Create new room
   * @param {Event} e 
   */
  const createNewRoom = (e) => {
    e.preventDefault();

    const newRoomId = uuidV4();
    setRoomId(newRoomId);

    toast.success('Created a new room');
  }

  /**
   * 
   * @param {Event} e 
   */
  const handleSubmitOnEnter = (e) => {
    e.preventDefault();
    if(e.code !== 'Enter') return;

    joinRoom();
  }

  /**
   * Join new room
   */
  const joinRoom = () => {
    if(!(roomId && username)) return toast.error('Room ID and username is required!');

    navigator(`/editor/${roomId}`, { state: { username } })
  }

  return (
    <div className="homepageWrapper">
      <div className="formWrapper">
        {/* TODO update */}
        <div className="logo">
          <span>Real-time Collaborative <br /> Code Editor</span>
        </div>
        <h4 className="mainLabel">Paste the <i>Room ID</i> from your invitation</h4>
        <div className="inputGroup">
          <input 
            type="text" 
            className="inputBox" 
            placeholder="Room ID" 
            value={roomId} 
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleSubmitOnEnter}
          />
          <input 
            type="text" 
            className="inputBox" 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleSubmitOnEnter}
          />
          <button 
            className="btn joinBtn"
            onClick={joinRoom}
          >
            Join
          </button>
          <span className="createInfo">
            If you don't have an invite, then create a &nbsp;
            <a href="" className="createNewBtn" onClick={createNewRoom}>new room</a>
          </span>
        </div>
      </div>

      <footer>
        <h4>Built with 💛 by <a href="https://github.com/Saujanya0910">Saujanya</a></h4>
      </footer>
    </div>
  )
}

export default Home