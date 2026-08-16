import React from "react";
import classNames from "classnames";

export const IconButton = ({
  icon,
  label,
  active = false,
  pending = false,
  onClick,
  style,
  className,
}) => {
  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (pending) return;
    onClick?.(event);
  };

  return (
    <button
      type="button"
      className={classNames("andre-icon-button", className, {
        "andre-icon-button--active": active,
        "andre-icon-button--pending": pending,
      })}
      aria-label={label}
      aria-pressed={active}
      onClick={handleClick}
      onPointerDown={(event) => event.stopPropagation()}
      style={style}
    >
      <sl-icon name={icon} library="default" />
    </button>
  );
};
