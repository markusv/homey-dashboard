import React from "react";

/**
 * Official Homey Roborock device icon (top-down round vacuum + laser turret + logo).
 */
export const VacuumIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 800 800"
    width="1em"
    height="1em"
    aria-hidden="true"
    focusable="false"
    fill="none"
  >
    {/* Outer / inner body rings */}
    <circle
      cx="400"
      cy="400"
      r="379.35"
      stroke="currentColor"
      strokeWidth="30"
    />
    <circle
      cx="400"
      cy="400"
      r="329.17"
      stroke="currentColor"
      strokeWidth="20"
    />
    {/* LiDAR / sensor turret */}
    <circle
      cx="396.05"
      cy="362.91"
      r="117.27"
      stroke="currentColor"
      strokeWidth="20"
    />
    <circle
      cx="396.06"
      cy="364.16"
      r="88.74"
      stroke="currentColor"
      strokeWidth="15"
    />
    {/* Horizontal deck lines */}
    <line
      x1="70.83"
      y1="364.16"
      x2="307.32"
      y2="364.16"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
    />
    <line
      x1="484.8"
      y1="363.53"
      x2="723.39"
      y2="363.53"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
    />
    {/* Roborock mark */}
    <path
      fill="currentColor"
      d="M427.98,394.7h-63.83c-2.06,0-3.75-1.67-3.75-3.73c0-1,0.39-1.96,1.12-2.67l1.14-1.14l46.8-46.25h-39c-0.16,0-0.29-0.14-0.29-0.29c0-0.08,0.04-0.16,0.08-0.22l6.83-6.79h41.37c2.06,0,3.75,1.67,3.75,3.73c0,1-0.39,1.96-1.12,2.67l-0.92,0.9l-46.86,46.25h45.57l-17.81-17.81l5.32-5.32l23.11,23.13l1.16,1.16c1.45,1.45,1.45,3.83,0,5.28C429.92,394.31,428.96,394.7,427.98,394.7"
    />
  </svg>
);
