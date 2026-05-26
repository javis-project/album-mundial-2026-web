import React from "react";

export default function SoccerBall({ size = 24, className }) {
  // Premium black and white vector soccer ball SVG
  return (
    <svg 
      className={className || "spinning-soccer-ball"} 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <circle cx="256" cy="256" r="240" fill="#ffffff" stroke="#10121b" strokeWidth="16" />
      <path d="M256 180 L190 228 L215 305 L297 305 L322 228 Z" fill="#10121b" />
      <path d="M256 180 L256 16" stroke="#10121b" strokeWidth="16" />
      <path d="M190 228 L30 176" stroke="#10121b" strokeWidth="16" />
      <path d="M215 305 L110 435" stroke="#10121b" strokeWidth="16" />
      <path d="M297 305 L402 435" stroke="#10121b" strokeWidth="16" />
      <path d="M322 228 L482 176" stroke="#10121b" strokeWidth="16" />
      <path d="M256 16 L120 75 L30 176 L110 270 L110 435 L256 496 L402 435 L402 270 L482 176 L392 75 Z" stroke="#10121b" strokeWidth="16" strokeLinejoin="round" />
    </svg>
  );
}
