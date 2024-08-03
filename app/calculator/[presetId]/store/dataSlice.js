import { createSlice } from '@reduxjs/toolkit';

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    carbonEmissions: [],
    costProfiles: [],
    demand: [],
    fuels: [],
    vehiclesFuels: [],
    vehicles: [],
    fleet: [],
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
        case 'storeVar': {
          state[action.payload.target] = action.payload.payload
          return state
        }
        case 'appendFleet': {
          return {
            ...state,
            fleet: [...state.fleet, action.payload.payload]
           }
        }
        case 'removeFleet': {
          return {
            ...state,
            fleet: state.fleet.filter(item => item[4] !== action.payload.payload)
           }
        }
        case 'updateDemand': {
          console.log(action)
          const rowIndex = state.demand.findIndex(item => item[4] === action.payload.target);
          const newRow = [...state.demand[rowIndex]];
          newRow[3] = action.payload.payload;

          return {
            ...state,
            demand: [
              ...state.demand.slice(0, rowIndex),
              newRow,
              ...state.demand.slice(rowIndex + 1)
            ]
           }
        }
      }
    },
  },
});

export const { increment, decrement, setValue } = dataSlice.actions;

export default dataSlice.reducer;