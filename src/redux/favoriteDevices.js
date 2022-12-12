import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userAPI } from './userAPI'

const favoriteDevicesSlice = createSlice({
  name: 'favoriteDevices',
  initialState: {
    loading: true,
    favoriteDevices: [],
  },
  reducers: {
    loading(state, action) {
      state.loading = true
    }
  },
})


// First, create the thunk
const fetchUserById = createAsyncThunk(
  'users/fetchByIdStatus',
  async (userId, thunkAPI) => {
    const response = await userAPI.fetchById(userId)
    return response.data
  }
)

export default favoriteDevicesSlice.reducer;