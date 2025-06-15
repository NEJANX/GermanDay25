import React, { useMemo } from "react";

const MIN_BALLS = 3;
const MAX_BALLS = 4;
const MIN_SIZE = 180;
const MAX_SIZE = 250;
const MIN_OPACITY = 0.2;
const MAX_OPACITY = 0.25;
const BLUR_PX = 10;
const MIN_LEFT = 5;
const MAX_LEFT = 85;
const MIN_TOP = 10;
const MAX_TOP = 80;
const MIN_DIST = 20;
const MAX_ATTEMPTS = 5;
const GRADIENT = "linear-gradient(135deg, rgba(255,255,255,0.18) 60%, rgba(255,255,255,0.10) 100%)";
const SHADOW = "0 0 60px 0 rgba(255,255,255,0.12)";

function generateBalls() {
  const count = Math.floor(Math.random() * (MAX_BALLS - MIN_BALLS + 1)) + MIN_BALLS;
  const usedPositions = [];
  return Array.from({ length: count }).map((_, i) => {
    let left, top, attempts = 0;
    do {
      left = Math.random() * (MAX_LEFT - MIN_LEFT) + MIN_LEFT;
      top = Math.random() * (MAX_TOP - MIN_TOP) + MIN_TOP;
      attempts++;
    } while (
      usedPositions.some(pos => Math.abs(pos.left - left) < MIN_DIST && Math.abs(pos.top - top) < MIN_DIST) && attempts < MAX_ATTEMPTS
    );
    usedPositions.push({ left, top });
    const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
    const opacity = Math.random() * (MAX_OPACITY - MIN_OPACITY) + MIN_OPACITY;
    return {
      key: i,
      style: {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
        opacity,
        filter: `blur(${BLUR_PX}px)`,
        boxShadow: SHADOW,
        background: GRADIENT
      },
    };
  });
}

export default function FrostedBallsBackground() {
  const balls = useMemo(() => generateBalls(), []);
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {balls.map(ball => (
        <div
          key={ball.key}
          className="absolute rounded-full"
          style={ball.style}
        />
      ))}
    </div>
  );
}
