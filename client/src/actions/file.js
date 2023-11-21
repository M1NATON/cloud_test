// import axios from 'axios'
// import {addFile, setFiles} from "../reducers/fileReducer";
//
// export function getFiles(dirId) {
//     return async dispatch => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/files${dirId ? '?parent='+dirId : ''}`, {
//                 headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
//             })
//             dispatch(setFiles(response.data))
//         } catch (e) {
//             alert(e.response.data.message)
//         }
//     }
// }
//
// export function createDir(dirId, name) {
//     return async dispatch => {
//         try {
//             const response = await axios.post(`http://localhost:5000/api/files`,{
//                 name,
//                 parent: dirId,
//                 type: 'dir'
//             }, {
//                 headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
//             })
//             dispatch(addFile(response.data))
//         } catch (e) {
//             alert(e.response.data.message)
//         }
//     }
// }

export const uploadFile = (file) => {
    return async (dispatch) => {
        try {
            const formData = new FormData();
            formData.append('file', file, file.name);

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:9000/api/files/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData, // Переместите formData в свойство body
            });

            if (!response.ok) {
                throw new Error('File upload failed');
            }

            const result = await response.json();
            dispatch({ type: 'UPLOAD_SUCCESS', payload: result });
        } catch (error) {
            dispatch({ type: 'UPLOAD_FAILURE', payload: error.message });
        }
    };
};

