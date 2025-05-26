import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [title, setBookTitle] = useState('');
  const [loanerName, setLoanerName] = useState('');
  const [loanDate, setLoanDate] = useState('');

  const handleSubmit = async () => {
    const data = {
      email,
      title, 
      loanerName,
      loanDate,
    };
    

    try {
      await axios.post('https://vhrsabxky8.execute-api.us-east-1.amazonaws.com/prod/books', data);
      alert('Book saved successfully!');
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Failed to save book.');
    }
  };

  return (
    <div>
      <h1>Book Tracker</h1>

      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Book Title"
        value={bookTitle}
        onChange={(e) => setBookTitle(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Loaner Name"
        value={loanerName}
        onChange={(e) => setLoanerName(e.target.value)}
      />
      <br />

      <input
        type="date"
        value={loanDate}
        onChange={(e) => setLoanDate(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default App;
