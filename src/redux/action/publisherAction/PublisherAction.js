import {
  GET_PUBLISHER_LIST,
} from "../../../api/apiEndPoints";
import api from "../../../api/interceptor";
import { LIMIT } from "../../../utils/constants";
import {
  fetchPublisherStart,
  fetchPublisherSuccess,
  fetchPublisherFailure,
} from "../../reducer/publisherReducer/PublisherReducer";

let isFetchingPublisher = false;

// ,....................... get notification listing ..................

  export const fetchPublisherList = (page = 1, limit = LIMIT) => async (dispatch) => {
    if (isFetchingPublisher) return;
    isFetchingPublisher = true;
    dispatch(fetchPublisherStart());

    try {
      const response = await api.get(`${GET_PUBLISHER_LIST}?page=${page}&limit=${limit}`);

    const { topics, page: currentPage, totalPages, totalCount } = response.data;
      dispatch(fetchPublisherSuccess({ topics,  page: currentPage, totalPages, totalCount, }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch users";
      dispatch(fetchPublisherFailure(errorMessage));
      throw error;
    } finally {
      isFetchingPublisher = false;
    }
  };