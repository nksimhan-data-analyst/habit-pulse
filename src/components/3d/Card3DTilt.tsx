import React, { useRef, useState, useCallback } from 'react';

interface Card3DTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export const Card3DTilt: React.FC<Card3DTiltProps> = ({
  children,
  className = '',
  maxTilt = 8,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTransform(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
      );

      setGlarePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.12,
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {/* Dynamic Specular 3D Lighting Sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`,
        }}
      />
    </div>
  );
};
