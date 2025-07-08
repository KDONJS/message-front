import React, { useState, useEffect } from 'react';
import '../componentes/css/LavaLampBackground.css';

const LavaLampBackground = ({ blobCount = 8, baseColor = '#c0392b' }) => {
  const [blobs, setBlobs] = useState([]);

  useEffect(() => {
    // Generate initial blobs with random properties
    const initialBlobs = Array.from({ length: blobCount }, (_, i) => ({
      id: i,
      size: Math.random() * 80 + 40, // Random size between 40 and 120
      x: Math.random() * 100, // Random x position (0-100%)
      y: Math.random() * 100, // Random y position (0-100%)
      speedX: (Math.random() - 0.5) * 0.2, // Random horizontal speed
      speedY: (Math.random() - 0.5) * 0.2, // Random vertical speed
      color: adjustColor(baseColor, Math.random() * 40 - 20), // Slightly varied color
      borderRadius: Math.random() * 50 + 30 // Random border radius (30-80)
    }));
    setBlobs(initialBlobs);

    // Animation loop
    const interval = setInterval(() => {
      setBlobs(prevBlobs => 
        prevBlobs.map(blob => {
          // Calculate new position with bounds checking
          let newX = blob.x + blob.speedX;
          let newY = blob.y + blob.speedY;
          let newSpeedX = blob.speedX;
          let newSpeedY = blob.speedY;

          // Reverse direction when hitting edges
          if (newX <= 0 || newX >= 100) newSpeedX *= -1;
          if (newY <= 0 || newY >= 100) newSpeedY *= -1;

          // Add some randomness to movement
          if (Math.random() < 0.02) newSpeedX += (Math.random() - 0.5) * 0.1;
          if (Math.random() < 0.02) newSpeedY += (Math.random() - 0.5) * 0.1;

          // Clamp speeds to reasonable values
          newSpeedX = Math.max(-0.5, Math.min(0.5, newSpeedX));
          newSpeedY = Math.max(-0.5, Math.min(0.5, newSpeedY));

          return {
            ...blob,
            x: Math.max(0, Math.min(100, newX)),
            y: Math.max(0, Math.min(100, newY)),
            speedX: newSpeedX,
            speedY: newSpeedY,
            // Slight size variation for lava effect
            size: blob.size + (Math.random() - 0.5) * 2
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [blobCount, baseColor]);

  // Helper function to adjust color brightness
  function adjustColor(color, amount) {
    return color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
  }

  return (
    <div className="lava-lamp-container">
      {blobs.map(blob => (
        <div
          key={blob.id}
          className="lava-blob"
          style={{
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            backgroundColor: `#${blob.color}`,
            borderRadius: `${blob.borderRadius}%`,
            opacity: 0.7,
            filter: 'blur(10px)',
            transition: 'all 0.5s ease-out',
            transform: `translate(-50%, -50%) rotate(${blob.x * 3.6}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default LavaLampBackground;