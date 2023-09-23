import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import './App.css'

function App() {
  const socket = io.connect(import.meta.env.VITE_SERVER_URL)
  // const [socket, setSocket] = useState(io.connect(import.meta.env.VITE_SERVER_URL))
  const username = '#' + Math.floor(Math.random() * 16777215).toString(16);

  const storedUsername = localStorage.getItem('username');

  if (storedUsername == null) {
    localStorage.setItem('username', username);
  }

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
    socket.emit('send_message', { message, room, username: storedUsername });
  };

  useEffect(() => {
    socket.on('received_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Disconnect from the socket when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className='App'>
      <div>
        <TextField
          type="text"
          placeholder="Join Room..."
          onChange={e => setRoom(e.target.value)}
          size='small'
          style={{ marginRight: '1vh', marginBottom: '1vh' }}
        />
        <Button onClick={joinRoom} size='medium' variant='contained'>Join Room</Button>
      </div>

      {roomJoined && (
        <>
          <div className="">
            <TextField
              type="text"
              placeholder="Message..."
              onChange={e => setMessage(e.target.value)}
              size='small'
              style={{ marginRight: '1vh', marginBottom: '1vh' }}
            />
            <Button onClick={sendMessage} size='medium' variant='contained'>Send Message</Button>
          </div>
          <h1 style={{ margin: '10px' }}>Messages:</h1>
          {/* <h2 style={{ margin: '10px' }}>{room}:</h2> */}
          <List>
            {messages.map((message, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={message.message}
                  secondary={message.username}
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
