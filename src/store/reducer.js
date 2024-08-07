// third party
import { combineReducers } from 'redux';

// project import
import customizationReducer from './customizationReducer';
// import { navCollapse } from './actions';
import filterData from './navGroupReducer';
import participantDataReducer from './ParticipantReducer';
import Sidebar from 'layout/MainLayout/Sidebar';
import customizationReducerData from '../store/ShowSideBarReducer'
import filterDataReducer from './filterDataReducer';
// ==============================|| REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  filteredMenuChildrenData:filterData,
  participantData:participantDataReducer,
  SidebarData:customizationReducerData,
  filterAllData: filterDataReducer

});

export default reducer;


