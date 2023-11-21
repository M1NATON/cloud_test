import axios from "axios";
import {setUser, logout} from "../reducers/userReducer";

console.log("localStorage в начале кода user.js: ", localStorage.getItem('token'));

export const registration = async (email, password) => {
    try {
        const response = await axios.post(`http://localhost:9000/api/auth/registration`, {
            email,
            password
        })
        alert(response.data.message)
        console.log(response.data)

    } catch (e) {
        // alert(e.response.data.message)
    }
}



export const login = (email, password) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`http://localhost:9000/api/auth/login`, {
                email,
                password
            });

            console.log(response.data);
            const token = response.data.token;
            if (token) {
                dispatch(setUser(response.data.user));
                localStorage.setItem('token', token);
            } else {
                alert("No token found in the response.");
            }
        } catch (e) {
            alert(e.response.data.message);
        }
    };
};

export const auth = () => {
    return async dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        try {
            const response = await axios.get(`http://localhost:9000/api/auth/auth`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`response проверка снизу`)
            console.log(response)
            dispatch(setUser(response.data.user));
            localStorage.setItem('token', response.data.token);
        } catch (e) {
            if (e.response && e.response.status === 401) {

                localStorage.removeItem('token');
            } else {
                alert("Error while fetching user data.");
            }
        }
    };
};





