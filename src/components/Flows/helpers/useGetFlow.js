import { useEffect, useState } from "react";
import { getHomey } from "../../../helpers/getHomey";

export const useGetFlow = (flowId) => {
  const [flow, setFlow] = useState();
  useEffect(() => {
    const getAFlow = async () => {
      try {
        const homeyApi = await getHomey();
        const f = await homeyApi.flow.getAdvancedFlow({ id: flowId });
        setFlow(f);
      } catch {
        // ignore and fall through to advanced flow lookup
      }
    };
    const getF = async () => {
      const homeyApi = await getHomey();
      try {
        const f = await homeyApi.flow.getFlow({ id: flowId });
        setFlow(f);
      } catch {
        return getAFlow();
      }
    };
    getF();
  }, []);
  return [flow];
};
