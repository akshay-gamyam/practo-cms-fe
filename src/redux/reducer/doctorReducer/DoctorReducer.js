import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  doctorPointer: [],
  selectedDoctorPointer: null,
  isDoctorPointerViewLoading: false,
  isDoctorPointerCreateLoading: false,
  error: null,
};

const doctorPointersSlice = createSlice({
  name: "doctor_pointers",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    // ................. create dorctor pointers ........................
    createDoctorPointerStart(state) {
      state.isDoctorPointerCreateLoading = true;
      state.error = null;
    },
    createDoctorPointerSuccess(state, action) {
      state.isDoctorPointerCreateLoading = false;
      console.log("acrtion payload", action.payload)
      state.doctorPointer.unshift(action.payload);
      state.error = null;
    },
    createDoctorPointerFailure(state, action) {
      state.isDoctorPointerCreateLoading = false;
      state.error = action.payload;
    },

    // ................. fetch single Doctor Pointer ........................
    fetchViewDoctorPointerStart(state) {
      state.isTopicsViewLoading = true;
    },
    fetchViewDoctorPointerSuccess(state, action) {
      state.isTopicsViewLoading = false;
      state.selectedDoctorPointer = action.payload;
      state.error = null;
    },
    fetchViewDoctorPointerFailure(state, action) {
      state.isTopicsViewLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  createDoctorPointerStart,
  createDoctorPointerSuccess,
  createDoctorPointerFailure,
  fetchViewDoctorPointerStart,
  fetchViewDoctorPointerSuccess,
  fetchViewDoctorPointerFailure
} = doctorPointersSlice.actions;

export default doctorPointersSlice.reducer;
