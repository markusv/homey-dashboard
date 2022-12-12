import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getHomey } from '../helpers/getHomey'

export const fetchFavoriteDevices = createAsyncThunk(
  'favoriteDevices/fetch',
  async (userId, thunkAPI) => {
    const homeyApi = await getHomey();
    const me = await homeyApi.users.getUserMe();
    return me.properties?.favoriteDevices ?? [];
  }
)

const favoriteDevicesSlice = createSlice({
  name: 'favoriteDevices',
  initialState: {
    loading: true,
    favoriteDeviceIds: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFavoriteDevices.fulfilled, (state, action) => {
      state.favoriteDeviceIds = action.payload;
      state.loading = false;
    })
    builder.addCase(fetchFavoriteDevices.pending, (state, action) => {
      state.loading = true;
    })
  },
})

export default favoriteDevicesSlice.reducer;