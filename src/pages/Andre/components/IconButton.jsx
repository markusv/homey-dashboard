import React from "react";
import classNames from "classnames";

export const IconButton = ({
  icon,
  children,
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
    event.currentTarget.blur();
  };

  const usesCustomActiveStyle =
    typeof className === "string" &&
    (className.includes("andre-icon-button--blinds") ||
      className.includes("andre-icon-button--lit"));

  return (
    <button
      type="button"
      className={classNames("andre-icon-button", className, {
        "andre-icon-button--active": active && !usesCustomActiveStyle,
        "andre-icon-button--pending": pending,
      })}
      aria-label={label}
      aria-pressed={active}
      onClick={handleClick}
      onPointerDown={(event) => event.stopPropagation()}
      style={style}
    >
      {children ?? <sl-icon name={icon} library="default" />}
    </button>
  );
};
