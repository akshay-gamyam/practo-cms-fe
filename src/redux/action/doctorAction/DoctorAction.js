import {
  CREATE_DOCTOR_POINTER,
  GET_DOCTOR_POINTERS_BY_ID,
} from "../../../api/apiEndPoints";
import api from "../../../api/interceptor";
import {
  createDoctorPointerFailure,
  createDoctorPointerStart,
  createDoctorPointerSuccess,
  fetchViewDoctorPointerStart,
  fetchViewDoctorPointerSuccess,
  fetchViewDoctorPointerFailure,
  fetchDoctorPointersStart,
  fetchDoctorPointersSuccess,
  fetchDoctorPointersFailure,
} from "../../reducer/doctorReducer/DoctorReducer";

let isFetchDoctorPointerById = false;

// ..................... create Doctor pointers .......................

export const createDoctorPointers =
  (doctorPointerData) => async (dispatch, getState) => {
    const { isDoctorPointerCreateLoading } = getState().doctor_pointers;
    if (isDoctorPointerCreateLoading) return;

    dispatch(createDoctorPointerStart());
    try {
      const response = await api.post(CREATE_DOCTOR_POINTER, doctorPointerData);
      const { doctorPointer } = response.data;
      dispatch(createDoctorPointerSuccess(doctorPointer));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create doctor pointer";
      dispatch(createDoctorPointerFailure(errorMessage));
      throw error;
    }
  };

// ........................ get detailed pointer by ID .........................

export const fetchDoctorPointersById = (topicId) => async (dispatch) => {
  if (isFetchDoctorPointerById) return;
  isFetchDoctorPointerById = true;
  dispatch(fetchViewDoctorPointerStart());

  try {
    const response = await api.get(`${GET_DOCTOR_POINTERS_BY_ID}/${topicId}`);
    console.log("response", response);
    const { topic } = response.data;

    console.log("topic", topic);
    dispatch(fetchViewDoctorPointerSuccess({ topic }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user details";
    dispatch(fetchViewDoctorPointerFailure(errorMessage));
    throw error;
  } finally {
    isFetchDoctorPointerById = false;
  }
};

// .............. doctor pointer listing ...................

export const fetchDoctorPointers =
  ({ page = 1, limit = 10, search = "", topicId } = {}) =>
  async (dispatch, getState) => {
    const { isDoctorPointerListLoading } = getState().doctor_pointers;

    if (isDoctorPointerListLoading) return;
    dispatch(fetchDoctorPointersStart());

    try {
      const response = await api.get(CREATE_DOCTOR_POINTER, {
        params: { page, limit, search, ...(topicId && { topicId }) },
      });

      dispatch(
        fetchDoctorPointersSuccess({
          pointers: response.data.pointers,
          pagination: {
            page: response.data.page,
            totalPages: response.data.totalPages,
            totalCount: response.data.totalCount,
          },
        })
      );
    } catch (error) {
      dispatch(
        fetchDoctorPointersFailure(
          error.response?.data?.message || "Failed to load Medical Notes"
        )
      );
    }
  };
