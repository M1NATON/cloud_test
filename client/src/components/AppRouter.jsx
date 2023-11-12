import React, {useContext, useEffect} from 'react';
import {AuthContext} from "../context";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./authorization/login/Login";
import Registration from "./authorization/registration/Registration";
import Disk from "./disk/Disk";
import {privateRoutes, publicRoutes} from "../router/routes";
import {useDispatch, useSelector} from "react-redux";
import {auth} from "../actions/user";

const AppRouter = () => {

    const isAuth = useSelector(state => state.user.isAuth)

    const dispatch = useDispatch()

    console.log(isAuth)

    useEffect(() => {
        dispatch(auth())
    }, [])

    return (
        <div>
            {
                !isAuth ? <Routes>
                    {publicRoutes.map(route => <Route
                        element={<route.element/>}
                        path={route.path}
                        key={route.path}

                    />)
                    }
                    <Route path='/*' element={<Navigate to='/login'/>} replace/>
                    </Routes>
                    : <Routes>

                        {privateRoutes.map(route => <Route
                            element={<route.element/>}
                            path={route.path}
                            key={route.path}

                        />)

                        }

                        <Route path='/*' element={<Navigate to='/disk'/>} replace/>

                    </Routes>

            }
        </div>
    );
};



export default AppRouter;