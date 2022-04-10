import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
};

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvents: (state, action) => {
      state.events = action.payload;
    },
  },
});

export const { addEvents } = eventsSlice.actions;

export const fetchEvents = () => async (dispatch) => {
  const response = await fetch(
    "http://karttalehtinen.fi/testijuoksu/service/testijuoksu2.php?query=eventlist"
  );
  const events = await response.json();
  dispatch(addEvents(events));
};

export default eventsSlice.reducer;
