import React from "react";
import { useDrawingContext } from "../context/drawingContext";

const PenSizeSlider = () => {
  const { penSize, setPenSize } = useDrawingContext();
  const handlePenSize = (e) => {
    setPenSize(e.target.value);
  };
  return (
    <div>
      <input
        type="range"
        min="1"
        max="25"
        value={penSize}
        className="slider"
        id="myRange"
        onChange={handlePenSize}
        data-test-id="Slider"
      />
    </div>
  );
};

export default PenSizeSlider;
