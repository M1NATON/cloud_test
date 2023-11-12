import React, {useContext, useState} from 'react';
import {AuthContext} from "../../../context";
import s from './Login.module.css'
import Input from "../../UI/input/Input";
import {useDispatch} from "react-redux";
import {login} from "../../../actions/user";

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    const handleLogin = () => {
        dispatch(login(username, password));
    };


    return (
        <div>
            <div className="container">
                <div className={s.main}>
                    <div className={s.title}>
                        <h2>Авторизация</h2>
                    </div>
                    <div className={s.inputs}>
                        <Input type='text'
                               placeholder="Введите имя..."
                               value={username}
                               setValue={setUsername}
                        />
                        <Input type='password'
                               placeholder="Введите пароль..."
                               value={password}
                               setValue={setPassword}
                        />
                    </div>
                    <div className={s.btn}>
                        <button onClick={handleLogin}>войти</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;


//
