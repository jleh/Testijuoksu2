import { createSlice } from "@reduxjs/toolkit";

export const resultsSlice = createSlice({
  name: "results",
  initialState: { eventResults: {}, runnerResults: {} },
  reducers: {
    addEventResults: (state, action) => {
      state.eventResults = {
        ...state.eventResults,
        [action.payload.eventId]: action.payload.results,
      };
    },
  },
});

export const fetchEventResults = (eventId) => async (dispatch) => {
  const response = await fetch(
    `http://karttalehtinen.fi/testijuoksu/service/testijuoksu2.php?query=eventresults&eventId=${eventId}`
  );
  const results = await response.json();

  dispatch(resultsSlice.actions.addEventResults({ eventId, results }));
};
