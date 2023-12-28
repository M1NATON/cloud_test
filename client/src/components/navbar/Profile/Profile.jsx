import React, {useEffect, useState} from 'react';
import s from './Profile.module.css'
import profile from '../../../assets/img/profile/profile.png'
import MyButton from "../../UI/button/MyButton";
import {logout} from "../../../reducers/userReducer";
import {useDispatch} from "react-redux";
import {auth} from "../../../actions/user";

const Profile = () => {

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(auth());
    }, [dispatch]);


    const moduleProfile = () => {
        const module = document.getElementById('module')
        if (module.style.display === 'block') {
            module.style.display = 'none'
        } else {
            module.style.display = 'block'
        }
    }


    return (
        <div className={s.main__profile}>
            <button className={s.profile} onClick={moduleProfile}>
                <img src={profile} alt="" className={s.profile__img}/>

            </button>
            <div className={s.module} id='module'>
                <div className={s.btn__module} onClick={() => {console.log('cl')}}>Профиль</div>
                <MyButton onClick={() => dispatch(logout())}>Выход</MyButton>
            </div>
        </div>


    );
};

export default Profile;