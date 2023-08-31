import React from "react";
import { useDrawingContext } from "../context/drawingContext";

const Canvas = () => {
  const {
    canvasRef,
    backgroundColor,
    setToggle,
    draw,
    startDrawing,
    endDrawing,
  } = useDrawingContext();
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseOut={endDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={endDrawing}
      onTouchCancel={endDrawing}
      className="drawing-canvas"
      style={{
        border: ".1px solid lightgrey",
        backgroundColor,
        borderRadius: "16px",
      }}
      onClick={() => setToggle(false)}
    ></canvas>
  );
};

export default Canvas;
