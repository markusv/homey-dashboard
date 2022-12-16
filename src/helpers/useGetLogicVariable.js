import { useEffect, useState } from "react";
import { getHomey } from "./getHomey";

export const useGetLogicVariable = (logicVariableId) => {
  const [variable, setVariable] = useState();
  useEffect(() => {
    const getV = async () => {
      try {
        const homeyApi = await getHomey();
        if (!homeyApi.isConnected()) {
          await homeyApi.logic.connect();
        }
        const v = await homeyApi.logic.getVariable({ id: logicVariableId });
        setVariable(v);
        v.on("update", (newValue) => {
          setVariable(newValue);
        });
      } catch (e) {
        console.log("error in useGetLogicVariable: ", e);
      }
    };
    getV();
  }, [logicVariableId]);
  return [variable];
};
