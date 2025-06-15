// src/App.js
import React from 'react';
import AuthForm from './components/AuthForm';

function App() {
  console.log("✅ App component loaded");
  return (
    <div className="App">
      <AuthForm />
    </div>
  );
}

export default App;
