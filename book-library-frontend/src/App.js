import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [bookTitle, setBookTitle] = useState('');
//test

  const addBook = async () => {
    await axios.post('https://vhrsabxky8.execute-api.us-east-1.amazonaws.com/prod', {
      userID: '12345',
      bookID: '67890',
      title: bookTitle 
    }); 
  };

  return (
    <div>
      <h1>Book Library</h1>
      <input type="text" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder='Enter Book Title' />
      <button onClick={addBook}>Add Book</button>
    </div>
  );
}

export default App;
