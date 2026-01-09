import api from "../../../api/interceptor";
import { toast } from "react-toastify";
import {
  fetchQueueVideosStart,
  fetchQueueVideosSuccess,
  fetchQueueVideosFailure,
  fetchPublishedVideosStart,
  fetchPublishedVideosSuccess,
  fetchPublishedVideosFailure,
  claimVideoStart,
  claimVideoSuccess,
  claimVideoFailure,
  publishVideoStart,
  publishVideoSuccess,
  publishVideoFailure,
} from "../../reducer/publisherReducer/PublisherReducer";
import { PUBLISHER_CLAIM, PUBLISHER_PUBLISH, PUBLISHER_QUEUE, PUBLISHER_VIDEOS } from "../../../api/apiEndPoints";



let isFetchingQueue = false;
let isFetchingPublished = false;

// ................... Fetch Queue Videos (Ready to Publish) ...................
export const fetchQueueVideos = () => async (dispatch) => {
  if (isFetchingQueue) return;
  isFetchingQueue = true;
  
  dispatch(fetchQueueVideosStart());

  try {
    const response = await api.get(PUBLISHER_QUEUE);
    
    dispatch(fetchQueueVideosSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 
      error.message || 
      "Failed to fetch queue videos";
    
    dispatch(fetchQueueVideosFailure(errorMessage));
    toast.error(errorMessage);
    throw error;
  } finally {
    isFetchingQueue = false;
  }
};

// ................... Fetch Published Videos ...................
export const fetchPublishedVideos = (params = {}) => async (dispatch) => {
  if (isFetchingPublished) return;
  isFetchingPublished = true;
  
  dispatch(fetchPublishedVideosStart());

  try {
    const queryParams = new URLSearchParams({
      status: "PUBLISHED",
      page: params.page || 1,
      limit: params.limit || 20,
      ...(params.search && { search: params.search }),
    });

    const response = await api.get(`${PUBLISHER_VIDEOS}?${queryParams}`);
    
    dispatch(fetchPublishedVideosSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 
      error.message || 
      "Failed to fetch published videos";
    
    dispatch(fetchPublishedVideosFailure(errorMessage));
    toast.error(errorMessage);
    throw error;
  } finally {
    isFetchingPublished = false;
  }
};

// ................... Claim Video ...................
export const claimVideo = (videoId) => async (dispatch, getState) => {
  dispatch(claimVideoStart());

  try {
    const response = await api.post(PUBLISHER_CLAIM(videoId));
    
    const userId = getState().auth?.user?.id;
    
    dispatch(claimVideoSuccess({ 
      videoId, 
      userId,
      data: response.data 
    }));
    
    toast.success("Video claimed successfully!");
    
    dispatch(fetchQueueVideos());
    
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 
      error.message || 
      "Failed to claim video";
    
    dispatch(claimVideoFailure(errorMessage));
    toast.error(errorMessage);
    throw error;
  }
};

// ................... Publish Video ...................
export const publishVideo = (videoId, publishData = {}) => async (dispatch) => {
  dispatch(publishVideoStart());

  try {
    const response = await api.post(PUBLISHER_PUBLISH(videoId), publishData);
    
    dispatch(publishVideoSuccess({ 
      videoId,
      data: response.data 
    }));
    
    toast.success("Video published successfully!");
    
    dispatch(fetchQueueVideos());
    dispatch(fetchPublishedVideos());
    
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 
      error.message || 
      "Failed to publish video";
    
    dispatch(publishVideoFailure(errorMessage));
    toast.error(errorMessage);
    throw error;
  }
};
