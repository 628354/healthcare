// import { type } from "@testing-library/user-event/dist/types/utility";
// import ParticipantContact from "views/Participant/Profiles/ContactComponent/ContactD";

// action type :
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const MENU_OPEN = '@customization/MENU_OPEN';
export const MENU_TYPE = '@customization/MENU_TYPE';
export const NAV_COLLAPSE ='Nav_COLLAPSE'
export const CURRENT_PARTICIPANT='CURRENT_PARTICIPANT'
export const SHOW_SIDEBAR = 'SHOW_SIDEBAR';

//action creators
export const navCollapse = (data) => ({
   
    type: NAV_COLLAPSE,
    payload: data,
  });


  export const addParticipantData=(data)=>({
    type:CURRENT_PARTICIPANT,
    payload:data,
  })


  
  
  export const showSidebar = (drawerOpen) => ({
    type: SHOW_SIDEBAR,
    payload: drawerOpen,
  });