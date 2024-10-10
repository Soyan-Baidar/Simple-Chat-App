import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]); 
  const [hasJoined, setHasJoined] = useState(false); 
  const [name, setName] = useState(''); 
  const [room, setRoom] = useState(''); 

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    const handleChat = (msg) => {
      setMessages((prevMessages) => [...prevMessages, { name: msg.name, message: msg.message }]);
    };

    newSocket.on('chat', handleChat);

    return () => {
      newSocket.off('chat', handleChat);
      newSocket.disconnect();
    };
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    const userName = e.target.name.value.trim();
    const roomName = e.target.room.value.trim();

    if (userName && roomName) {
      setName(userName); 
      setRoom(roomName); 
      socket.emit('joinRoom', { room: roomName, name: userName });
      setHasJoined(true);
      e.target.reset();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = e.target.message.value.trim();

    if (message) {
      socket.emit('chat', { room, name, message });
      e.target.reset(); 
    }
  };

  return (
    <div className="chat-container">
      {!hasJoined ? (
        <form onSubmit={handleJoin} className="chat-form">
          <input 
            type="text" 
            name="name" 
            className="chat-input" 
            placeholder="Type your name..." 
            required 
          />
          <input 
            type="text" 
            name="room" 
            className="chat-input" 
            placeholder="Type your group..." 
            required 
          />
          <button type="submit" className="chat-submit">
            Join
          </button>
        </form>
      ) : (
        <form onSubmit={handleSendMessage} className="chat-form">
          <input 
            type="text" 
            name="message" 
            className="chat-input" 
            placeholder="Type your message..." 
            required 
          />
          <button type="submit" className="chat-submit">
            Send
          </button>
        </form>
      )}
      <ul className="chat-messages">
        {messages.map((msg, index) => (
          <li key={index} className="chat-message">
            <b><i>{msg.name}</i></b>: {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
