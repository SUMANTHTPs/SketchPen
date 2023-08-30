import React, { useEffect } from "react";
import { SketchPicker } from "react-color";
import { ReactComponent as DownloadIcon } from "../icons/download.svg";
import { ReactComponent as RefreshIcon } from "../icons/refresh.svg";
import { ReactComponent as ExportIcon } from "../icons/export.svg";
import { ReactComponent as ImportIcon } from "../icons/import.svg";
import { ReactComponent as EraserIcon } from "../icons/eraser.svg";
import { ReactComponent as WriteIcon } from "../icons/write.svg";
import { useDrawingContext } from "../context/drawingContext";

const DrawingCanvas = () => {
  const {
    canvasRef,
    context,
    backgroundColor,
    penColor,
    penSize,
    toggle,
    erasing,
    setBackgroundColor,
    setPenColor,
    setPenSize,
    setToggle,
    setErasing,
    setCanvasContext,
    draw,
    startDrawing,
    endDrawing,
    clearCanvas,
    downloadCanvas,
    saveToLocalStorage,
    loadFromLocalStorage,
  } = useDrawingContext();

  useEffect(() => {
    setCanvasContext();
  }, []);

  const handleBackgroundColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };

  const handlePenSize = (e) => {
    setPenSize(e.target.value);
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
          {erasing ? <WriteIcon /> : <EraserIcon />}
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
