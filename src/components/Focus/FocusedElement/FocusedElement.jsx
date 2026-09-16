import React, { forwardRef } from "react";
import "./focusedElement.css";

export const FocusedElement = forwardRef((props, ref) => {
  const {
    title,
    children,
    onCloseClick,
    onBackClick,
    className,
    backgroundImageUrl,
  } = props;
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
          {onBackClick ? (
            <button
              type="button"
              className="focused-element-back-icon"
              onClick={onBackClick}
              aria-label="Tilbake"
            >
              ←
            </button>
          ) : null}
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

FocusedElement.displayName = "FocusedElement";
