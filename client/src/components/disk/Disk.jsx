import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadFile } from "../../actions/file"; // Подставьте свои собственные импорты

function Disk() {
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            // Используйте Redux action для отправки файла на сервер с помощью Axios
            console.log(selectedFile)
            dispatch(uploadFile(selectedFile));
        } else {
            console.error('Выберите файл для загрузки');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Загрузить файл</button>
        </div>
    );
}

export default Disk;
