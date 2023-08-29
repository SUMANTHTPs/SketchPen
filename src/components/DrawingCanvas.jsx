import React, { useState, useRef, useEffect } from "react";

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        style={{ border: "1px solid black", backgroundColor }}
      ></canvas>
      <div>
        <label>Background Color: </label>
        <input
          type="color"
          value={backgroundColor}
          onChange={handleBackgroundColorChange}
        />
      </div>
      <div>
        <label>Pen Color: </label>
        <input type="color" value={penColor} onChange={handlePenColorChange} />
      </div>
      <button onClick={clearCanvas}>Clear</button>
      <button onClick={downloadCanvas}>Download as Image</button>
      <select name="PenSize" id="PenSize" onChange={handlePenSize}>
        <option value={1}>Small</option>
        <option value={3}>Medium</option>
        <option value={10}>Large</option>
      </select>
    </div>
  );
};

export default DrawingCanvas;
