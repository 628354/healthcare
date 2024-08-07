import { FILTER_DATA } from '../store/actions';

// Initial state for filter data
const initialState = {
    filterAllData: []
};

const filterDataReducer = (state = initialState, action) => {
    // console.log('filterDataReducer action:', action); // Log actions to debug
    switch(action.type) {
        case FILTER_DATA:
            return {
                ...state,
                filterAllData: action.payload,
            };
        default:
            return state;
    }
};

export default filterDataReducer;
