import React, { forwardRef } from "react";
import "./focusedElement.css";

export const FocusedElement = forwardRef(function MyInput(props, ref) {
  const { title, children, onCloseClick, className, backgroundImageUrl } =
    props;
  const cls = (className ?? "") + " focused-element";
  return (
    <div
      className={`focused-element-container ${
        backgroundImageUrl ? "focused-element-container-background" : ""
      }`}
    >
      {backgroundImageUrl && (
        <div
          className="focused-element-background"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          ref={ref}
        />
      )}
      <div className="focused-element-content">
        <div className="focused-element-header">
          <h1 className="focused-element-title">{title}</h1>
          <button className="focused-element-close-icon" onClick={onCloseClick}>
            X
          </button>
        </div>
        <div className={cls}>{children}</div>
      </div>
    </div>
  );
});
