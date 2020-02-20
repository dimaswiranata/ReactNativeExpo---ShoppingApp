import { LOGIN, SIGNUP, AUTHENTICATE, LOGOUT } from "../actions/auth";

const initialState = {
    token: null,
    userId: null
};

export default (state = initialState, action) => {
    switch (action.type){
        case AUTHENTICATE:
            // Menyimpan token dan userId
            return {
                token: action.token,
                userId: action.userId
            };
        case LOGOUT:
            // Kembali ke initialState
            return initialState;
        // case LOGIN:
        //     return {
        //         token: action.token,
        //         userId: action.userId
        //     };
        // case SIGNUP:
        //     return {
        //         token: action.token,
        //         userId: action.userId
        //     };
        default:
            return state;    
        
    }
};