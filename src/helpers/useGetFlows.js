import { useEffect, useState } from "react";

export const useGetFlows = (homey) => {
  const [flows, setFlows] = useState();
  useEffect(() => {
    const getFlows = async () => {
      setFlows(await homey.flow.getFlows())
    }
    if (homey) {
      getFlows();
    }
  }, [homey])
  return [flows]
}