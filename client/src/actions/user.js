import axios from "axios";
import {setUser, logout} from "../reducers/userReducer";

console.log("localStorage в начале кода user.js: ", localStorage.getItem('token'));

export const registration = async (username, email, password) => {
    try {
        const response = await axios.post(`http://localhost:9000/api/auth/registration`, {
            username,
            email,
            password
        })
        alert(response.data.message)
        console.log(response.data)

    } catch (e) {
        alert(e.response.data.message)
    }
}



export const login = (username, password) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`http://localhost:9000/api/auth/login`, {
                username,
                password
            });

            console.log(response.data);  // Убедитесь, что здесь есть токен
            dispatch(setUser(response.data.user));

            // Проверьте, что response.data.token не является undefined
            console.log(response.data.token);

            localStorage.setItem('token', response.data.token);
        } catch (e) {
            alert(e.response.data.message);
        }
    };
};




export const auth =  () => {
    return async dispatch => {
        try {
            const response = await axios.get(`http://localhost:9000/api/auth/auth`,
                {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
            )
            dispatch(setUser(response.data.user))
            localStorage.setItem('token', response.data.token)
        } catch (e) {
            alert(e.response.data.message)
            localStorage.removeItem('token')
        }
    }
}









