// reducer.js

import { NAV_COLLAPSE } from '../store/actions';

const initialState = {
  filteredMenuChildrenData: [], // Initial state for the data
};

const filterData = (state = initialState, action) => {
  switch (action.type) {
    case NAV_COLLAPSE:
      return {
        ...state,
        filteredMenuChildrenData: action.payload, 
      };
    default:
      return state;
  }
};

export default filterData;
