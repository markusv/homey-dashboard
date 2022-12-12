import { useEffect, useState } from "react";
import { getHomey } from "./getHomey";

export const useGetFlows = () => {
  const [flows, setFlows] = useState({});
  useEffect(() => {
    const getFlows = async () => {
      const homeyApi = await getHomey();
      if (homeyApi) {
        const [f, aF] = await Promise.all([
          homeyApi.flow.getFlows(),
          homeyApi.flow.getAdvancedFlows(),
        ]);
        setFlows({ ...f, ...aF });
      }
    };
    getFlows();
  }, []);
  return [flows];
};
