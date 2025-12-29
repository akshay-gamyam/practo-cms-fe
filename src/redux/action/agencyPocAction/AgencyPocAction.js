import { AGENCY_POC_MY_ASSESSMENT, GET_TOPICS_LIST } from "../../../api/apiEndPoints";
import api from "../../../api/interceptor";
import { LIMIT } from "../../../utils/constants";
import {
  fetchAgencyPocStart,
  fetchAgencyPocSuccess,
  fetchAgencyPocFailure,
   fetchViewAgencyPocStart,
  fetchViewAgencyPocSuccess,
  fetchViewAgencyPocFailure,
} from "../../reducer/agencyPocReducer/AgencyPocReducer";

let isFetchingAgencyPoc = false;
let isViewFetchingAgencyPocInDetailed = false;

// ................ Get agency POC list ....................


export const fetchAgencyPocList = (page = 1, limit = LIMIT) => async (dispatch) => {
    if (isFetchingAgencyPoc) return;
    isFetchingAgencyPoc = true;
    dispatch(fetchAgencyPocStart());

    try {
      const { data } = await api.get(AGENCY_POC_MY_ASSESSMENT, {params: { page, limit }});

      dispatch(
        fetchAgencyPocSuccess({
          agencyPoc: data.topics,
          page: data.page,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
        })
      );

      return data;
    } catch (error) {
      dispatch(
        fetchAgencyPocFailure(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch agency POCs"
        )
      );
      throw error;
    } finally {
      isFetchingAgencyPoc = false;
    }
  };


// .................... fetch single agency topic in detailed ...............

export const fetchDetailedAgencyPocById = (topicId) => async (dispatch) => {
  if (isViewFetchingAgencyPocInDetailed) return;
  isViewFetchingAgencyPocInDetailed = true;
  dispatch(fetchViewAgencyPocStart());

  try {
    const response = await api.get(`${GET_TOPICS_LIST}/${topicId}`);
    console.log("response", response);
    const { topic } = response.data;

    console.log("topic", topic);
    dispatch(fetchViewAgencyPocSuccess({ topic }));

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch user details";
    dispatch(fetchViewAgencyPocFailure(errorMessage));
    throw error;
  } finally {
    isViewFetchingAgencyPocInDetailed = false;
  }
};
