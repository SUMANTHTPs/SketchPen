import React, { useEffect } from "react";
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

  useEffect(() => {
    // Add touchmove event listener to prevent swipe-down-to-refresh behavior
    const preventRefresh = (event) => {
      event.preventDefault();
    };

    // Attach the event listener to the canvas
    const canvas = canvasRef.current;
    canvas.addEventListener("touchmove", preventRefresh, { passive: false });

    // Clean up the event listener when the component unmounts
    return () => {
      canvas.removeEventListener("touchmove", preventRefresh);
    };
  }, [canvasRef]);
  
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
