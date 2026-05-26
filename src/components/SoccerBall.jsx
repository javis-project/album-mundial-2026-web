import React from "react";
import soccerBallImg from "../assets/soccer_ball.png";

export default function SoccerBall({ size = 24, className, style }) {
  // Real photorealistic circular soccer ball image asset, animated with CSS
  return (
    <img
      src={soccerBallImg}
      alt="Pelota de fútbol"
      className={className || "spinning-soccer-ball"}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
        display: "inline-block",
        verticalAlign: "middle",
        pointerEvents: "none",
        userSelect: "none",
        ...style
      }}
    />
  );
}
