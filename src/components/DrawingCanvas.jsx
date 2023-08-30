import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";
import { ReactComponent as DownloadIcon } from "../icons/download.svg";

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
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;
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

    context.globalCompositeOperation = erasing
      ? "destination-out"
      : "source-over"; // Set the composite operation

    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    context.closePath();
    setDrawing(false);
    context.globalCompositeOperation = "source-over"; // Reset the composite operation to default
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

  const handlePenColorChange = (event) => {
    setPenColor(event.target.value);
    context.strokeStyle = event.target.value;
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
      backgroundColor, // Use the background color state directly
    };

    localStorage.setItem("savedDrawingData", JSON.stringify(storedData)); // Store the data in localStorage
  };

  const loadFromLocalStorage = () => {
    const savedDrawingData = localStorage.getItem("savedDrawingData"); // Retrieve the saved data from localStorage
    if (savedDrawingData) {
      const { dataURL, backgroundColor } = JSON.parse(savedDrawingData);

      setBackgroundColor(backgroundColor); // Set the background color

      const image = new Image();
      image.onload = () => {
        context.fillStyle = backgroundColor;
        context.fillRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        ); // Fill the canvas with the background color
        context.drawImage(image, 0, 0); // Draw the saved image onto the canvas
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
              width="16"
              height="16"
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
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="bi bi-arrow-clockwise"
            viewBox="0 0 16 16"
            onClick={clearCanvas}
            style={{ paddingTop: "2px" }}
          >
            <path
              fill-rule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
          </svg>
        </button>
        <button onClick={downloadCanvas}>
            <DownloadIcon />
        </button>
        <div>
          <input
            type="range"
            min="1"
            max="10"
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-download"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
          </svg>
        </button>
        <button onClick={loadFromLocalStorage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-upload"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
