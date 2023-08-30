import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(1);
  const [toggle, setToggle] = useState(false);

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
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    context.closePath();
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  return (
    <div className="container">
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
          <div onClick={() => setToggle(!toggle)}>
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
          </div>
        </div>
        <div>
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
        </div>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={downloadCanvas}>Download as Image</button>
        <select name="PenSize" id="PenSize" onChange={handlePenSize}>
          <option value={1}>x-small</option>
          <option value={3}>small</option>
          <option value={5}>medium</option>
          <option value={10}>Large</option>
        </select>
      </div>
    </div>
  );
};

export default DrawingCanvas;
