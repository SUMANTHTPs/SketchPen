import { createContext, useContext, useRef, useState } from "react";

const DrawingContext = createContext();

export const useDrawingContext = () => {
    return useContext(DrawingContext);
};

export function DrawingContextProvider({ children }) {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [context, setContext] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [penColor, setPenColor] = useState("#000000");
    const [penSize, setPenSize] = useState(1);
    const [toggle, setToggle] = useState(false);
    const [erasing, setErasing] = useState(false);

    function setCanvasContext() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth * 0.96;
        canvas.height = window.innerHeight * 0.85;
        setContext(ctx);
    }
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

    const startDrawing = (event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        context.beginPath();
        context.lineWidth = penSize;
        context.moveTo(offsetX, offsetY);
        setDrawing(true);
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
    }

    const saveToLocalStorage = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL(); // Convert canvas content to a data URL
        const storedData = {
            dataURL,
            backgroundColor,
        };
        localStorage.setItem("savedDrawingData", JSON.stringify(storedData));
    }
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
    }
    return (
        <DrawingContext.Provider
            value={{
                canvasRef,
                drawing,
                context,
                backgroundColor,
                penColor,
                penSize,
                toggle,
                erasing,
                setDrawing,
                setContext,
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
                loadFromLocalStorage
            }}
        >
            {children}
        </DrawingContext.Provider>
    );
}
