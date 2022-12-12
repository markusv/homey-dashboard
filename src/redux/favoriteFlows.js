import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getHomey } from '../helpers/getHomey'

export const fetchFavoriteFlows = createAsyncThunk(
  'favoriteFlows/fetch',
  async (userId, thunkAPI) => {
    const homeyApi = await getHomey();
    const me = await homeyApi.users.getUserMe();
    return me.properties?.favoriteFlows ?? [];
  }
)

const favoriteFlowsSlice = createSlice({
  name: 'favoriteFlows',
  initialState: {
    loading: true,
    favoriteFlowIds: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFavoriteFlows.fulfilled, (state, action) => {
      state.favoriteFlowIds = action.payload;
      state.loading = false;
    })
    builder.addCase(fetchFavoriteFlows.pending, (state, action) => {
      state.loading = true;
    })
  },
})

export default favoriteFlowsSlice.reducer;