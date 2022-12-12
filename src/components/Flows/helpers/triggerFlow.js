import { getHomey } from "../../../helpers/getHomey";

const triggerAdvancedFlow = async (id) => {
  try {
    const homeyApi = await getHomey();
    await homeyApi.flow.triggerAdvancedFlow({ id });
  } catch (e) {
    console.error(e);
  }
};

export const triggerFlow = async (id) => {
  try {
    const homeyApi = await getHomey();
    await homeyApi.flow.triggerFlow({ id });
  } catch {
    await triggerAdvancedFlow(id);
  }
};
