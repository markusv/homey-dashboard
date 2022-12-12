import { useEffect, useState } from 'react'
import { getHomey } from '../../../helpers/getHomey'

export const useGetDevice = (deviceId) => {
  const [device, setDevice] = useState();
  useEffect(() => {
    const getD = async () => {
      try {
        const homeyApi = await getHomey()
        const d = await homeyApi.devices.getDevice({id: deviceId})
        setDevice(d);
      } catch {}
    }
    getD();
  }, []);
  return [device, setDevice]
}