import {
  USER_STATE_CHANGE,
  USER_INSTRUMENTS_STATE_CHANGE,
  USER_RAWTIMESTAMP_STATE_CHANGE,
  USER_RECORDINGS_STATE_CHANGE,
} from "../constants";

const initialState = {
  currentUser: null,
  instruments: [],
  rawTimeStamp: [],
  recordings: [],
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case USER_INSTRUMENTS_STATE_CHANGE:
      return {
        ...state,
        instruments: action.instruments,
      };
    case USER_RAWTIMESTAMP_STATE_CHANGE:
      return {
        ...state,
        rawTimeStamp: action.rawTimeStamp,
      };
    case USER_RECORDINGS_STATE_CHANGE:
      return {
        ...state,
        recordings: action.recordings,
      };
    default:
      return state;
  }
};
