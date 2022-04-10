import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRunners = createAsyncThunk(
  "runners/fetchRunners",
  async () => {
    const response = await fetch(
      "http://karttalehtinen.fi/testijuoksu/service/testijuoksu2.php?query=runners"
    );
    const runners = await response.json();
    return runners;
  }
);

export const runnerSlice = createSlice({
  name: "runners",
  initialState: { runners: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRunners.fulfilled, (state, action) => {
      state.runners = action.payload;
    });
  },
});
