import React from "react";
import classNames from "classnames";

/** Fan glyph; spins when `spinning` is true. */
export const FanIcon = ({ className, spinning = false }) => (
  <svg
    className={classNames("andre-fan-icon", className, {
      "andre-fan-icon--spinning": spinning,
    })}
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-hidden="true"
    focusable="false"
    fill="currentColor"
  >
    <g>
      {/* Three larger blades around center */}
      <path
        d="M12 1.4c2.35 0 4 2.05 3.45 4.25C14.75 8.35 12.65 9.7 12 9.7s-2.75-1.35-3.45-4.05C7.99 3.45 9.65 1.4 12 1.4z"
        opacity="0.95"
      />
      <path
        d="M12 1.4c2.35 0 4 2.05 3.45 4.25C14.75 8.35 12.65 9.7 12 9.7s-2.75-1.35-3.45-4.05C7.99 3.45 9.65 1.4 12 1.4z"
        opacity="0.95"
        transform="rotate(120 12 12)"
      />
      <path
        d="M12 1.4c2.35 0 4 2.05 3.45 4.25C14.75 8.35 12.65 9.7 12 9.7s-2.75-1.35-3.45-4.05C7.99 3.45 9.65 1.4 12 1.4z"
        opacity="0.95"
        transform="rotate(240 12 12)"
      />
      <circle cx="12" cy="12" r="2.15" />
    </g>
  </svg>
);
