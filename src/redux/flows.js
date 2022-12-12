import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getHomey } from '../helpers/getHomey'

export const fetchFlows = createAsyncThunk(
  'flows/fetch',
  async (userId, thunkAPI) => {
    const homeyApi = await getHomey();
    const [flows, aFlows] = await Promise.all([homeyApi.flow.getFlows(), homeyApi.flow.getAdvancedFlows()])
    return {...(flows ?? {}), ...(aFlows ?? {})};
  }
)

const flowsSlice = createSlice({
  name: 'flows',
  initialState: {
    loading: true,
    flows: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFlows.fulfilled, (state, action) => {
      state.flows = action.payload;
      state.loading = false;
    })
    builder.addCase(fetchFlows.pending, (state, action) => {
      state.loading = true;
    })
  },
})

export default flowsSlice.reducer;