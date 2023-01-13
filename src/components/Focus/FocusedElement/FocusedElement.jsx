import React from "react";
import "./focusedElement.css";

export const FocusedElement = ({
  title,
  children,
  onCloseClick,
  className,
}) => {
  const cls = (className ?? "") + " focused-element";
  return (
    <div className="focused-element-container">
      <div className="focused-element-header">
        <h1 className="focused-element-title">{title}</h1>
        <button className="focused-element-close-icon" onClick={onCloseClick}>
          X
        </button>
      </div>
      <div className={cls}>{children}</div>
    </div>
  );
};
