const { CURRENT_PARTICIPANT } = require("./actions")

const initialState={
    participantdata:null,
}
const participantDataReducer=(state=initialState,action)=>{
    switch(action.type){
        case CURRENT_PARTICIPANT:
            // //console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            //console.log(action.payload);
            return{
                ...state,
                participantdata:action.payload,
            };
            default:
                return state;
    }

}
export default participantDataReducer;