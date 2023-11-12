import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { uploadFile } from "../../actions/file"; // Подставьте свои собственные импорты

function Disk() {
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            console.log(selectedFile)
            dispatch(uploadFile(selectedFile));
        } else {
            console.error('Выберите файл для загрузки');
        }
    };
    const user = useSelector(state => state.user.currentUser)
    console.log(user)
    return (
        <div>
            <h1>Username: {user.username}</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Загрузить файл</button>
        </div>
    );
}

export default Disk;
