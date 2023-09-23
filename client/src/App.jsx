import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import './App.css'

function App() {
  const socket = io.connect(import.meta.env.VITE_SERVER_URL)

  const [room, setRoom] = useState('');
  const [roomJoined, setRoomJoined] = useState(false);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', room);
      setRoomJoined(true);
    }
  };

  const sendMessage = () => {
    socket.emit('send_message', { message, room, socketId: socket.id });
  };

  useEffect(() => {
    socket.on('received_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, [socket]);

  return (
    <>
      <input
        type="text"
        placeholder="Join Room..."
        onChange={e => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>

      {roomJoined && (
        <>
          <input
            type="text"
            placeholder="Message..."
            onChange={e => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send Message</button>
          <h1>Messages:</h1>
          {messages.map((message, index) => (
            <p key={index}>
              {message.message} ({message.socketId})
            </p>
          ))}
        </>
      )}
    </>
  );
}

export default App;
