import axios from "axios";
import {setUser, logout} from "../reducers/userReducer";

console.log("localStorage token on page load: ", localStorage.getItem('token'));

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

            console.log(response.data);  // Добавьте эту строку
            dispatch(setUser(response.data.user));
            console.log(response.data);

            localStorage.setItem('token', response.data.token);
        } catch (e) {
            alert(e.response.data.message);
        }
    };
};



export const auth =  () => {
    return async dispatch => {
        try {
            const token = localStorage.getItem('token');
            console.log(`localStorage token on page load: ${token}`);

            // Добавьте эту строку
            console.log(`Authorization header token: ${token}`);

            const response = await axios.get(`http://localhost:9000/api/auth/auth`, {
                headers: { Authorization: 'Bearer ' + token }
            });

            console.log(response.data);
            console.log(`${token} токен в функции auth`);

            dispatch(setUser(response.data.user));
            localStorage.setItem('token', response.data.token);
        } catch (e) {
            console.error('Auth error', e);
            console.log(e.response.data.message);
            localStorage.removeItem('token');
        }
    };
};










