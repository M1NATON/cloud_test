// actions.js
import axios from 'axios';

export const uploadFile = (file) => {
    return (dispatch) => {
        const formData = new FormData();
        formData.append('file', file);

        // Здесь нужно указать URL для загрузки файла на сервер
        axios
            .post('http://localhost:9000/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                console.log('Файл успешно зерерагружен');
            })
            .catch((error) => {
                console.error('Ошибка при загрузке файла', error);
            });
    };
};
