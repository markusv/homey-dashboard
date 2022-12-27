import React, { useEffect, useState } from "react";
import "./focus.css";
import { useGetLogicVariable } from "../../helpers/useGetLogicVariable";
import { HEATPUMP_SET_TEMPERATURE } from "./constants";
import { FocusTemperature } from "./FocusTemperature";
import { SlRange } from "@shoelace-style/shoelace/dist/react";
import { useDebounce } from "../../helpers/useDebounce";
import { setLogicVariable } from "../../helpers/setLogicVariable";

export const Focus = () => {
  const [localTempValue, setLocaltempValue] = useState(0);
  const [heatpumpSetTemperature] = useGetLogicVariable(
    HEATPUMP_SET_TEMPERATURE
  );
  const debouncedLocalTempValue = useDebounce(localTempValue, 1000);

  useEffect(() => {
    if (!heatpumpSetTemperature?.value) return;
    if (heatpumpSetTemperature?.value !== localTempValue) {
      setLocaltempValue(heatpumpSetTemperature?.value);
    }
  }, [heatpumpSetTemperature]);

  useEffect(() => {
    if (!heatpumpSetTemperature?.value) return;
    if (debouncedLocalTempValue !== heatpumpSetTemperature?.value) {
      setLogicVariable(HEATPUMP_SET_TEMPERATURE, debouncedLocalTempValue);
    }
  }, [debouncedLocalTempValue]);

  const onChange = (e) => {
    setLocaltempValue(e.srcElement.value);
  };

  return (
    <div className="focus-container">
      <FocusTemperature />
      <div>
        <div className="temperature">{`Ønsket temperatur: ${localTempValue}`}</div>
        <SlRange
          min={10}
          max={30}
          step={1}
          value={localTempValue}
          onSlChange={onChange}
        />
      </div>
    </div>
  );
};
