import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  publisher: [],
  total: 0,
  isPublisherLoading: false,
  error: null,
};

const publisherSlice = createSlice({
  name: "publish",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    // .................. fetch notification listing ....................
    fetchPublisherStart(state) {
      state.isPublisherLoading = true;
    },
    fetchPublisherSuccess(state, action) {
      state.isPublisherLoading = false;
      state.publisher = action.payload.publisher || [];
      state.total = action.payload.total || 0;
    },
    fetchPublisherFailure(state, action) {
      state.isPublisherLoading = false;
      state.error = action.payload;
    }
  },
});

export const {
  fetchPublisherStart,
  fetchPublisherSuccess,
  fetchPublisherFailure,
} = publisherSlice.actions;

export default publisherSlice.reducer;
