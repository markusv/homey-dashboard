import React, { forwardRef, ViewTransition } from "react";
import "./focusedElement.css";

const OverlayIconButton = ({ label, icon, onClick, className }) => (
  <button
    type="button"
    className={className}
    onClick={onClick}
    aria-label={label}
  >
    <sl-icon name={icon} library="default" />
  </button>
);

export const FocusedElement = forwardRef((props, ref) => {
  const {
    title,
    children,
    onCloseClick,
    onBackClick,
    className,
    backgroundImageUrl,
    titleTransitionName,
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
            <ViewTransition enter="focus-fade-in" exit="focus-fade-out">
              <OverlayIconButton
                label="Tilbake"
                icon="chevron-left"
                onClick={onBackClick}
                className="focused-element-icon-button focused-element-back-icon"
              />
            </ViewTransition>
          ) : null}
          {titleTransitionName ? (
            <ViewTransition
              name={titleTransitionName}
              share="speaker-share-name"
              default="none"
            >
              <h1 className="focused-element-title">{title}</h1>
            </ViewTransition>
          ) : (
            <h1 className="focused-element-title">{title}</h1>
          )}
          <OverlayIconButton
            label="Lukk"
            icon="x-lg"
            onClick={onCloseClick}
            className="focused-element-icon-button focused-element-close-icon"
          />
        </div>
        <div className={cls}>{children}</div>
      </div>
    </div>
  );
});

FocusedElement.displayName = "FocusedElement";
