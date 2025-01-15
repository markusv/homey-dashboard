import React, { useEffect, useState } from "react";
import "./focus.css";
import { useGetLogicVariable } from "../../helpers/useGetLogicVariable";
import { HEATPUMP_SET_TEMPERATURE } from "./constants";
import { FocusTemperature } from "./FocusTemperature";
import { SlRange } from "@shoelace-style/shoelace/dist/react";
import { useDebounce } from "../../helpers/useDebounce";
import { setLogicVariable } from "../../helpers/setLogicVariable";
import { UtilityPricesSmall } from "../UtilityPrices/UtilityPricesSmall";
import { ErrorBoundary } from "../ErrorBoundary";
import { Weather } from "../Weather/Weather";

export const Focus = ({ onSetFocus }) => {
  return (
    <div className="focus-container">
      <div className="focus-left">
        <FocusTemperature />
      </div>
      <div className="focus-right">
        <ErrorBoundary>
          <UtilityPricesSmall
            onSetFocus={onSetFocus}
            className="focus-utilityprices"
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Weather onSetFocus={onSetFocus} className="focus-weather" />
        </ErrorBoundary>
      </div>
    </div>
  );
};
