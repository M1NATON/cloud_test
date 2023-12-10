import axios from 'axios'
import {setFiles, deleteFile} from "../reducers/fileReducer";


export const uploadFile = (file) => {
    return async (dispatch) => {
        try {
            const formData = new FormData();
            formData.append('file', new Blob([file], { type: file.type }), encodeURIComponent(file.name)); // Явно указываем кодировку

            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:9000/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch({ type: 'ADD_FILE', payload: response.data });
        } catch (error) {
            console.log(error);
        }
    };
};


export const getFile = () => {
    return async dispatch => {
        try {
            const response = await axios.get('http://localhost:9000/api/files', {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            console.log('localStorage.getItem(\'token\')', localStorage.getItem('token'))
            dispatch(setFiles(response.data))
            console.log('response.data', response.data)
        } catch (error) {
            console.log(error)
        }
    }
}

export const deleteFileRequest  = (userId, fileId) => {
    return async dispatch => {
        try {
            // console.log(fileId, 'файл айди в файле file.js ')
            const response = await axios.delete(`http://localhost:9000/api/files/${userId}/${fileId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

        return response.data
        } catch (error) {
            console.error('Delete file error', error);
            // throw new Error('Failed to delete file');
        }
    }
}



// Функция для скачивания файла
export const downloadFile = (userId, fileId, fileName) => {
    return async () => {
        try {
            const response = await axios.get(`http://localhost:9000/api/files/download/${userId}/${fileId}`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName; // Установите желаемое имя файла
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download file error', error);
        }
    };
};