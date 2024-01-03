import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from '../actions/file';
import cloudDownload from '../assets/img/icon/cloudDownload.png'

const FileUploadComponent = () => {
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState(null);
    const uploadedFile = useSelector((state) => state.uploadedFile);
    const error = useSelector((state) => state.error);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = () => {
        const module = document.getElementById('uploadModal')
        const input = document.querySelector('.btn__upload')
        const cloudUpload = document.querySelector('.cloud__upload')

        if (selectedFile) {
            dispatch(uploadFile(selectedFile));
            module.style.display = 'none'
            cloudUpload.style.background = 'none'
            cloudUpload.style.borderRadius = '5px'
        }
        input.value = ''

    };

    const modalUpload = (e) => {
        e.preventDefault()
        const module = document.getElementById('uploadModal')
        const cloudUpload = document.querySelector('.cloud__upload')
        if (module.style.display === 'block') {
            module.style.display = 'none'
            cloudUpload.style.background = 'none'
            cloudUpload.style.borderRadius = '5px'
        } else {
            module.style.display = 'block'
            cloudUpload.style.background = '#566885'
            cloudUpload.style.borderRadius = '5px'
        }



    }


    return (
        <div className='main__upload'>
            <button className='btn__modal__upload' onClick={modalUpload}>
                <img src={cloudDownload} alt="" className='cloud__upload' id='imgUpload'/>
            </button>
            <div className="upload__modal" id='uploadModal'>
                <input type="file" onChange={handleFileChange} className='btn__upload' placeholder='123'/>
                <button onClick={handleUpload}>Upload</button>
                {uploadedFile && <p>File uploaded: {uploadedFile.name}</p>}
                {error && <p>Error: {error}</p>}
            </div>
        </div>
    );
};

export default FileUploadComponent;