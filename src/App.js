import React from 'react';
import './App.css';
import DrawingCanvas from './components/DrawingCanvas';
import Navbar from './components/Navbar';
import { DrawingContextProvider } from './context/drawingContext';

function App() {
  return (
    <DrawingContextProvider>
      <Navbar />
      <DrawingCanvas />
    </DrawingContextProvider>
  );
}

export default App;
