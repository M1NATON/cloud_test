import React, {useContext, useEffect} from 'react';
import s from './Navbar.module.css'
import './../../app.css'
import logo from './../../assets/img/logo.svg'
import {Navigate, NavLink} from "react-router-dom";
import {AuthContext} from "../../context/convert";
import MyButton from "../UI/button/MyButton";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectUsername} from "../../reducers/userReducer";
import {auth} from "../../actions/user";
import Profile from "./Profile/Profile";

const Navbar = () => {
    const isAuth = useSelector(state => state.user.isAuth)


    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(auth());
    }, [dispatch]);



    return (
        <header>
            <div className="container">
                <div className={s.header}>
                    <div className={s.logo}>
                        <img src={logo} alt=""/>
                        <p>AL</p>
                    </div>

                    {isAuth ?
                        <div>
                            <Profile/>
                        </div>
                     :
                        <div className={s.auth}>
                            <NavLink className={s.link} to="login">Войти</NavLink>
                            <NavLink className={s.link} to="registration">Регистрация</NavLink>
                        </div>
                    }
                </div>
            </div>
        </header>
    );
};

export default Navbar;

