import React from 'react';
import './App.css';
import DrawingCanvas from './components/DrawingCanvas';
import Navbar from './components/Navbar';
import { DrawingContextProvider } from './context/drawingContext';
import Footer from './components/Footer';

function App() {
  return (
    <DrawingContextProvider>
      <Navbar />
      <DrawingCanvas />
      <Footer />
    </DrawingContextProvider>
  );
}

export default App;
