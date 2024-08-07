import { SHOW_SIDEBAR } from './actions';

const initialState = {
    drawerOpen: false,
  showSidebarId: null, 
};

const customizationReducerData = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SIDEBAR:
      return {
        ...state,
        drawerOpen: action.payload,  
      };
  
    default:
      return state;
  }
};

export default customizationReducerData;
