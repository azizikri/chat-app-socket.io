import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { List, ListItem, ListItemText } from '@mui/material';
import Input from './components/Input';
import ButtonComponent from './components/ButtonComponent';
import './App.css'

function App() {
  const socket = io.connect(import.meta.env.VITE_SERVER_URL || 'http://localhost:3031')
  // const [socket, setSocket] = useState(io.connect(import.meta.env.VITE_SERVER_URL))
  const username = '#' + Math.floor(Math.random() * 16777215).toString(16);

  const storedUsername = localStorage.getItem('username');

  if (storedUsername == null) {
    localStorage.setItem('username', username);
  }

  const [room, setRoom] = useState('');
  const [roomJoined, setRoomJoined] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');


  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const joinRoom = () => {
    if (room !== '' && room !== currentRoom) {
      socket.emit('join_room', room);
      setCurrentRoom(room)
      setRoomJoined(true);
      setMessages([]);
    }
  };

  const sendMessage = () => {
    socket.emit('send_message', { message, room, username: storedUsername });
  };

  useEffect(() => {
    socket.on('received_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, [socket]);

  return (
    <div className='App'>
      <div>
        <Input label="Join Room..." value={room} onChange={(e) => setRoom(e.target.value)} />
        <ButtonComponent text="Join Room" onClick={joinRoom} />
      </div>

      {roomJoined && (
        <>
          <div className="">
            <Input label="Message..." value={message} onChange={(e) => setMessage(e.target.value)} />
            <ButtonComponent text="Send Message" onClick={sendMessage} />
          </div>
          <h1 style={{ margin: '10px' }}>Messages:</h1>
          {/* <h2 style={{ margin: '10px' }}>{room}:</h2> */}
          <List>
            {messages.map((message, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={message.message}
                  secondary={`user ${message.username}`}
                  style={{ fontFamily: 'Arial', fontSize: '16px' }}
                  className={message.username === storedUsername ? 'my-message' : 'other-message'}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </div>
  );
}

export default App;
