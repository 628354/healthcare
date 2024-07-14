// third party
import { combineReducers } from 'redux';

// project import
import customizationReducer from './customizationReducer';
// import { navCollapse } from './actions';
import filterData from './navGroupReducer';
import participantDataReducer from './ParticipantReducer';

// ==============================|| REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  filteredMenuChildrenData:filterData,
  participantData:participantDataReducer,
});

export default reducer;


