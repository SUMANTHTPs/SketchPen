import React from 'react';
import './App.css';
import DrawingCanvas from './components/DrawingCanvas';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <DrawingCanvas />
    </div>
  );
}

export default App;
