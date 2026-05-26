import React from "react";

export default function SoccerBall({ size = 24, className }) {
  // Premium classic black and white vector soccer ball SVG
  return (
    <svg 
      className={className || "spinning-soccer-ball"} 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Outer circle/ball body (White base) */}
      <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#10121b" strokeWidth="4" />
      
      {/* Central Pentagon (Black) */}
      <polygon points="50,35 64.3,45.4 58.8,62.1 41.2,62.1 35.7,45.4" fill="#10121b" stroke="#10121b" strokeWidth="1" strokeLinejoin="round" />
      
      {/* Outer panels/gajos (Black, clipped by circle) */}
      {/* Top pentagon panel */}
      <path d="M50 20 L38 12 A46 46 0 0 1 62 12 Z" fill="#10121b" stroke="#10121b" strokeWidth="1" strokeLinejoin="round" />
      
      {/* Top-Right pentagon panel */}
      <path d="M76.5 41.5 L82 26 A46 46 0 0 1 88 48 Z" fill="#10121b" stroke="#10121b" strokeWidth="1" strokeLinejoin="round" />
      
      {/* Bottom-Right pentagon panel */}
      <path d="M65.5 71.5 L78 68 A46 46 0 0 1 55 87 Z" fill="#10121b" stroke="#10121b" strokeWidth="1" strokeLinejoin="round" />
      
      {/* Bottom-Left pentagon panel */}
      <path d="M34.5 71.5 L45 87 A46 46 0 0 1 22 68 Z" fill="#10121b" stroke="#10121b" strokeWidth="1" strokeLinejoin="round" />
      
      {/* Top-Left pentagon panel */}
      <path d="M23.5 41.5 L12 48 A46 46 0 0 1 18 26 Z" fill="#10121b" stroke="#10121b" strokeWidth="1" strokeLinejoin="round" />
      
      {/* Lines connecting the pentagons (Black structural lines) */}
      <line x1="50" y1="35" x2="50" y2="20" stroke="#10121b" strokeWidth="3" strokeLinecap="round" />
      <line x1="64.3" y1="45.4" x2="76.5" y2="41.5" stroke="#10121b" strokeWidth="3" strokeLinecap="round" />
      <line x1="58.8" y1="62.1" x2="65.5" y2="71.5" stroke="#10121b" strokeWidth="3" strokeLinecap="round" />
      <line x1="41.2" y1="62.1" x2="34.5" y2="71.5" stroke="#10121b" strokeWidth="3" strokeLinecap="round" />
      <line x1="35.7" y1="45.4" x2="23.5" y2="41.5" stroke="#10121b" strokeWidth="3" strokeLinecap="round" />
      
      {/* Hexagon borders along outer parts */}
      <line x1="38" y1="12" x2="18" y2="26" stroke="#10121b" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="12" x2="82" y2="26" stroke="#10121b" strokeWidth="3" strokeLinecap="round" />
      <line x1="88" y1="48" x2="78" y2="68" stroke="#10121b" strokeWidth="3" strokeLinecap="round" />
      <line x1="55" y1="87" x2="45" y2="87" stroke="#10121b" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="68" x2="12" y2="48" stroke="#10121b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
