import React, {useEffect, useState} from 'react';
import s from './Profile.module.css'
import profile from '../../../assets/img/profile/profile.png'
import MyButton from "../../UI/button/MyButton";
import {logout} from "../../../reducers/userReducer";
import {useDispatch, useSelector} from "react-redux";
import {auth} from "../../../actions/user";
import {convert} from "../../../context/convert";

const Profile = () => {

    const dispatch = useDispatch();
    const file = useSelector(state => state.files.files)
    const user = useSelector(state => state.user.currentUser);
    const totalSize = file.reduce((accumulator, currentValue) => +accumulator + +currentValue.size, 0);
    const count = file.length



    useEffect(() => {
        dispatch(auth());
    }, [dispatch]);


    const moduleProfile = (e) => {
        const module = document.getElementById('module')
        const img = document.getElementById('img')
        if (module.style.display === 'block') {
            module.style.display = 'none'
        } else {
            module.style.display = 'block'
        }


        document.addEventListener('click', (e) => {
            let target = e.target
            if (target !== module && target !== img) module.style.display = 'none'
        })
    }






    const openModal = (e) => {
        e.preventDefault()
        const modal = document.getElementById('profileModule')
        modal.style.display = 'block'
        console.log('open')

    }

    const closeModal = (e) => {
        e.preventDefault()
        const modal = document.getElementById('profileModule')
        modal.style.display = 'none'
        console.log('close')

    }
    console.log(convert(totalSize))


    return (
        <div className={s.main__profile}>
            <button className={s.profile} onClick={moduleProfile}>
                <img src={profile} alt="" className={s.profile__img} id='img'/>

            </button>
            <div className={s.module} id='module'>
                <button className={s.btn__module} onClick={openModal}>Профиль</button>
                <MyButton onClick={() => dispatch(logout())}>Выход</MyButton>
            </div>
            <div id='profileModule' className={s.profile__module}>
                <h1>Ваша почта: {user.email}</h1>
                <h1>Количество файлов: {count}</h1>
                <h1>Общий размер файлов: {convert(totalSize)}</h1>
                <span className={s.close__modal} onClick={closeModal}>X</span>
            </div>
        </div>


    );
};

export default Profile;