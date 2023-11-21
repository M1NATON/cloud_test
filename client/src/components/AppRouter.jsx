import React, {useContext, useEffect} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
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