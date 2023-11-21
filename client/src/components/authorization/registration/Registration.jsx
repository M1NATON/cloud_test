import React, {useContext, useState} from 'react';
import s from "./Registration.module.css";
import Input from "../../UI/input/Input";
import {AuthContext} from "../../../context";
import {registration} from "../../../actions/user";

const Registration = () => {

     const [email, setEmail] = useState('')
     const [password, setPassword] = useState('')

    return (
        <div>
            <div className="container">
                <div className={s.main}>
                    <div className={s.title}>
                        <h2>Регистрация</h2>
                    </div>
                    <div className={s.inputs}>

                        <Input type='text'
                               placeholder="Введите email..."
                               value={email}
                               setValue={setEmail}
                        />
                        <Input type='password'
                               placeholder="Введите пароль..."
                               value={password}
                               setValue={setPassword}
                        />
                    </div>
                    <div className={s.btn}>
                        <button onClick={() => registration(email, password)}>Зарегистрироваться</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;