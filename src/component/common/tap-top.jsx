import React, { useState, useEffect } from "react";

const TapTop = () => {
  const [goingUp, setGoingUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setGoingUp(currentScrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tapToTop = () => {
    let currentPosition = window.scrollY;
    const targetPosition = 0;
    const totalDistance = currentPosition - targetPosition;
    const duration = 1000; 
    let startTime = null;

    const smoothScroll = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1); 
      const easeInOutQuad = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      const nextPosition = currentPosition - easeInOutQuad * totalDistance;
      window.scrollTo(0, nextPosition);

      if (progress < 1) {
        requestAnimationFrame(smoothScroll);
      }
    };

    requestAnimationFrame(smoothScroll);
  };

  return (
    <div
      className="tap-top top-cls"
      style={goingUp ? { display: "block" } : { display: "none" }}
      onClick={tapToTop}
    >
      <div>
        <i className="fa fa-angle-double-up"></i>
      </div>
    </div>
  );
};

export default TapTop;
