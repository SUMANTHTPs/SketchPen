import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";
import { ReactComponent as DownloadIcon } from "../icons/download.svg";
import { ReactComponent as RefreshIcon } from "../icons/refresh.svg";
import { ReactComponent as ExportIcon } from "../icons/export.svg";
import { ReactComponent as ImportIcon } from "../icons/import.svg";

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(1);
  const [toggle, setToggle] = useState(false);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth * 0.96;
    canvas.height = window.innerHeight * 0.85;
    setContext(ctx);
  }, []);

  const startDrawing = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    context.beginPath();
    context.lineWidth = penSize;
    context.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const draw = (event) => {
    if (!drawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    // Set the composite operation
    context.globalCompositeOperation = erasing
      ? "destination-out"
      : "source-over";
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    context.closePath();
    setDrawing(false);
    // Reset the composite operation to default
    context.globalCompositeOperation = "source-over";
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setBackgroundColor("#ffffff");
  };

  const handleBackgroundColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    // Create a temporary canvas to draw the background color
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.fillStyle = backgroundColor;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    // Draw the original canvas content onto the temporary canvas
    tempCtx.drawImage(canvas, 0, 0);
    // Convert the temporary canvas to a data URL and initiate download
    const image = tempCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "drawing.png";
    link.click();
  };

  const handlePenSize = (e) => {
    setPenSize(e.target.value);
  };

  const saveToLocalStorage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL(); // Convert canvas content to a data URL
    const storedData = {
      dataURL,
      backgroundColor,
    };
    localStorage.setItem("savedDrawingData", JSON.stringify(storedData));
  };
  const loadFromLocalStorage = () => {
    const savedDrawingData = localStorage.getItem("savedDrawingData"); 
    if (savedDrawingData) {
      const { dataURL, backgroundColor } = JSON.parse(savedDrawingData);
      // Set the background color
      setBackgroundColor(backgroundColor);
      // Clear the canvas and fill it with the new background color
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      const image = new Image();
      // Draw the saved image onto the canvas
      image.onload = () => {
        context.drawImage(image, 0, 0);
      };
      image.src = dataURL;
    }
  };

  return (
    <div className={erasing ? "container rubber-cursor" : "container"}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        style={{
          border: ".1px solid lightgrey",
          backgroundColor,
          borderRadius: "16px",
        }}
        onClick={() => setToggle(false)}
      ></canvas>
      <div className="options">
        <div>
          {toggle && (
            <SketchPicker
              color={penColor}
              onChange={(color) => {
                setPenColor(color.hex);
                context.strokeStyle = color.hex;
              }}
              className="sketch-picker"
            />
          )}
          <button onClick={() => setToggle(!toggle)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill={penColor}
              className="bi bi-pencil-fill pen"
              viewBox="0 0 16 16"
            >
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
            </svg>
          </button>
        </div>
        <button>
          <input
            type="color"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
            className="background-color-btn"
            style={{
              padding: "0",
              border: "none",
              width: "24px",
              height: "28px",
            }}
          />
        </button>
        <button onClick={clearCanvas} style={{ paddingTop: "2px" }}>
          <RefreshIcon />
        </button>
        <button onClick={downloadCanvas}>
          <DownloadIcon />
        </button>
        <div>
          <input
            type="range"
            min="1"
            max="20"
            value={penSize}
            className="slider"
            id="myRange"
            onChange={handlePenSize}
          />
        </div>
        <button onClick={() => setErasing(!erasing)}>
          {erasing ? "Pen" : "Eraser"}
        </button>
        <button onClick={saveToLocalStorage}>
          <ExportIcon />
        </button>
        <button onClick={loadFromLocalStorage}>
          <ImportIcon />
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
