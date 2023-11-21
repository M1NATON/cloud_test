const SET_USER = "SET_USER"
const LOGOUT = "LOGOUT"

const token = localStorage.getItem('token');

const defaultState = {
    currentUser: {},
    isAuth: token ? true : false // Устанавливаем isAuth в true, если токен существует в localStorage
}

export default function userReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                currentUser: action.payload,
                isAuth: true
            }
        case LOGOUT:
            localStorage.removeItem('token')
            return {
                ...state,
                currentUser: {},
                isAuth: false
            }
        default:
            return state
    }
}


export const setUser = user => ({type: SET_USER, payload: user})
export const logout = () => ({type: LOGOUT})
