import { createSlice } from '@reduxjs/toolkit';

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    value: {},
    startYear: 0,
    endYear: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setValue: (state, action) => {
      switch (action.payload.type) {
        case 'replace': {
          state.value = action.payload.payload
        }
        case 'storeVar': {
          state[action.payload.target] = action.payload.payload
        }
      }
    },
  },
});

export const { increment, decrement, setValue } = dataSlice.actions;

export default dataSlice.reducer;