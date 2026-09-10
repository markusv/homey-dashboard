import React from "react";

/** Simple roller-blind glyph; optional direction chevron. */
export const BlindIcon = ({ direction, className }) => {
  const showArrow = direction === "up" || direction === "down";
  const isUp = direction === "up";

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4" y="2" width="16" height="2.5" rx="1.1" fill="currentColor" />
      <rect
        x="5.25"
        y="4.5"
        width="13.5"
        height={isUp ? 5 : showArrow ? 9.5 : 12}
        rx="0.6"
        fill="currentColor"
        opacity="0.28"
      />
      <path
        d={
          isUp
            ? "M6.5 6.25h11M6.5 8h11"
            : showArrow
              ? "M6.5 6.5h11M6.5 8.75h11M6.5 11h11M6.5 13.25h11"
              : "M6.5 6.5h11M6.5 9h11M6.5 11.5h11M6.5 14h11"
        }
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        fill="none"
      />
      {showArrow && (
        <path
          d={isUp ? "M8.5 16.5 L12 13 L15.5 16.5" : "M8.5 16 L12 19.5 L15.5 16"}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </svg>
  );
};
