import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/authorization/login/Login";
import Registration from "./components/authorization/registration/Registration";
import Disk from "./components/disk/Disk";
import React, { Component }  from 'react';
import {useEffect, useState} from "react";
import {AuthContext} from "./context";
import AppRouter from "./components/AppRouter";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {auth} from "./actions/user";



function App() {

    const isAuth = useSelector(state => state.user.isAuth)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(auth())
    }, [])



    return (


            <BrowserRouter>
                <Navbar/>
                <div className="App">
                    <h1>Client</h1>
                </div>
                <div className="wrap">
                    <AppRouter/>
                </div>
            </BrowserRouter>



    );
}

export default App;
