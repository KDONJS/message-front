import React, { useEffect, useState } from 'react';

const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const maxSteps = Math.ceil(value / 5);
    
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out: comienza rápido y se desacelera al final
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentStep = Math.floor(easedProgress * maxSteps);
      const currentValue = Math.min(currentStep * 5, value);

      setDisplay(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(value); // Asegura que termine exacto
      }
    };

    requestAnimationFrame(animate);

    return () => setDisplay(value);
  }, [value, duration]);

  return <span>{display.toLocaleString('es-PE')}</span>;
};

export default AnimatedNumber;
