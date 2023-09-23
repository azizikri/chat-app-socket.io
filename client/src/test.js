import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import './App.css'

function App() {
  const username = '#' + Math.floor(Math.random() * 16777215).toString(16);

  const storedUsername = localStorage.getItem('username');

  if (!storedUsername) {
    localStorage.setItem('username', username);
  }

  // Get the username from browser localStorage

  // If the username is stored in browser localStorage, use that username. Otherwise, prompt the user to enter their username.
  const socket = io.connect(import.meta.env.VITE_SERVER_URL);

  const [room, setRoom] = useState('');
  const [roomJoined, setRoomJoined] = useState(false);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', {room, storedUsername});
      setRoomJoined(true);
    }
  };

  const sendMessage = () => {
    socket.emit('send_message', { message, room, storedUsername });
    console.log(`${storedUsername}: ${message}`);

  };

  useEffect(() => {
    socket.on('received_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, [socket]);

  return (
    <div className="App">
    <TextField
      type="text"
      placeholder="Join Room..."
      onChange={e => setRoom(e.target.value)}
      style={{ padding: '10px', margin: '10px' }}
    />
    <Button onClick={joinRoom} style={{ margin: '10px' }}>Join Room</Button>

    {roomJoined && (
      <>
        <TextField
          type="text"
          placeholder="Message..."
          onChange={e => setMessage(e.target.value)}
          style={{ padding: '10px', margin: '10px' }}
        />
        <Button onClick={sendMessage} style={{ margin: '10px' }} >Send Message</Button>
        <h1 style={{ margin: '10px' }}>Messages:</h1>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={message.message}
                // secondary={message.username}
                style={{ fontFamily: 'Arial', fontSize: '16px' }}
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
