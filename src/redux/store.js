import { configureStore } from '@reduxjs/toolkit'
import favoriteDevicesReducer from './favoriteDevices'
import favoriteFlowsReducer from './favoriteFlows'
import flowsReducer from './flows'

export const store = configureStore({
  reducer: {
    favoriteDevices: favoriteDevicesReducer,
    favoriteFlowsReducer: favoriteFlowsReducer,
    flows: flowsReducer
  },
})