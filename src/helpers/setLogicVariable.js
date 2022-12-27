import { getHomey } from "./getHomey";

export const setLogicVariable = async (logicVariableId, value) => {
  const homeyApi = await getHomey();
  await homeyApi.logic.updateVariable({
    id: logicVariableId,
    variable: { value },
  });
};
