// store/reducers/customizationReducer.js

import { TOGGLE_DRAWER } from './actions';

const initialState = {
  drawerOpen: true,
  // Other initial states
};

const sideShowData = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DRAWER:
      return {
        ...state,
        drawerOpen: !state.drawerOpen,
      };
    // Other cases
    default:
      return state;
  }
};

export default sideShowData;
