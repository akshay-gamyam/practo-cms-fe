import {
  CONTENT_LIBRARY_SPECIALITY_LIST,
  CONTENT_LIBRARY_STATUS_LIST,
  PUBLISHER_VIDEOS,
} from "../../../api/apiEndPoints";
import api from "../../../api/interceptor";
import {
  fetchContentLibraryListStart,
  fetchContentLibraryListSuccess,
  fetchContentLibraryListFailure,
  fetchContentLibraryStatusStart,
  fetchContentLibraryStatusSuccess,
  fetchContentLibraryStatusFailure,
  fetchContentLibrarySpecialtyStart,
  fetchContentLibrarySpecialtySuccess,
  fetchContentLibrarySpecialtyFailure,
} from "../../reducer/contentLibraryReducer/ContentLibraryReducer";

let isFetchContentLibraryList = false;
let isFetchContentLibraryStatusList = false;
let isFetchContentLibrarySpecialtyList = false;

// .................. fetch content library listing ..............

export const fetchContentLibraryList =
  (params = {}) =>
  async (dispatch) => {
    if (isFetchContentLibraryList) return;
    isFetchContentLibraryList = true;
    dispatch(fetchContentLibraryListStart());

    try {
      const queryParams = {};

      if (params.page !== undefined && params.page !== null) {
        queryParams.page = params.page;
      }
      if (params.limit !== undefined && params.limit !== null) {
        queryParams.limit = params.limit;
      }

      if (params.search && params.search.trim() !== "") {
        queryParams.search = params.search.trim();
      }

      if (params.status && params.status !== "all") {
        queryParams.status = params.status;
      }

      if (params.specialty && params.specialty !== "all") {
        queryParams.specialty = params.specialty;
      }

      const response = await api.get(PUBLISHER_VIDEOS, {
        params: queryParams,
      });

      const {
        videos,
        currentPage,
        totalPages,
        total,
      } = response.data;

      dispatch(
        fetchContentLibraryListSuccess({
          videos: videos || [],
          currentPage: currentPage || 1,
          totalPages: totalPages || 1,
          total: total || 0,
        })
      );

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch content library";
      dispatch(fetchContentLibraryListFailure(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      isFetchContentLibraryList = false;
    }
  };


// .................. fetch content library status listing ..............

export const fetchContentLibraryStatusList = () => async (dispatch) => {
  if (isFetchContentLibraryStatusList) return;
  isFetchContentLibraryStatusList = true;
  dispatch(fetchContentLibraryStatusStart());

  try {
    const response = await api.get(CONTENT_LIBRARY_STATUS_LIST);
    const { statuses } = response.data;

    dispatch(fetchContentLibraryStatusSuccess({ statuses }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch scripts";
    dispatch(fetchContentLibraryStatusFailure(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    isFetchContentLibraryStatusList = false;
  }
};

// .................. fetch content library  speciality listing ..............

export const fetchContentLibrarySpecialityList = () => async (dispatch) => {
  if (isFetchContentLibrarySpecialtyList) return;
  isFetchContentLibrarySpecialtyList = true;
  dispatch(fetchContentLibrarySpecialtyStart());

  try {
    const response = await api.get(CONTENT_LIBRARY_SPECIALITY_LIST);
    const { specialties } = response.data;

    dispatch(fetchContentLibrarySpecialtySuccess({ specialties }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch scripts";
    dispatch(fetchContentLibrarySpecialtyFailure(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    isFetchContentLibrarySpecialtyList = false;
  }
};
