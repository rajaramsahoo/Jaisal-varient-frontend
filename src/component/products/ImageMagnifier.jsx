import React, { useState } from "react";

function ImageMagnifier({ imgUrl }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

    // Calculate the relative position as a percentage
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    // Calculate exact cursor position for positioning magnifier
    const limitedX = Math.max(0, Math.min(width, e.clientX - left));
    const limitedY = Math.max(0, Math.min(height, e.clientY - top));

    // Set position for background zoom and cursor positioning
    setPosition({ x, y });
    setCursorPosition({ x: limitedX, y: limitedY });
  };

  return (
    <div
      className="img-magnifier-container"
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        className="magnifier-img"
        src={imgUrl}
        alt="Product"
        style={{ width: "100%", height: "100%" }}
      />

      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            width: "200px", // Adjust the size of the magnifier window
            height: "200px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid rgba(0, 0, 0, 0.5)",
            left: `${cursorPosition.x - 100}px`, // Center the magnifier window
            top: `${cursorPosition.y - 100}px`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${imgUrl})`,
              backgroundSize: `${300}% ${300}%`, // Increased zoom level for stronger magnification
              backgroundPosition: `${position.x}% ${position.y}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageMagnifier;
