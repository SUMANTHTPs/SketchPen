import React, { useEffect } from "react";
import { useDrawingContext } from "../context/drawingContext";
import Canvas from "./Canvas";
import Options from "./Options";

const DrawingCanvas = () => {
  const { erasing, setCanvasContext } = useDrawingContext();

  useEffect(() => {
    setCanvasContext();

    window.addEventListener("resize", setCanvasContext);
    return () => {
      window.removeEventListener("resize", setCanvasContext);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={erasing ? "container rubber-cursor" : "container"}>
      <Canvas />
      <Options />
    </div>
  );
};

export default DrawingCanvas;
