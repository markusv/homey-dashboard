import React from "react";

export const FocusedElement = ({ title, children }) => {
  return (
    <div className="focus-container">
      <div className="focus-header">
        <h1 className="focus-title">{title}</h1>
        <div className="close-focus-icon">x</div>
      </div>
      <div className="focus-element">{children}</div>
    </div>
  );
};
